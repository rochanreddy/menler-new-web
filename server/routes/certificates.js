import { Router } from 'express';

import { Certificate } from '../models/Certificate.js';
import { buildCertificatePdf } from '../utils/certificate.js';

const router = Router();

const slugName = (name) =>
  String(name).trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60) || 'participant';

/**
 * Public download link emailed to each participant. The id is a random 8-hex
 * token, so it isn't guessable, and the PDF is regenerated from the stored
 * inputs rather than served from storage.
 */
router.get('/:certId', async (req, res) => {
  try {
    const certId = String(req.params.certId || '').trim().toUpperCase();
    const cert = await Certificate.findOne({ certId });
    if (!cert) {
      return res
        .status(404)
        .type('html')
        .send('<p style="font-family:sans-serif;padding:40px">Certificate not found. Please check the link, or reply to the email you received.</p>');
    }

    const { buffer } = await buildCertificatePdf({
      name: cert.name,
      programName: cert.programName,
      certId: cert.certId,
      ...(cert.mentorName ? { mentorName: cert.mentorName } : {}),
      ...(cert.mentorRole ? { mentorRole: cert.mentorRole } : {}),
      ...(cert.founderName ? { founderName: cert.founderName } : {}),
      ...(cert.founderRole ? { founderRole: cert.founderRole } : {}),
    });

    Certificate.updateOne({ _id: cert._id }, { $inc: { downloads: 1 } }).catch(() => {});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Menler-Certificate-${slugName(cert.name)}.pdf"`);
    res.send(buffer);
  } catch (err) {
    console.error('[certificates] download failed:', err);
    res.status(500).type('html').send('<p style="font-family:sans-serif;padding:40px">Could not generate the certificate. Please try again.</p>');
  }
});

export default router;
