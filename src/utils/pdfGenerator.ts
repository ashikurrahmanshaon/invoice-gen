import type { jsPDF } from 'jspdf';
import type { InvoiceData } from '../types/invoice';
import { formatCurrency, formatDate } from './currency';
import { formatAddress } from './addressFormatter';
import { calculateLineAmount, sanitizeNumber } from './calculations';
import i18next from 'i18next';

const safeSplitTextToSize = (doc: jsPDF, text: string, maxWidth: number) => {
  const paragraphs = text.split('\n');
  const finalLines: string[] = [];
  
  paragraphs.forEach(p => {
    if (p.trim() === '') {
      finalLines.push('');
      return;
    }
    const lines = doc.splitTextToSize(p, maxWidth);
    lines.forEach((line: string) => {
       const width = doc.getStringUnitWidth(line) * doc.getFontSize() / doc.internal.scaleFactor;
       if (width > maxWidth + 5) {
         let currentLine = '';
         for (let i = 0; i < line.length; i++) {
            const tempWidth = doc.getStringUnitWidth(currentLine + line[i]) * doc.getFontSize() / doc.internal.scaleFactor;
            if (tempWidth <= maxWidth) {
               currentLine += line[i];
            } else {
               finalLines.push(currentLine);
               currentLine = line[i];
            }
         }
         if (currentLine) finalLines.push(currentLine);
       } else {
         finalLines.push(line);
       }
    });
  });
  return finalLines;
};


