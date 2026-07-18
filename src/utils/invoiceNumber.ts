import { generateSequenceNumber } from './sequenceGenerator';
import { STORAGE_KEY_HISTORY } from './storage';

export const STORAGE_KEY_SEQUENCE = 'invoice_gen_sequence';

export const generateInvoiceNumber = (exclude?: string): string => {
  return generateSequenceNumber({
    prefix: 'INV',
    sequenceKey: STORAGE_KEY_SEQUENCE,
    historyKey: STORAGE_KEY_HISTORY,
    historyPath: (record) => record.data?.details?.invoiceNumber
  }, exclude);
};
