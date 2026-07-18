import React, { useMemo } from 'react';
import type { PurchaseOrderData } from '../../types/purchaseOrder';
import type { InvoiceData } from '../../types/invoice';
import { InvoiceA4Preview } from './InvoiceA4Preview';

interface POA4PreviewProps {
  data: PurchaseOrderData;
  scale?: number;
}

export const POA4Preview: React.FC<POA4PreviewProps> = ({ data, scale = 1 }) => {
  const mappedData = useMemo<InvoiceData>(() => ({
    business: data.buyer,
    client: data.vendor,
    details: {
      invoiceNumber: data.details.poNumber,
      issueDate: data.details.poDate,
      dueDate: data.details.expectedDeliveryDate,
      currency: data.details.currency,
      themeColor: data.details.themeColor,
      layoutId: data.details.layoutId,
    },
    items: data.items,
    totals: data.totals,
    notes: data.notes,
    terms: data.terms,
    signatureUrl: data.signatureUrl,
    paymentInstructions: '', // POs typically don't have payment instructions
    documentLabels: {
      title: 'PURCHASE ORDER',
      numberPrefix: 'PO',
      date: 'PO Date',
      dueDate: 'Delivery Date',
      billTo: 'Vendor'
    }
  }), [data]);

  return <InvoiceA4Preview data={mappedData} scale={scale} />;
};
