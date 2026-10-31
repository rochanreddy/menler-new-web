// Menler's own details, as registered for GST. Printed on every tax invoice
// (utils/invoice.js). Public facts, not secrets — they appear on the invoice.
export const COMPANY = {
  name: 'Menler Learning Systems Private Limited',
  gstin: '29AAVCM0628E1Z7',
  // Characters 3–12 of a GSTIN are the PAN.
  pan: 'AAVCM0628E',
  address: [
    'KRISHNA MYSTIQ, Chikkathogur Main Rd, Pragathi Nagar,',
    'Basapura, Bengaluru, Karnataka 560100',
  ],
  state: 'Karnataka',
  stateCode: '29',
  email: 'support@menler.in',
  website: 'menler.in',
};

// Education and training services. Override with INVOICE_SAC if the CA
// settles on a different code.
export const SAC = process.env.INVOICE_SAC || '999293';
export const GST_RATE = 18;
