export const generateQuoteNumber = (): string => {
  const prefix = 'QTE-';
  
  // Check if we have a sequence number in local storage
  let sequence = 1;
  try {
    const stored = localStorage.getItem('quote_sequence');
    if (stored) {
      sequence = parseInt(stored, 10);
    }
  } catch {
    // Ignore localStorage errors
  }

  // Format with leading zeros (e.g., QTE-001)
  const numberString = sequence.toString().padStart(3, '0');
  
  // Increment for next time
  try {
    localStorage.setItem('quote_sequence', (sequence + 1).toString());
  } catch {
    // Ignore localStorage errors
  }
  
  return `${prefix}${numberString}`;
};

export const resetQuoteSequence = () => {
  try {
    localStorage.removeItem('quote_sequence');
  } catch {
    // Ignore
  }
};
