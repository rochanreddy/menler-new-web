import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Lead } from '../models/Lead.js';
import { pdfAttachments, isAllowedPdf } from './pdfAttachments.js';
import { sendMail } from './email.js';
// Delivery asks what the ORDER contains, not what checkout sells today, so it
// reads the deliverable map — retired packs stay sendable to the people who
// already paid for them.
import { DELIVERABLE_PACKS } from '../../src/data/resourceCatalog.js';

const LIB_TPL_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'emails', 'library');

/**
 * Send a single paid Library resource for an order.
 *
 * Which PDF was bought is read from the ORDER, not from the request, so this
 * works when nobody is asking — the webhook calls it the moment Cashfree
 * confirms the payment. Delivery used to depend on the buyer's browser coming
 * back from checkout and telling us what to send, which meant a closed tab
 * produced a paid order that nothing could fulfil: the choice existed only in
 * that tab.
 *
 * Idempotent on `delivered_pdf`, so the webhook firing twice — or the browser
 * also asking — cannot send the same resource twice.
 */
export async function deliverLibraryForOrder(order, { force = false } = {}) {
  if (!order) return { sent: 0, reason: 'no order' };
  if (!force && order.extra?.delivered_pdf) return { sent: 0, reason: 'already delivered' };

  const pdf = String(order.extra?.pdf || '').trim();
  if (!pdf) return { sent: 0, reason: 'no resource recorded on this order' };
  if (!isAllowedPdf(pdf)) return { sent: 0, reason: 'resource is not a deliverable file' };

  const to = String(order.customer_email || '').trim();
  if (!to) return { sent: 0, reason: 'no email address on the order' };
  const first = String(order.customer_name || '').trim().split(/\s+/)[0] || 'there';

  // Template file is named to match the PDF basename.
  const tplBase = pdf.split('/').pop().replace(/\.pdf$/i, '');
  let html;
  try {
    html = await fsp.readFile(path.join(LIB_TPL_DIR, `${tplBase}.html`), 'utf8');
  } catch {
    return { sent: 0, reason: `no email template for ${tplBase}` };
  }
  html = html.replace(/\{\{\s*first_name\s*\}\}/gi, first);
  const subject = (html.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim() || 'Your Menler resource';

  await sendMail({
    to,
    subject,
    text: `Hi ${first},\n\nThanks for your purchase — your resource is attached to this email.\n\n— Team Menler\nmenler.in`,
    html,
    attachments: pdfAttachments([pdf]),
  });

  order.extra = { ...(order.extra || {}), delivered_pdf: pdf, delivered_at: new Date() };
  order.markModified('extra');
  await order.save();

  return { sent: 1, to, pdf };
}

/**
 * Send a paid campaign's resource pack, from the server.
 *
 * This used to be the browser's job: Cashfree redirected the buyer back and the
 * page then asked the API to send the PDFs. A closed tab, a locked phone or a
 * flaky redirect therefore meant a completed payment and no email, with nothing
 * recording the gap — which is exactly what happened to one of the first three
 * ₹99 buyers. Driving it from the webhook instead means delivery no longer
 * depends on the buyer's browser doing anything at all.
 *
 * Safe to call more than once: an order that already recorded a delivery is
 * skipped, so the webhook firing twice can't send the pack twice.
 */
export async function deliverPackForOrder(order, { force = false, pack: override = null } = {}) {
  if (!order) return { sent: 0, reason: 'no order' };
  if (!force && order.extra?.resources_sent_at) {
    return { sent: 0, reason: 'already delivered' };
  }

  const pack = override || DELIVERABLE_PACKS[String(order.program || '').toLowerCase()];
  if (!pack) return { sent: 0, reason: 'this programme has no resource pack' };

  const to = String(order.customer_email || '').trim();
  if (!to) return { sent: 0, reason: 'no email address on the order' };

  const items = (pack.items || []).filter((i) => i?.pdf && isAllowedPdf(String(i.pdf)));
  if (!items.length) return { sent: 0, reason: 'no deliverable files in the pack' };

  const attachments = pdfAttachments(items.map((i) => i.pdf));
  const titles = items.map((i) => i.title);
  const name = String(order.customer_name || '').trim().split(/\s+/)[0] || 'there';

  await sendMail({
    to,
    subject: `Your ${pack.title} — ${items.length} playbooks inside`,
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for your purchase — here is the <strong>${pack.title}</strong>, all
         ${items.length} playbooks attached to this email.</p>
      <ul>${titles.map((t) => `<li>${t}</li>`).join('')}</ul>
      <p>They are yours to keep. Reply to this email if anything does not open.</p>
      <p>— The Menler Team</p>`,
    text: `Hi ${name},\n\nThanks for your purchase — here is the ${pack.title}, all ${items.length} playbooks attached.\n\n${titles.map((t) => `- ${t}`).join('\n')}\n\nThey are yours to keep. Reply to this email if anything does not open.\n\n— The Menler Team`,
    attachments,
  });

  order.extra = {
    ...(order.extra || {}),
    resources_sent_at: new Date(),
    resources_count: items.length,
  };
  order.markModified('extra');
  await order.save();

  // Mirror it onto the lead, which is where the admin already reads delivery
  // from for the packs bought before this existed.
  if (order.leadId) {
    const lead = await Lead.findById(order.leadId).catch(() => null);
    if (lead) {
      const label = titles.join(' | ');
      if (!lead.resource) lead.resource = label;
      await lead.save().catch(() => {});
    }
  }

  return { sent: items.length, to };
}
