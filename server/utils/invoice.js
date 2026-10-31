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
// The layout follows the approved sample (an A4 page drawn at 794×1123px):
// positions below are in that page's pixels and converted to PDF points.
export async function buildInvoice(order) {
  const invoice = await invoiceNumberFor(order);
  const { total, taxable, cgst, sgst, tax } = gstSplit(order.amount);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const load = (f) => pdf.embedFont(fs.readFileSync(path.join(FONTS, f)), { subset: true });
  const [regular, medium, bold, serif, serifItalic] = await Promise.all([
    load('DMSans-Regular.ttf'), load('DMSans-Medium.ttf'), load('DMSans-Bold.ttf'),
    load('DMSerifDisplay-Regular.ttf'), load('DMSerifDisplay-Italic.ttf'),
  ]);
  pdf.setTitle(`Tax Invoice ${invoice.no}`);
  pdf.setAuthor(COMPANY.name);

  const page = pdf.addPage([595.28, 841.89]); // A4
  const K = 595.28 / 794;
  const X = (px) => px * K;
  const Y = (px) => 841.89 - px * K;
  const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
  const C = {
    ink: hex('#26215C'), body: hex('#4A4741'), muted: hex('#888780'), violet: hex('#534AB7'),
    green: hex('#1D9E75'), box: hex('#F6F5FD'), line: hex('#ECEBF5'),
    white: rgb(1, 1, 1),
  };

  // DM Sans has no rupee sign, so it is drawn as a shape at the size of the
  // text around it: two bars, the bowl, and the leg.
  const RUPEE = 'M0 0 H10 M0 4.2 H10 M2.2 0 C8.2 0 8.2 8.4 2.2 8.4 H0.6 L8.6 14';
  const rupeeW = (size) => size * 0.62;
  const rupee = (x, baseline, size, color, weight) => page.drawSvgPath(RUPEE, {
    x: X(x), y: Y(baseline - size * 0.72), scale: (size * 0.72 * K) / 14,
    borderColor: color, borderWidth: weight === 'bold' ? 2.6 : 1.9,
  });

  /** Text at a baseline. `x` is the left edge, or the right edge when align is right. */
  const T = (s, x, baseline, size, { font = regular, color = C.body, align = 'left' } = {}) => {
    const str = String(s ?? '');
    const w = font.widthOfTextAtSize(str, size * K) / K;
    page.drawText(str, { x: X(align === 'right' ? x - w : x), y: Y(baseline), size: size * K, font, color });
    return w;
  };
  /** An amount with the rupee sign: "₹16,000.00". */
  const M = (amount, x, baseline, size, opts = {}) => {
    const num = inr(amount);
    const font = opts.font || regular;
    const w = rupeeW(size) + font.widthOfTextAtSize(num, size * K) / K;
    const left = opts.align === 'right' ? x - w : x;
    rupee(left, baseline, size, opts.color || C.body, font === bold ? 'bold' : 'regular');
    T(num, left + rupeeW(size), baseline, size, { ...opts, align: 'left' });
    return w;
  };
  const rect = (x, top, w, h, color, r = 0) => {
    if (!r) return page.drawRectangle({ x: X(x), y: Y(top + h), width: w * K, height: h * K, color });
    const d = `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
    return page.drawSvgPath(d, { x: X(x), y: Y(top), scale: K, color });
  };
  const hline = (x1, x2, at, thickness, color) => page.drawRectangle({ x: X(x1), y: Y(at + thickness), width: (x2 - x1) * K, height: thickness * K, color });
  const wrap = (s, font, size, width) => {
    const out = [];
    let cur = '';
    for (const ch of String(s ?? '')) {
      if (cur && font.widthOfTextAtSize(cur + ch, size * K) / K > width) { out.push(cur); cur = ''; }
      cur += ch;
    }
    out.push(cur);
    return out;
  };

  const L = 56;
  const R = 738;

  // ── Header: brand and seller on the left, the title and invoice facts on the right.
  // "menler" is set three times a hair apart to reach the logo's black weight.
  for (const dx of [0, 0.45, 0.9]) T('menler', L + dx, 76, 34, { font: bold, color: C.ink });
  const markW = bold.widthOfTextAtSize('menler', 34 * K) / K;
  page.drawCircle({ x: X(L + markW + 6), y: Y(60), size: 4.4 * K, color: C.green });
  T('Your turning point in the AI era.', L, 96, 12, { font: serifItalic, color: C.violet });

  T(COMPANY.name, L, 130, 12.5, { font: bold, color: C.ink });
  let fy = 130;
  for (const l of COMPANY.address) { fy += 18.4; T(l, L, fy, 11.5); }
  fy += 18.4; T(`GSTIN: ${COMPANY.gstin}  ·  PAN: ${COMPANY.pan}`, L, fy, 11.5);
  fy += 18.4; T(`${COMPANY.email}  ·  ${COMPANY.website}`, L, fy, 11.5);

  T('Tax Invoice', R, 82, 30, { font: serif, color: C.ink, align: 'right' });
  T('Original for recipient', R, 101, 11.5, { align: 'right' });

  // Facts: values right-aligned to the margin, labels right-aligned against
  // the value column. A value wider than its column (a Cashfree order ID) wraps.
  const rows = [
    ['Invoice no.', invoice.no],
    ['Invoice date', day(order.paid_at || order.createdAt)],
    ['Order ID', order.order_id],
    ['Place of supply', `${COMPANY.state} (${COMPANY.stateCode})`],
  ].map(([k, v]) => [k, wrap(v, medium, 11.5, 200)]);
  const valueCol = Math.max(...rows.flatMap(([, ls]) => ls.map((l) => medium.widthOfTextAtSize(l, 11.5 * K) / K)));
  let my = 130;
  for (const [k, ls] of rows) {
    T(k, R - valueCol - 14, my, 11.5, { color: C.muted, align: 'right' });
    ls.forEach((l, i) => T(l, R, my + i * 17, 11.5, { font: medium, color: C.ink, align: 'right' }));
    my += 19.6 + (ls.length - 1) * 17;
  }

  const ruleAt = Math.max(fy, my - 19.6) + 34;
  hline(L, R, ruleAt, 3, C.violet);

  // ── Billed to / Payment.
  const boxTop = ruleAt + 27;
  const boxH = 129;
  const boxW = (R - L - 18) / 2;
  const bx2 = L + boxW + 18;
  const paidAt = new Date(order.paid_at || order.createdAt);
  const time = paidAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).toUpperCase();
  const ref = order.extra?.cf_payment_id || order.extra?.txn_id;
  const method = order.extra?.payment_method || order.extra?.payment?.label || 'Online';
  rect(L, boxTop, boxW, boxH, C.box, 10);
  rect(bx2, boxTop, boxW, boxH, C.box, 10);
  T('B I L L E D   T O', L + 16, boxTop + 28, 10, { font: bold, color: C.violet });
  T('P A Y M E N T', bx2 + 16, boxTop + 28, 10, { font: bold, color: C.violet });

  T(order.customer_name || '—', L + 16, boxTop + 51, 13, { font: bold, color: C.ink });
  let by = boxTop + 51;
  for (const l of [order.customer_email, order.customer_phone].filter(Boolean)) { by += 18.4; T(l, L + 16, by, 11.5); }

  const pw = T('Paid · ', bx2 + 16, boxTop + 51, 13, { font: bold, color: C.ink });
  M(total, bx2 + 19 + pw, boxTop + 51, 13, { font: bold, color: C.ink });
  T(`${method}${ref ? ` · Cashfree ref ${ref}` : ''}`, bx2 + 16, boxTop + 69.4, 11.5);
  T(`${day(paidAt)}, ${time} IST`, bx2 + 16, boxTop + 87.8, 11.5);
  T('Reverse charge: No', bx2 + 16, boxTop + 106.2, 11.5);

  // ── Line items.
  const thTop = boxTop + boxH + 26;
  const thH = 49;
  rect(L, thTop, R - L, thH, C.ink, 8);
  const cols = { n: L + 12, desc: L + 41, sac: L + 296, qty: L + 368, taxable: L + 446, cgst: L + 520, sgst: L + 596, amt: R - 11 };
  const th = (s, x, align = 'left') => {
    const parts = s.split('\n');
    const mid = thTop + thH / 2 + 4;
    parts.forEach((p, i) => T(p, x, mid + (i - (parts.length - 1) / 2) * 15.5, 11.5, { font: medium, color: C.white, align }));
  };
  th('#', cols.n);
  th('Description', cols.desc);
  th('SAC', cols.sac);
  th('Qty', cols.qty, 'right');
  th('Taxable\nvalue', cols.taxable, 'right');
  th(`CGST\n${GST_RATE / 2}%`, cols.cgst, 'right');
  th(`SGST\n${GST_RATE / 2}%`, cols.sgst, 'right');
  th('Amount', cols.amt, 'right');

  const rowY = thTop + thH + 24;
  T('1', cols.n - 1, rowY, 11.5);
  const descLines = wrap(courseName(order), bold, 12.5, 240);
  descLines.forEach((l, i) => T(l, cols.desc, rowY + i * 16, 12.5, { font: bold, color: C.ink }));
  const subY = rowY + descLines.length * 16 + 1;
  T(order.extra?.batch ? `Batch: ${order.extra.batch}` : 'Online programme · Menler', cols.desc, subY, 11.5, { color: C.muted });
  T(SAC, cols.sac, rowY, 11.5);
  T('1', cols.qty, rowY, 11.5, { align: 'right' });
  M(taxable, cols.taxable, rowY, 11.5, { align: 'right' });
  M(cgst, cols.cgst, rowY, 11.5, { align: 'right' });
  M(sgst, cols.sgst, rowY, 11.5, { align: 'right' });
  M(total, cols.amt, rowY, 11.5, { align: 'right' });
  const rowBottom = subY + 21;
  hline(L, R, rowBottom, 1, C.line);

  // ── Totals.
  const tl = R - 330;
  let ty = rowBottom + 34;
  for (const [k, v] of [['Taxable value', taxable], [`CGST @ ${GST_RATE / 2}%`, cgst], [`SGST @ ${GST_RATE / 2}%`, sgst]]) {
    T(k, tl, ty, 12);
    M(v, R, ty, 12, { align: 'right' });
    ty += 28.5;
  }
  hline(tl, R, ty - 9, 2, C.ink);
  ty += 22;
  T('Total', tl, ty, 16, { font: bold, color: C.ink });
  M(total, R, ty, 16, { font: bold, color: C.ink, align: 'right' });

  // ── Words, then notes.
  ty += 38;
  const ww = T('Amount in words: ', L, ty, 11.5);
  T(rupeesInWords(total), L + ww, ty, 11.5, { font: bold, color: C.ink });

  ty += 34;
  hline(L, R, ty, 1, C.line);
  const igstW = T(`Prices include GST. For buyers outside ${COMPANY.state}, IGST @ ${GST_RATE}% (`, L, ty + 26, 10.5, { color: C.muted });
  const igstAmt = M(tax, L + igstW, ty + 26, 10.5, { color: C.muted });
  T(') applies in place of CGST + SGST.', L + igstW + igstAmt, ty + 26, 10.5, { color: C.muted });
  T(`SAC ${SAC}: commercial training and coaching services. Refunds, if any, are issued as a credit note against this invoice.`, L, ty + 43.5, 10.5, { color: C.muted });
  T('This is a computer-generated invoice and does not require a signature.', L, ty + 61, 10.5, { color: C.muted });

  // ── Footer.
  T('Menler Learning Systems Pvt Ltd', L, 1093, 10.5, { color: C.muted });
  T(`Questions? ${COMPANY.email}`, R, 1093, 10.5, { color: C.muted, align: 'right' });

  return { bytes: await pdf.save(), number: invoice.no };
}
