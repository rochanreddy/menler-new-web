/**
 * Tax invoices for paid orders, for Menler's own records.
 *
 * Built on request from admin (Paid users → Invoice) and never emailed to the
 * buyer. Prices are GST-inclusive, so the amount paid is split back into the
 * taxable value and 18% GST. No buyer address is collected, so the place of
 * supply is the supplier's state (Karnataka) and the tax is CGST 9% + SGST 9%.
 *
 * Each order is numbered once, the first time its invoice is made, from a
 * counter per financial year (MNLR/26-27/000001). The number is stored on the
 * order, so downloading again gives the same invoice.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Order } from '../models/Order.js';
import { PROGRAM_PRICES } from '../config/pricing.js';
import { COMPANY, SAC, GST_RATE } from '../config/company.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.resolve(__dirname, '../assets/fonts');

const round2 = (n) => Math.round(n * 100) / 100;

/** Indian financial year of a date, as "26-27". */
function fiscalYear(d) {
  const ist = new Date(d.getTime() + 5.5 * 3600_000);
  const y = ist.getUTCFullYear();
  const start = ist.getUTCMonth() >= 3 ? y : y - 1;
  return `${String(start).slice(2)}-${String(start + 1).slice(2)}`;
}

/** The order's invoice number, minting one on first use. */
async function invoiceNumberFor(order) {
  if (order.extra?.invoice?.no) return order.extra.invoice;
  const fy = fiscalYear(new Date(order.paid_at || order.createdAt));
  const counter = await mongoose.connection.collection('counters').findOneAndUpdate(
    { _id: `invoice:${fy}` },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  const seq = (counter?.value ?? counter)?.seq;
  const invoice = { no: `MNLR/${fy}/${String(seq).padStart(6, '0')}`, issued_at: new Date() };
  // Only the first writer wins, so two clicks at once cannot number an order twice.
  const saved = await Order.findOneAndUpdate(
    { _id: order._id, 'extra.invoice.no': { $exists: false } },
    { $set: { 'extra.invoice': invoice } },
    { new: true },
  ).lean();
  if (saved) return invoice;
  return (await Order.findById(order._id).lean()).extra.invoice;
}

/** The GST split of a GST-inclusive amount. */
export function gstSplit(amount) {
  const total = round2(Number(amount) || 0);
  const taxable = round2(total / (1 + GST_RATE / 100));
  const tax = round2(total - taxable);
  const cgst = round2(tax / 2);
  return { total, taxable, cgst, sgst: round2(tax - cgst), tax };
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
  'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
function words(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`;
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${words(n % 100)}` : ''}`;
  for (const [size, name] of [[1e7, 'Crore'], [1e5, 'Lakh'], [1e3, 'Thousand']]) {
    if (n >= size) return `${words(Math.floor(n / size))} ${name}${n % size ? ` ${words(n % size)}` : ''}`;
  }
  return '';
}
/** 16000 → "Rupees Sixteen Thousand Only". */
export function rupeesInWords(amount) {
  const r = Math.floor(amount);
  const p = Math.round((amount - r) * 100);
  return `Rupees ${words(r) || 'Zero'}${p ? ` and ${words(p)} Paise` : ''} Only`;
}

const inr = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });

function courseName(order) {
  const label = PROGRAM_PRICES[order.program]?.label;
  if (label) return label;
  return String(order.program || 'Course').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Builds the invoice PDF for a paid order. Returns { bytes, number }. */
export async function buildInvoice(orderDoc) {
  const order = orderDoc;
  const invoice = await invoiceNumberFor(order);
  const { total, taxable, cgst, sgst } = gstSplit(order.amount);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const regular = await pdf.embedFont(fs.readFileSync(path.join(FONTS, 'DMSans-Regular.ttf')), { subset: true });
  const bold = await pdf.embedFont(fs.readFileSync(path.join(FONTS, 'DMSans-Bold.ttf')), { subset: true });
  const serif = await pdf.embedFont(fs.readFileSync(path.join(FONTS, 'DMSerifDisplay-Italic.ttf')), { subset: true });
  pdf.setTitle(`Tax Invoice ${invoice.no}`);
  pdf.setAuthor(COMPANY.name);

  const page = pdf.addPage([595.28, 841.89]); // A4
  const W = page.getWidth();
  const M = 48;
  const ink = rgb(0.149, 0.129, 0.361); // #26215C
  const violet = rgb(0.325, 0.29, 0.718); // #534AB7
  const muted = rgb(0.42, 0.4, 0.565);
  const line = rgb(0.906, 0.894, 0.941);

  const text = (s, x, y, { size = 10, font = regular, color = ink, align = 'left' } = {}) => {
    const str = String(s ?? '');
    const w = font.widthOfTextAtSize(str, size);
    const at = align === 'right' ? x - w : x;
    page.drawText(str, { x: at, y, size, font, color });
  };
  const rule = (y, color = line, thickness = 1) => page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness, color });

  // Header: seller on the left, invoice facts on the right.
  let y = 790;
  // The wordmark as the site draws it: "menler" in heavy DM Sans, the green
  // dot at the shoulder of the r, and the tagline in the serif italic. DM Sans
  // ships here in bold only, so the word is laid down three times a hair apart
  // to bring it up to the black weight of the logo.
  const markSize = 30;
  for (const dx of [0, 0.35, 0.7]) page.drawText('menler', { x: M + dx, y, size: markSize, font: bold, color: ink });
  const markW = bold.widthOfTextAtSize('menler', markSize);
  page.drawCircle({ x: M + markW + 4.5, y: y + markSize * 0.5, size: markSize * 0.09, color: rgb(0.114, 0.62, 0.459) }); // #1D9E75
  page.drawText('Your turning point in the AI era.', { x: M, y: y - 17, size: 10.5, font: serif, color: violet });
  text('TAX INVOICE', W - M, y + 4, { size: 16, font: bold, color: violet, align: 'right' });
  text('Original for Recipient', W - M, y - 12, { size: 8.5, color: muted, align: 'right' });

  y -= 34;
  text(COMPANY.name, M, y, { size: 10.5, font: bold });
  for (const l of COMPANY.address) { y -= 13; text(l, M, y, { size: 9, color: muted }); }
  y -= 13; text(`GSTIN: ${COMPANY.gstin}   ·   PAN: ${COMPANY.pan}`, M, y, { size: 9 });
  y -= 13; text(`${COMPANY.email}   ·   ${COMPANY.website}`, M, y, { size: 9, color: muted });

  let ry = 756;
  const FX = W - M - 222; // label column
  const VX = FX + 84; // value column
  const FW = W - M - VX;
  for (const [k, v] of [
    ['Invoice no.', invoice.no],
    ['Invoice date', day(order.paid_at || order.createdAt)],
    ['Order ID', order.order_id],
    ['Place of supply', `${COMPANY.state} (${COMPANY.stateCode})`],
  ]) {
    // Two columns: labels on the left, values left-aligned beside them. A
    // value too wide for its column (a Cashfree order ID runs to 50+
    // characters) wraps inside it, so it never reaches the address.
    text(k, FX, ry, { size: 9, color: muted });
    const lines = [];
    let chunk = '';
    for (const ch of String(v ?? '')) {
      if (chunk && bold.widthOfTextAtSize(chunk + ch, 9) > FW) { lines.push(chunk); chunk = ''; }
      chunk += ch;
    }
    lines.push(chunk);
    lines.forEach((l, i) => text(l, VX, ry - i * 12, { size: 9, font: bold }));
    ry -= 12 * (lines.length - 1) + 15;
  }

  // Bill to. The rule goes below whichever column ran longer.
  y = Math.min(y - 26, ry - 4); rule(y);
  y -= 20; text('BILL TO', M, y, { size: 8, font: bold, color: violet });
  y -= 15; text(order.customer_name || '—', M, y, { size: 10.5, font: bold });
  if (order.customer_email) { y -= 13; text(order.customer_email, M, y, { size: 9, color: muted }); }
  if (order.customer_phone) { y -= 13; text(order.customer_phone, M, y, { size: 9, color: muted }); }

  // Line item table.
  y -= 30;
  const cols = { item: M + 8, sac: 330, qty: 395, amt: W - M - 8 };
  page.drawRectangle({ x: M, y: y - 8, width: W - 2 * M, height: 24, color: rgb(0.937, 0.929, 0.984) });
  text('Description', cols.item, y, { size: 9, font: bold });
  text('SAC', cols.sac, y, { size: 9, font: bold });
  text('Qty', cols.qty, y, { size: 9, font: bold });
  text('Taxable value (INR)', cols.amt, y, { size: 9, font: bold, align: 'right' });
  y -= 28;
  text(courseName(order), cols.item, y, { size: 10 });
  text(SAC, cols.sac, y, { size: 10 });
  text('1', cols.qty, y, { size: 10 });
  text(inr(taxable), cols.amt, y, { size: 10, align: 'right' });
  y -= 16; rule(y);

  // Totals.
  const tx = W - M - 220;
  const row = (k, v, opts = {}) => {
    y -= 18;
    text(k, tx, y, { size: 9.5, color: opts.strong ? ink : muted, font: opts.strong ? bold : regular });
    text(v, W - M - 8, y, { size: 9.5, font: opts.strong ? bold : regular, align: 'right' });
  };
  row('Taxable value', `Rs. ${inr(taxable)}`);
  row(`CGST @ ${GST_RATE / 2}%`, `Rs. ${inr(cgst)}`);
  row(`SGST @ ${GST_RATE / 2}%`, `Rs. ${inr(sgst)}`);
  y -= 10;
  page.drawRectangle({ x: tx - 10, y: y - 22, width: W - M - tx + 10, height: 26, color: violet });
  y -= 14;
  text('Total (incl. GST)', tx, y, { size: 10.5, font: bold, color: rgb(1, 1, 1) });
  text(`Rs. ${inr(total)}`, W - M - 8, y, { size: 10.5, font: bold, color: rgb(1, 1, 1), align: 'right' });

  y -= 34;
  text('Amount in words', M, y, { size: 8, font: bold, color: violet });
  y -= 14; text(rupeesInWords(total), M, y, { size: 9.5 });
  y -= 16; text(`Payment received${order.extra?.txn_id ? ` · Ref ${order.extra.txn_id}` : ''}. Prices are inclusive of GST.`, M, y, { size: 8.5, color: muted });

  // Footer.
  rule(96);
  text(`For ${COMPANY.name}`, W - M, 76, { size: 9, font: bold, align: 'right' });
  text('This is a computer-generated invoice and needs no signature.', M, 56, { size: 8, color: muted });

  return { bytes: await pdf.save(), number: invoice.no };
}
