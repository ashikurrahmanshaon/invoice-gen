export interface SequenceOptions {
  prefix: string;
  sequenceKey: string;
  historyKey: string;
  historyPath: (record: any) => string | undefined;
}

export const generateSequenceNumber = (options: SequenceOptions, exclude?: string): string => {
  if (typeof window === 'undefined') return `${options.prefix}-000001`;

  let nextNum = 1;
  const regex = new RegExp(`^${options.prefix}-(\\d+)$`);
  
  try {
    // 1. Check history for highest Sequence
    const historyData = localStorage.getItem(options.historyKey);
    if (historyData) {
      const history = JSON.parse(historyData);
      if (Array.isArray(history)) {
        history.forEach((record: any) => {
          const numStr = options.historyPath(record);
          if (numStr && typeof numStr === 'string') {
            const match = numStr.match(regex);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num >= nextNum) {
                nextNum = num + 1;
              }
            }
          }
        });
      }
    }
    // 2. Also check if we saved a sequence explicitly
    const seqData = localStorage.getItem(options.sequenceKey);
    if (seqData) {
      const seq = parseInt(seqData, 10);
      if (!isNaN(seq) && seq >= nextNum) {
        nextNum = seq + 1;
      }
    }
  } catch (e) {
    console.error(`Error reading sequence for ${options.prefix}`, e);
  }

  // Format as PREFIX-000001
  let newNumber = `${options.prefix}-${String(nextNum).padStart(6, '0')}`;
  
  if (exclude) {
    while (newNumber === exclude) {
      nextNum++;
      newNumber = `${options.prefix}-${String(nextNum).padStart(6, '0')}`;
    }
  }
  
  // Save the sequence so next time it's faster
  try {
    localStorage.setItem(options.sequenceKey, nextNum.toString());
  } catch (_e) {}

  return newNumber;
};
