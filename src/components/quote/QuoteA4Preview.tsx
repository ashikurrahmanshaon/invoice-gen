import React, { useMemo } from 'react';
import type { QuoteData } from '../../types/quote';
import type { InvoiceData } from '../../types/invoice';
import { InvoiceA4Preview } from '../invoice/InvoiceA4Preview';

interface QuoteA4PreviewProps {
  data: QuoteData;
  scale?: number;
}

export const QuoteA4Preview: React.FC<QuoteA4PreviewProps> = ({ data, scale = 1 }) => {
  const mappedData = useMemo<InvoiceData>(() => ({
    business: data.business,
    client: data.client,
    details: {
      invoiceNumber: data.details.quoteNumber,
      issueDate: data.details.issueDate,
      dueDate: data.details.validUntil,
      currency: data.details.currency,
    },
    items: data.items,
    totals: { ...data.totals, discountRate: Number(data.totals.discountRate) || 0 } as any,
    notes: data.notes,
    terms: data.terms,
    signatureUrl: data.signatureUrl,
    paymentInstructions: '', // Quotes typically don't have payment instructions
    documentLabels: {
      title: 'QUOTE',
      numberPrefix: 'Quote',
      date: 'Issue Date',
      dueDate: 'Valid Until',
      billTo: 'Quote To'
    }
  }), [data]);

  return <InvoiceA4Preview data={mappedData} scale={scale} />;
};
