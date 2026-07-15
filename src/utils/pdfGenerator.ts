import type { jsPDF } from 'jspdf';
import type { InvoiceData } from '../types/invoice';
import { toJpeg } from 'html-to-image';

export const buildInvoicePDF = async (data: InvoiceData): Promise<jsPDF> => {
  const { jsPDF } = await import('jspdf');

  // Look for the dedicated hidden render container
  const element = document.getElementById('pdf-render-container');
  
  if (!element) {
    throw new Error('Invoice capture area not found in DOM.');
  }

  // We wait a tiny bit to ensure fonts and styles are fully rendered
  await new Promise(resolve => setTimeout(resolve, 100));

  // Take a high-resolution snapshot using the browser's native text rendering (fixes language/font issues)
  const dataUrl = await toJpeg(element, { 
    quality: 0.98,
    pixelRatio: 2, // 2x resolution for crisp PDF text
    backgroundColor: '#ffffff'
  });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgProps = doc.getImageProperties(dataUrl);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  let heightLeft = pdfHeight;
  let position = 0;

  // Add the first page
  doc.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;

  // Add subsequent pages if the invoice is longer than one A4 page
  while (heightLeft > 0) {
    position = position - pageHeight; // Shift the image up by exactly one page height
    doc.addPage();
    doc.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  return doc;
};

export const generateInvoicePDF = async (data: InvoiceData) => {
  const filename = `Invoice-${data.details.invoiceNumber || 'draft'}.pdf`;

  // Browser detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  let newWindow: Window | null = null;
  if (isIOS) {
    // Open synchronously to avoid Safari popup blocker
    newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#667085;">Generating PDF...</div>');
    }
  }

  const doc = await buildInvoicePDF(data);

  // For automated subagent testing and screenshots
  const blobUrl = doc.output('bloburl').toString();
  console.log("__PDF_BLOB_URL__:", blobUrl);
  (window as any).__PDF_BLOB_URL__ = blobUrl;

  if (window.location.search.includes('preview=true') || (window as any).__TESTING_PREVIEW__) {
    window.location.href = blobUrl;
    if (newWindow) newWindow.close();
    return;
  }

  if (isIOS) {
    try {
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      if (newWindow) {
        newWindow.location.href = url;
      } else {
        window.location.href = url;
      }
      return;
    } catch (e) {
      console.warn("iOS PDF display failed:", e);
      if (newWindow) newWindow.close();
    }
  }

  // Mobile-friendly progressive enhancement for Android and Desktop
  try {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  } catch (e) {
    console.warn("Fallback to jsPDF save due to:", e);
    doc.save(filename);
  }
};
