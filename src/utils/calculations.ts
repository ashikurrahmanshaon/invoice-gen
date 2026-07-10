import type { LineItem, InvoiceTotals } from '../types/invoice';

/**
 * Validates a raw decimal input string.
 * Allows: "", "1", "1.", "1.5", ".5"
 * Rejects: multiple decimals, scientific notation, negative values, NaN, Infinity, letters.
 * Returns true if valid, false otherwise.
 */
export const isValidDecimalInput = (value: string): boolean => {
  if (value === '') return true;
  if (value === '.') return true;
  
  if (/[^0-9.]/.test(value)) return false;
  
  const dotsCount = (value.match(/\./g) || []).length;
  if (dotsCount > 1) return false;

  return true;
};

/**
 * Centralized, safe numeric parser.
 * Guarantees finite numbers, minimum 0, no NaN, no Infinity, no negative zero.
 */
export const sanitizeNumber = (value: string | number): number => {
  if (value === '' || value === '.' || value === undefined || value === null) return 0;
  
  const num = Number(value);
  if (Number.isNaN(num) || !Number.isFinite(num)) return 0;
  
  return Math.max(0, num) || 0;
};

/**
 * Rounds a number to exactly 2 decimal places.
 */
export const roundCurrency = (value: number): number => {
  return Math.round(value * 100) / 100;
};

/**
 * Calculates a single line item amount safely and rounded to 2 decimal places.
 */
export const calculateLineAmount = (rate: string | number, quantity: string | number): number => {
  const safeRate = sanitizeNumber(rate);
  const safeQty = sanitizeNumber(quantity);
  const rawAmount = safeRate * safeQty;
  return roundCurrency(rawAmount);
};

export const calculateTotals = (
  items: LineItem[] = [],
  discountValue: number | string = 0,
  discountType: 'percent' | 'flat' = 'percent',
  taxRate: number | string = 0,
  taxLabel: string = 'Tax',
  shipping: number | string = 0,
  amountPaid: number | string = 0
): InvoiceTotals => {
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + calculateLineAmount(item.rate, item.quantity), 0));
  
  const dVal = sanitizeNumber(discountValue);
  const dType = discountType === 'flat' ? 'flat' : 'percent';
  const tRate = sanitizeNumber(taxRate);
  
  let discountAmount = 0;
  if (dType === 'percent') {
    discountAmount = roundCurrency(subtotal * (Math.min(100, dVal) / 100));
  } else {
    discountAmount = roundCurrency(Math.min(subtotal, dVal));
  }
  
  const subtotalAfterDiscount = roundCurrency(subtotal - discountAmount);
  const taxAmount = roundCurrency(subtotalAfterDiscount * (tRate / 100));
  const shippingAmount = roundCurrency(sanitizeNumber(shipping));
  const total = roundCurrency(subtotalAfterDiscount + taxAmount + shippingAmount);
  const paid = sanitizeNumber(amountPaid);
  const balanceDue = roundCurrency(total - paid);

  return {
    subtotal,
    discountRate: dType === 'percent' ? dVal : 0, // Legacy support
    discountType: dType,
    discountValue, // preserve raw input
    taxLabel,
    taxRate,
    shipping,
    amountPaid,
    discountAmount,
    taxAmount,
    total,
    balanceDue
  };
};
