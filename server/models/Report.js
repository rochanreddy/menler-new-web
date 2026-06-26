import mongoose from 'mongoose';

// A shareable, read-only snapshot of an aptitude-test result. Created when a
// user submits the details form after the test; surfaced at /report/:rid and
// the URL is attached to the lead (report_url) so the CRM can open it.
const reportSchema = new mongoose.Schema(
  {
    rid: { type: String, unique: true, index: true }, // short shareable id
    name: { type: String, default: '' },
    cluster: { type: String, default: '' },
    setIdx: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    dims: {
      type: [{ label: String, pct: Number, _id: false }],
      default: [],
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);
