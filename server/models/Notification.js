import mongoose from 'mongoose';

// Something the team should hear about before a student writes in: a Cashfree
// payment that failed or was abandoned at checkout, or an email that did not go
// out or bounced. Shown under the bell in the admin header.
//
// `key` makes each event one alert — the same order failing twice, or Cashfree
// retrying a webhook, does not stack up duplicates. `resolved` is set when the
// problem fixed itself (the order was paid on a retry), so the bell can say so
// rather than send someone chasing a student who already paid. Kept 90 days.
const notificationSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true },   // payment_failed | payment_dropped | email_failed | email_bounced
    key: { type: String, default: undefined }, // dedupe key, e.g. pay:<order_id>
    title: { type: String, default: '' },
    detail: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false, index: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ key: 1 }, { unique: true, sparse: true });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
