import mongoose from 'mongoose';

// An issued participation certificate. We store the inputs rather than the PDF
// itself — the document is deterministic, so /certificates/:certId regenerates
// it on demand. That keeps the download link permanent with no file storage.
const certificateSchema = new mongoose.Schema(
  {
    certId: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    programName: { type: String, required: true, trim: true },
    mentorName: { type: String, default: '' },
    mentorRole: { type: String, default: '' },
    founderName: { type: String, default: '' },
    founderRole: { type: String, default: '' },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model('Certificate', certificateSchema);
