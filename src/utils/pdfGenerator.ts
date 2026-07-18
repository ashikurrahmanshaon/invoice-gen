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

  (window as any).__PDF_BLOB_URL__ = blobUrl;

  if (window.location.search.includes('preview=true') || (window as any).__TESTING_PREVIEW__) {
    window.location.href = blobUrl;
    return;
  }

  // Standard jsPDF save function handles cross-browser compatibility, including mobile
  try {
    doc.save(filename);
  } catch (e) {
    console.error("PDF download failed:", e);
  }
};

export const generatePOPDF = async (data: any) => {
  const filename = `PO-${data.details.poNumber || 'draft'}.pdf`;
  const doc = await buildInvoicePDF(data);
  const blobUrl = doc.output('bloburl').toString();

  (window as any).__PDF_BLOB_URL__ = blobUrl;
  if (window.location.search.includes('preview=true') || (window as any).__TESTING_PREVIEW__) {
    window.location.href = blobUrl;
    return;
  }
  try {
    doc.save(filename);
  } catch (e) {
    console.error("PDF download failed:", e);
  }
};

export const generateQuotePDF = async (data: any) => {
  const filename = `Quote-${data.details.quoteNumber || 'draft'}.pdf`;
  const doc = await buildInvoicePDF(data);
  const blobUrl = doc.output('bloburl').toString();

  (window as any).__PDF_BLOB_URL__ = blobUrl;
  if (window.location.search.includes('preview=true') || (window as any).__TESTING_PREVIEW__) {
    window.location.href = blobUrl;
    return;
  }
  try {
    doc.save(filename);
  } catch (e) {
    console.error("PDF download failed:", e);
  }
};

export const generateEstimatePDF = async (data: any) => {
  const filename = `Estimate-${data.details.estimateNumber || 'draft'}.pdf`;
  const doc = await buildInvoicePDF(data);
  const blobUrl = doc.output('bloburl').toString();

  (window as any).__PDF_BLOB_URL__ = blobUrl;
  if (window.location.search.includes('preview=true') || (window as any).__TESTING_PREVIEW__) {
    window.location.href = blobUrl;
    return;
  }
  try {
    doc.save(filename);
  } catch (e) {
    console.error("PDF download failed:", e);
  }
};

