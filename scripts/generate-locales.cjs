const fs = require('fs');
const path = require('path');

const languages = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ar', 
  'ja', 'zh', 'ko', 'hi', 'bn', 'tr', 'ru', 'pl', 
  'ro', 'el', 'th', 'vi', 'id', 'ms', 'ur', 'he'
];

const baseTranslations = {
  "invoice": {
    "title": "Invoice",
    "number": "Invoice Number",
    "issueDate": "Issue Date",
    "dueDate": "Due Date",
    "billTo": "Bill To",
    "from": "From"
  },
  "business": {
    "name": "Business Name",
    "email": "Email",
    "phone": "Phone",
    "website": "Website",
    "taxId": "Tax ID",
    "address": "Address"
  },
  "client": {
    "name": "Client Name",
    "email": "Email",
    "phone": "Phone",
    "taxId": "Tax ID",
    "address": "Address"
  },
  "items": {
    "description": "Description",
    "quantity": "Qty",
    "rate": "Rate",
    "amount": "Amount",
    "addItem": "Add Item"
  },
  "totals": {
    "subtotal": "Subtotal",
    "discount": "Discount",
    "tax": "Tax",
    "shipping": "Shipping",
    "total": "Total",
    "amountPaid": "Amount Paid",
    "balanceDue": "Balance Due"
  },
  "settings": {
    "language": "Language",
    "currency": "Currency",
    "paperSize": "Paper Size"
  }
};

const localesDir = path.join(__dirname, '..', 'public', 'locales');

if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

languages.forEach(lng => {
  const lngDir = path.join(localesDir, lng);
  if (!fs.existsSync(lngDir)) {
    fs.mkdirSync(lngDir);
  }
  
  const filePath = path.join(lngDir, 'translation.json');
  // For now, we seed every language with the english keys. 
  // In a real app, these would be sent to a translation service.
  fs.writeFileSync(filePath, JSON.stringify(baseTranslations, null, 2));
  console.log(`Generated locale for ${lng}`);
});
