import { getRegionalSettings } from '../src/utils/locale';
import countryToCurrency from 'country-to-currency';

const countries = [
  'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'JP', 'KR', 'BD', 'IN', 'PK', 'AE', 'SA', 'AU', 'BR', 'MX', 'ZA'
];

console.log("International Readiness Report - Regional Settings Check\n");
console.log("Country\tCurrency\tPaper Size\tTax Label");
console.log("-".repeat(60));

countries.forEach(code => {
  const settings = getRegionalSettings(code);
  console.log(`${code}\t${settings.currency}\t\t${settings.paperSize}\t\t${settings.taxLabel}`);
});
