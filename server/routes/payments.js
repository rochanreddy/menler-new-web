import { Router } from 'express';
import crypto from 'crypto';

import { Lead } from '../models/Lead.js';
import { Order } from '../models/Order.js';
import { PROGRAM_PRICES, priceFor } from '../config/pricing.js';
import {
  createCashfreeOrder,
  getCashfreeOrder,
  verifyWebhookSignature,
  cashfreeConfigured,
  CASHFREE_MODE,
} from '../utils/cashfree.js';
import { forwardLeadToCrm } from './leads.js';
import { validateEmail } from '../utils/emailValidation.js';

const router = Router();

const FRONTEND_BASE = () =>
  (process.env.FRONTEND_URL || 'https://menler.in').split(',')[0].trim().replace(/\/+$/, '');
// Public URL of THIS API (for the webhook notify_url). Optional — the webhook
// can also be set globally in the Cashfree dashboard.
const API_PUBLIC_BASE = () => (process.env.API_PUBLIC_URL || '').replace(/\/+$/, '');

// Best-effort 10-digit Indian phone for Cashfree's customer_phone.
function cleanPhone(p) {
  const digits = String(p || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits.slice(-10);
}

/* Public: prices + mode for the frontend button labels (no secrets). */
router.get('/pricing', (_req, res) => {
  res.json({ mode: CASHFREE_MODE, configured: cashfreeConfigured(), prices: PROGRAM_PRICES });
});

/* Create a Cashfree order for a paid program (kickstarter | generalist). */
router.post('/cashfree/order', async (req, res) => {
  try {
    if (!cashfreeConfigured()) return res.status(503).json({ error: 'Payments are not configured.' });
    const body = req.body || {};
    const program = String(body.program || '').toLowerCase();
    const price = priceFor(program);
    if (!price) return res.status(400).json({ error: 'Unknown or free program.' });

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = cleanPhone(body.phone);
    const background = String(body.background || '').trim();
    const city = String(body.city || '').trim();
    const track = String(body.track || '').trim();
    if (!name || !email || phone.length !== 10) {
      return res.status(400).json({ error: 'Name, a valid email and a 10-digit phone are required.' });
    }
    const v = await validateEmail(email);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    // Capture intent as a lead so it shows in admin + CRM even before payment.
    const lead = await Lead.create({
      name, email, phone, background, track,
      program,
      source: `enrol-${program}`,
      cta_label: `Enrol: ${price.label}`,
      section: price.label,
      extra: { ...(city ? { city } : {}) },
    });
    forwardLeadToCrm(lead);

    const orderId = `MNLR_${program}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const notifyBase = API_PUBLIC_BASE();

    const cf = await createCashfreeOrder({
      orderId,
      amount: price.amount,
      customer: { id: String(lead._id), name, email, phone },
      returnUrl: `${FRONTEND_BASE()}/${program}?order_id={order_id}`,
      notifyUrl: notifyBase ? `${notifyBase}/payments/cashfree/webhook` : undefined,
    });

    await Order.create({
      order_id: orderId,
      program,
      amount: price.amount,
      status: 'CREATED',
      cf_payment_session_id: cf.payment_session_id || '',
      leadId: lead._id,
      customer_name: name, customer_email: email, customer_phone: phone,
    });

    res.status(201).json({
      order_id: orderId,
      payment_session_id: cf.payment_session_id,
      mode: CASHFREE_MODE,
    });
  } catch (err) {
    console.error('cashfree order error', err.data || err.message);
    res.status(500).json({ error: 'Could not start the payment. Please try again.' });
  }
});

/* Mark a paid order + its lead. Called from webhook and status check. */
async function markPaid(order) {
  if (!order || order.status === 'PAID') return;
  order.status = 'PAID';
  order.paid_at = new Date();
  await order.save();
  if (order.leadId) {
    const lead = await Lead.findById(order.leadId);
    if (lead) {
      lead.checkout_completed = true;
      lead.checkout_at = new Date();
      lead.verified = true;
      lead.extra = { ...(lead.extra || {}), paid_amount: order.amount, order_id: order.order_id };
      await lead.save();
      forwardLeadToCrm(lead);
    }
  }
}

/* Webhook — Cashfree posts payment events here. Verify on the RAW body. */
router.post('/cashfree/webhook', async (req, res) => {
  try {
    const signature = req.get('x-webhook-signature');
    const timestamp = req.get('x-webhook-timestamp');
    if (!verifyWebhookSignature(signature, req.rawBody, timestamp)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    const data = (req.body && req.body.data) || {};
    const orderId = data.order?.order_id || data.order_id;
    const status = (data.payment?.payment_status || data.order?.order_status || '').toUpperCase();
    if (orderId) {
      const order = await Order.findOne({ order_id: orderId });
      if (order) {
        if (status === 'SUCCESS' || status === 'PAID') {
          await markPaid(order);
        } else if ((status === 'FAILED' || status === 'USER_DROPPED') && order.status === 'CREATED') {
          order.status = 'FAILED';
          await order.save();
        }
      }
    }
    res.json({ ok: true }); // 200 so Cashfree doesn't retry a handled event
  } catch (err) {
    console.error('cashfree webhook error', err.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/* Confirm an order's status (frontend calls this after checkout closes). */
router.get('/cashfree/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    // Webhook may lag / be unreachable (localhost) — confirm directly with Cashfree.
    if (order.status !== 'PAID' && cashfreeConfigured()) {
      try {
        const cf = await getCashfreeOrder(order.order_id);
        if ((cf.order_status || '').toUpperCase() === 'PAID') await markPaid(order);
      } catch { /* fall back to local status */ }
    }
    res.json({ order_id: order.order_id, status: order.status, program: order.program, amount: order.amount });
  } catch (err) {
    console.error('cashfree status error', err.message);
    res.status(500).json({ error: 'Could not fetch status' });
  }
});

export default router;
