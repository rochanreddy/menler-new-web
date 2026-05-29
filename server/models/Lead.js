import mongoose from 'mongoose';

// Flexible lead capture — marketing forms post varying field sets.
const leadSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    program: { type: String, default: '' },
    track: { type: String, default: '' },
    background: { type: String, default: '' },
    message: { type: String, default: '' },
    source: { type: String, default: '' },
    page: { type: String, default: '' },

    utm_source: { type: String, default: '' },
    utm_medium: { type: String, default: '' },
    utm_campaign: { type: String, default: '' },
    utm_content: { type: String, default: '' },

    // Any extra fields a form sends are preserved here.
    extra: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Lead = mongoose.model('Lead', leadSchema);
