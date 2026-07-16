import type { jsPDF } from 'jspdf';
import type { InvoiceData } from '../types/invoice';
import { toPng } from 'html-to-image';

export const buildInvoicePDF = async (_data?: InvoiceData): Promise<jsPDF> => {
  const { jsPDF } = await import('jspdf');

  // Look for the dedicated hidden render container
  const element = document.getElementById('pdf-render-container');
  
  if (!element) {
    throw new Error('Invoice capture area not found in DOM.');
  }

  // We wait a tiny bit to ensure fonts and styles are fully rendered
  await new Promise(resolve => setTimeout(resolve, 100));

  // Take a high-resolution lossless snapshot
  const dataUrl = await toPng(element, { 
    quality: 1.0,
    pixelRatio: 3, // 3x resolution for crisp, high-quality text
    backgroundColor: '#ffffff',
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left'
    }
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
  doc.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Add subsequent pages if the invoice is longer than one A4 page
  while (heightLeft > 0) {
    position = position - pageHeight; // Shift the image up by exactly one page height
    doc.addPage();
    doc.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  return doc;
};

export const generateInvoicePDF = async (data: InvoiceData) => {
  const filename = `Invoice-${data.details.invoiceNumber || 'draft'}.pdf`;

  const doc = await buildInvoicePDF(data);

  // For automated subagent testing and screenshots
  const blobUrl = doc.output('bloburl').toString();
  console.log("__PDF_BLOB_URL__:", blobUrl);
  (window as any).__PDF_BLOB_URL__ = blobUrl;

  if (window.location.search.includes('preview=true') || (window as any).__TESTING_PREVIEW__) {
    window.location.href = blobUrl;
    return;
  }

  const blob = doc.output('blob');

  // Beautiful native mobile experience using Web Share API
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: 'application/pdf' });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: filename,
        });
        return; // Successfully shared!
      } catch (err: any) {
        // If the user cancelled the share, do not attempt to download again, just exit quietly.
        if (err.name === 'AbortError') {
          return;
        }
        console.warn("Share failed, falling back to download", err);
      }
    }
  }

  // Fallback to standard download for desktop and unsupported mobile browsers
  try {
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
