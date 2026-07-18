

export const generateEstimateNumber = (): string => {
  const prefix = 'EST-';
  
  // Check if we have a sequence number in local storage
  let sequence = 1;
  try {
    const stored = localStorage.getItem('estimate_sequence');
    if (stored) {
      sequence = parseInt(stored, 10);
    }
  } catch (_e) {
    // Ignore localStorage errors
  }

  // Format with leading zeros (e.g., EST-001)
  const numberString = sequence.toString().padStart(3, '0');
  
  // Increment for next time
  try {
    localStorage.setItem('estimate_sequence', (sequence + 1).toString());
  } catch (_e) {
    // Ignore localStorage errors
  }
  
  return `${prefix}${numberString}`;
};

export const resetEstimateSequence = () => {
  try {
    localStorage.removeItem('estimate_sequence');
  } catch (_e) {
    // Ignore
  }
};
