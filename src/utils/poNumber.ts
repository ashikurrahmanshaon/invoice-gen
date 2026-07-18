import { generateSequenceNumber } from './sequenceGenerator';
import { STORAGE_KEY_HISTORY } from './storage';

export const STORAGE_KEY_PO_SEQUENCE = 'po_gen_sequence';

export const generatePONumber = (exclude?: string): string => {
  return generateSequenceNumber({
    prefix: 'PO',
    sequenceKey: STORAGE_KEY_PO_SEQUENCE,
    historyKey: STORAGE_KEY_HISTORY,
    historyPath: (record) => record.data?.details?.poNumber
  }, exclude);
};