export const buildInvoicePDF = async (data: InvoiceData): Promise<jsPDF> => {
  const { jsPDF } = await import('jspdf');
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const currency = data.details.currency;

  // Colors
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [21, 94, 239];
  };

  const primaryColor: [number, number, number] = hexToRgb(data.details.themeColor || '#155EEF');
  const darkTextColor: [number, number, number] = [27, 38, 59]; // #1B263B
  const lightTextColor: [number, number, number] = [102, 112, 133]; // #667085
  const borderColor: [number, number, number] = [228, 231, 236]; // #E4E7EC

  let currentY = 20;

  // Add Logo if exists
  if (data.business.logoUrl) {
    try {
      // Determine format from data url
      let format = 'PNG';
      if (data.business.logoUrl.includes('image/jpeg') || data.business.logoUrl.includes('image/jpg')) {
        format = 'JPEG';
      } else if (data.business.logoUrl.includes('image/webp')) {
        format = 'WEBP';
      }
      
      const props = doc.getImageProperties(data.business.logoUrl);
      const maxWidth = 40;
      const maxHeight = 28;
      const ratio = Math.min(maxWidth / props.width, maxHeight / props.height);
      const imgWidth = props.width * ratio;
      const imgHeight = props.height * ratio;
      
      doc.addImage(data.business.logoUrl, format, 20, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 6; // slightly more breathing room
    } catch (e) {
      console.error('Failed to add logo to PDF', e);
      // Fallback: don't render logo but continue
    }
  }

  // Header Title & Metadata (Aligned right at X=190, wrapped to 40mm max width)
  let metadataY = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(i18next.t('invoice_title', 'INVOICE'), 190, metadataY, { align: 'right' });
  metadataY += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  
  // Render "Invoice No:" label
  doc.setFont('helvetica', 'bold');
  doc.text(i18next.t('invoice_no_label', 'Invoice No:'), 190, metadataY, { align: 'right' });
  metadataY += 5;
  
  // Render wrapped Invoice Number value
  doc.setFont('helvetica', 'normal');
  const invNumLines = doc.splitTextToSize(data.details.invoiceNumber, 40);
  invNumLines.forEach((line: string) => {
    doc.text(line, 190, metadataY, { align: 'right' });
    metadataY += 5;
  });
  
  // Render Date and Due Date below the wrapped invoice number
  doc.text(`${i18next.t('date_label', 'Date:')} ${formatDate(data.details.issueDate)}`, 190, metadataY, { align: 'right' });
  metadataY += 5;
  doc.text(`${i18next.t('due_date_label', 'Due Date:')} ${formatDate(data.details.dueDate)}`, 190, metadataY, { align: 'right' });
  metadataY += 5;

  // Business details (Left side - wrapped to 75mm max width to prevent extending past X=95)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const businessYStart = data.business.logoUrl ? 52 : 36;
  const clientYStart = businessYStart;
  
  let leftY = businessYStart;
  const businessNameLines = doc.splitTextToSize(data.business.name || 'Your Business Name', 75);
  businessNameLines.forEach((line: string) => {
    doc.text(line, 20, leftY);
    leftY += 5;
  });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  const businessEmailLines = doc.splitTextToSize(data.business.email || 'you@example.com', 75);
  businessEmailLines.forEach((line: string) => {
    doc.text(line, 20, leftY);
    leftY += 5;
  });

  if (data.business.phone) {
    const businessPhoneLines = doc.splitTextToSize(`${i18next.t('phone_label', 'Phone:')} ${data.business.phone}`, 75);
    businessPhoneLines.forEach((line: string) => {
      doc.text(line, 20, leftY);
      leftY += 5;
    });
  }
  if (data.business.website) {
    const businessWebLines = doc.splitTextToSize(`${i18next.t('website_label', 'Website:')} ${data.business.website}`, 75);
    businessWebLines.forEach((line: string) => {
      doc.text(line, 20, leftY);
      leftY += 5;
    });
  }
  const addressLines = formatAddress(data.business);
  if (addressLines.length > 0) {
    addressLines.forEach((line: string) => {
      const pdfLines = doc.splitTextToSize(line, 75);
      pdfLines.forEach((pl: string) => {
        doc.text(pl, 20, leftY);
        leftY += 5;
      });
    });
  }
  if (data.business.taxId) {
    const businessTaxLines = doc.splitTextToSize(`${i18next.t('tax_id_label', 'Tax ID:')} ${data.business.taxId}`, 75);
    businessTaxLines.forEach((line: string) => {
      doc.text(line, 20, leftY);
      leftY += 5;
    });
  }

  // Client Details (Middle/Right side - starting at X=105, wrapped to 40mm max width to prevent extending past X=145)
  let rightY = clientYStart;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(i18next.t('bill_to_label', 'BILL TO'), 105, rightY);
  rightY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const clientNameLines = doc.splitTextToSize(data.client.name || 'Client Name', 40);
  clientNameLines.forEach((line: string) => {
    doc.text(line, 105, rightY);
    rightY += 5;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  const clientEmailLines = doc.splitTextToSize(data.client.email || 'client@example.com', 40);
  clientEmailLines.forEach((line: string) => {
    doc.text(line, 105, rightY);
    rightY += 5;
  });

  if (data.client.phone) {
    const clientPhoneLines = doc.splitTextToSize(data.client.phone, 40);
    clientPhoneLines.forEach((line: string) => {
      doc.text(line, 105, rightY);
      rightY += 5;
    });
  }

  const clientAddressLines = formatAddress(data.client);
  clientAddressLines.forEach((line: string) => {
    const formattedLines = doc.splitTextToSize(line, 40);
    formattedLines.forEach((l: string) => {
      doc.text(l, 105, rightY);
      rightY += 5;
    });
  });

  if (data.client.taxId) {
    const clientTaxLines = doc.splitTextToSize(`${i18next.t('tax_id_label', 'Tax ID:')} ${data.client.taxId}`, 40);
    clientTaxLines.forEach((line: string) => {
      doc.text(line, 105, rightY);
      rightY += 5;
    });
  }

  // Establish table Y start - must begin after the tallest header block has finished
  currentY = Math.max(leftY, rightY, metadataY) + 10;

  // Build items table data
  const tableHeaders = [[
    i18next.t('item_header', 'Item / Service'),
    i18next.t('description_header', 'Description'),
    i18next.t('rate_header', 'Rate'),
    i18next.t('qty_header', 'Qty'),
    i18next.t('amount_header', 'Amount')
  ]];
  const tableData = data.items.map((item) => [
    item.name || 'Untitled Item',
    item.description || '',
    formatCurrency(sanitizeNumber(item.rate), currency),
    sanitizeNumber(item.quantity).toString(),
    formatCurrency(calculateLineAmount(item.rate, item.quantity), currency)
  ]);

  // Render Table
  autoTable(doc, {
    startY: currentY,
    head: tableHeaders,
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: darkTextColor,
      fontStyle: 'bold',
      fontSize: 9,
      lineColor: borderColor,
      lineWidth: 0.1
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkTextColor,
      lineColor: borderColor,
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });

  // Get Y position after table
  const tableFinalY = (doc as any).lastAutoTable.finalY + 10;
  const pageHeight = doc.internal.pageSize.height || 297;
  const bottomMargin = 20;

  currentY = tableFinalY;

  const goToNextPage = () => {
    let currentPage = (doc.internal as any).getCurrentPageInfo().pageNumber;
    let totalPages = (doc.internal as any).getNumberOfPages();
    if (currentPage < totalPages) {
      doc.setPage(currentPage + 1);
    } else {
      doc.addPage();
    }
    return 20; // new Y
  };

  const drawSection = (title: string, content: string) => {
    if (!content) return;
    
    // Check if heading + spacing + 1 line fits
    // heading(5) + spacing(5) + line(4.5) = 14.5
    if (currentY + 14.5 > pageHeight - bottomMargin) {
      currentY = goToNextPage();
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(title, 20, currentY);
    currentY += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    
    const lines = safeSplitTextToSize(doc, content, 85);
    lines.forEach(line => {
      if (currentY + 4.5 > pageHeight - bottomMargin) {
        currentY = goToNextPage();
      }
      if (line !== '') {
        doc.text(line, 20, currentY);
      }
      currentY += 4.5;
    });
    
    currentY += 5; // spacing after section
  };

  drawSection(i18next.t('notes_section', 'Notes'), data.notes);
  drawSection(i18next.t('terms_section', 'Terms & Conditions'), data.terms);
  drawSection(i18next.t('payment_instructions_section', 'Payment Instructions'), data.paymentInstructions);

  // Totals Section (Right side, X=120 to X=190)
  let totalsHeight = 25; // Base height for subtotal, total, amount paid, balance due
  if (data.totals.discountAmount > 0) totalsHeight += 6;
  if (data.totals.taxAmount !== 0) totalsHeight += 6;
  if (data.totals.shipping !== 0 && data.totals.shipping !== '') totalsHeight += 6;

  if (currentY + totalsHeight > pageHeight - bottomMargin) {
    currentY = goToNextPage();
  }

  let totalY = currentY;

  const drawRow = (label: string, value: string, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(isBold ? 10 : 9.5);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(label, 120, totalY);
    doc.text(value, 190, totalY, { align: 'right' });
    totalY += 6;
  };

  const totals = data.totals;

  // Subtotal
  drawRow(i18next.t('subtotal_label', 'Subtotal'), formatCurrency(totals.subtotal, currency));

  // Discount
  if (Number(totals.discountValue) > 0) {
    const discountLabel = totals.discountType === 'percent' 
      ? `${i18next.t('discount_label', 'Discount')} (${totals.discountValue}%)` 
      : i18next.t('discount_label', 'Discount');
    drawRow(discountLabel, `-${formatCurrency(totals.discountAmount, currency)}`);
  }

  // Tax
  if (totals.taxAmount !== 0 || Number(totals.taxRate) !== 0) {
    const taxLbl = totals.taxLabel ? totals.taxLabel.substring(0, 15) : 'Tax';
    drawRow(`${taxLbl} (${totals.taxRate}%)`, formatCurrency(totals.taxAmount, currency));
  }

  // Shipping
  if (Number(totals.shipping) !== 0 && totals.shipping !== '') {
    drawRow(i18next.t('shipping_label', 'Shipping'), formatCurrency(Number(totals.shipping) || 0, currency));
  }

  // Total
  totalY += 2;
  // Border line above total
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.1);
  doc.line(120, totalY - 4, 190, totalY - 4);
  
  drawRow(i18next.t('total_label', 'Total'), formatCurrency(totals.total, currency), true);

  // Amount Paid
  drawRow(i18next.t('amount_paid_label', 'Amount Paid'), formatCurrency(Number(totals.amountPaid) || 0, currency));

  // Balance Due highlighted block
  totalY += 2;
  doc.setFillColor(238, 244, 255); // Light blue #EEF4FF
  doc.setDrawColor(21, 94, 239);
  doc.rect(120, totalY - 4, 70, 14, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(i18next.t('balance_due_label', 'Balance Due'), 124, totalY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(21, 94, 239); // Blue
  doc.text(formatCurrency(totals.balanceDue, currency), 186, totalY + 4, { align: 'right' });

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
        // Fallback if popup blocker still caught it
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
