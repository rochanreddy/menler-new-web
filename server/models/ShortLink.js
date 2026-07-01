import mongoose from 'mongoose';

// Branded URL shortener entry. `code` is the short slug (e.g. "cm" or "aB3xk"),
// `target` is the real long URL it redirects to. Admin-managed; the public
// redirect lives at /l/:code. Changing `target` re-points an existing short
// link without changing the short URL already sent out (e.g. update a Zoom link).
const shortLinkSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true, trim: true },
    target: { type: String, required: true },
    label: { type: String, default: '' }, // optional note, e.g. the campaign name
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ShortLink = mongoose.model('ShortLink', shortLinkSchema);
