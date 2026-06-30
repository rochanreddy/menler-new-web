import mongoose from 'mongoose';

// Per-campaign internal settings, keyed by the campaign URL slug
// (menler.in/campaign/<slug>). Currently holds the Zoom / meeting link the CRM
// shares with registrants. This is ADMIN-ONLY — it is never queried by or shown
// on the public site; only the /admin endpoints read or write it.
const campaignSettingSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, default: '' },
    zoomLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CampaignSetting = mongoose.model('CampaignSetting', campaignSettingSchema);
