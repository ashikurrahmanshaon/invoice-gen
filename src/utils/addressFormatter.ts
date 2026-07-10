export interface AddressFields {
  address?: string; // Legacy field
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export function formatAddress(fields: AddressFields): string[] {
  const lines: string[] = [];

  if (fields.address1) lines.push(fields.address1);
  if (fields.address2) lines.push(fields.address2);

  // Format: City, State ZIP
  const cityPart = fields.city ? fields.city : '';
  const statePart = fields.state ? fields.state : '';
  const zipPart = fields.postalCode ? fields.postalCode : '';

  let line3 = '';
  if (cityPart && statePart) {
    line3 = `${cityPart}, ${statePart}`;
    if (zipPart) line3 += ` ${zipPart}`;
  } else if (cityPart) {
    line3 = cityPart;
    if (zipPart) line3 += ` ${zipPart}`;
  } else if (statePart) {
    line3 = statePart;
    if (zipPart) line3 += ` ${zipPart}`;
  } else if (zipPart) {
    line3 = zipPart;
  }

  if (line3) lines.push(line3);
  if (fields.country) lines.push(fields.country);

  // If no structured fields exist but legacy address exists, use the legacy address
  if (lines.length === 0 && fields.address) {
    return fields.address.split('\n').map(l => l.trim()).filter(Boolean);
  }

  return lines;
}
