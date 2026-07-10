export const generateInvoiceNumber = (exclude?: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  
  let randomNum = Math.floor(1000 + Math.random() * 9000);
  let newNumber = `INV-${year}-${randomNum}`;
  
  if (exclude) {
    while (newNumber === exclude) {
      randomNum = Math.floor(1000 + Math.random() * 9000);
      newNumber = `INV-${year}-${randomNum}`;
    }
  }
  
  return newNumber;
};
