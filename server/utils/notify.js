import { Notification } from '../models/Notification.js';

/**
 * Raise an alert for the admin bell. Never throws: an alert is a side effect,
 * and a database hiccup here must not fail the payment webhook or the email
 * that triggered it. With a `key`, the first alert wins and later ones for the
 * same event are ignored (Cashfree retries webhooks).
 */
export async function notify({ kind, key, title, detail = '', meta = {} }) {
  try {
    const doc = { kind, title, detail: String(detail).slice(0, 500), meta };
    if (key) {
      await Notification.updateOne({ key }, { $setOnInsert: { ...doc, key } }, { upsert: true });
    } else {
      await Notification.create(doc);
    }
  } catch (err) {
    console.error('[notify] could not save alert:', err.message);
  }
}

/** Mark an alert as sorted out on its own (e.g. a failed order paid on retry). */
export async function resolveNotification(key) {
  try {
    await Notification.updateOne({ key }, { $set: { resolved: true } });
  } catch (err) {
    console.error('[notify] could not resolve alert:', err.message);
  }
}
