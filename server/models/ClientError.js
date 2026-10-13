import mongoose from 'mongoose';

// A failure a visitor hit during registration or checkout, reported by the
// browser (src/lib/friendlyError.js → POST /client-errors). Nothing personal is
// stored — no name, email or phone — only where it failed and why, so the team
// can see "12 OTP failures on the Modern Work page today" before anyone writes in.
// Kept for 90 days.
const clientErrorSchema = new mongoose.Schema(
  {
    stage: { type: String, default: '' },    // otp | register | order | payment | confirm
    code: { type: String, default: '' },     // network | timeout | server_502 | otp | payment_cancelled …
    message: { type: String, default: '' },  // the raw error text, capped
    status: { type: Number, default: null }, // HTTP status, when there was one
    campaign: { type: String, default: '' },
    page: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

clientErrorSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const ClientError = mongoose.model('ClientError', clientErrorSchema);
