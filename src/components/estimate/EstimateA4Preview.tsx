import React, { useMemo } from 'react';
import type { EstimateData } from '../../types/estimate';
import type { InvoiceData } from '../../types/invoice';
import { InvoiceA4Preview } from '../invoice/InvoiceA4Preview';

interface EstimateA4PreviewProps {
  data: EstimateData;
  scale?: number;
}

export const EstimateA4Preview: React.FC<EstimateA4PreviewProps> = ({ data, scale = 1 }) => {
  const mappedData = useMemo<InvoiceData>(() => ({
    business: data.business,
    client: data.client,
    details: {
      invoiceNumber: data.details.estimateNumber,
      issueDate: data.details.issueDate,
      dueDate: data.details.validUntil,
      currency: data.details.currency,
    },
    items: data.items,
    totals: { ...data.totals, discountRate: Number(data.totals.discountRate) || 0 } as any,
    notes: data.notes,
    terms: data.terms,
    signatureUrl: data.signatureUrl,
    paymentInstructions: '', // Estimates typically don't have payment instructions
    documentLabels: {
      title: 'ESTIMATE',
      numberPrefix: 'Estimate',
      date: 'Issue Date',
      dueDate: 'Valid Until',
      billTo: 'Estimate To'
    }
  }), [data]);

  return <InvoiceA4Preview data={mappedData} scale={scale} />;
};
