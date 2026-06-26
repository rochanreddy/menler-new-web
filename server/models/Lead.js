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

    // Attribution: which area/framework (section) and which exact button (cta_label,
    // already above) the lead came from — used to bifurcate CRM automation.
    section: { type: String, default: '' },

    // Shareable aptitude report link (so the CRM can open the candidate's result).
    report_url: { type: String, default: '' },

    // Resource/PDF gated downloads + double opt-in email verification.
    // A lead becomes a "quality lead" only after clicking the emailed link.
    resource: { type: String, default: '' },
    resource_pdf: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    verified_at: { type: Date, default: null },

    // Any extra fields a form sends are preserved here.
    extra: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Lead = mongoose.model('Lead', leadSchema);
