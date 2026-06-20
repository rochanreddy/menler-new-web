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
    utm_term: { type: String, default: '' },

    // Ad-click IDs + attribution + consent (for CRM tracking).
    gclid: { type: String, default: '' },
    fbclid: { type: String, default: '' },
    page_url: { type: String, default: '' },
    referrer_url: { type: String, default: '' },
    cta_label: { type: String, default: '' },
    communication_optin: { type: Boolean, default: true },

    // Any extra fields a form sends are preserved here.
    extra: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Lead = mongoose.model('Lead', leadSchema);
