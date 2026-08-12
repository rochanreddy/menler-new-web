import { Lead } from '../models/Lead.js';
import { pdfAttachments, isAllowedPdf } from './pdfAttachments.js';
import { sendMail } from './email.js';
import { RESOURCE_PACKS } from '../../src/data/resourceCatalog.js';

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
export async function deliverPackForOrder(order, { force = false } = {}) {
  if (!order) return { sent: 0, reason: 'no order' };
  if (!force && order.extra?.resources_sent_at) {
    return { sent: 0, reason: 'already delivered' };
  }

  const pack = RESOURCE_PACKS[String(order.program || '').toLowerCase()];
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
