import { useState } from 'react';
import Reveal from '../common/Reveal';
import { useToast } from '../common/Toast';
import { verifyAndDownloadBrochure } from '../../lib/brochure';

/**
 * Curriculum download — verifies the email by OTP, hands over the brochure PDF
 * as an on-site download, and records the lead in the background. Same helper
 * the programme pages use, so the file and CRM fields stay in one place.
 *
 * `program` picks the PDF (see lib/brochure), `resource` names the download.
 */
export default function CampaignDownload({
  program,
  resource,
  source,
  eyebrow = 'Full syllabus',
  title = 'Take the curriculum with you.',
  sub,
}) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyAndDownloadBrochure({
        email: email.trim(),
        program,
        resource,
        source,
        cta_label: 'Download curriculum',
        section: 'Curriculum',
      });
      setDone(true);
      toast.success('Curriculum downloaded — check your downloads folder.');
    } catch {
      toast.error("Couldn't send that just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="gcamp-sec gcamp-dl">
      <Reveal className="gcamp-dl-card">
        <div className="gcamp-dl-txt">
          <p className="gcamp-eyebrow">{eyebrow}</p>
          <h2 className="gcamp-h2">{title}</h2>
          <p className="gcamp-sub">{sub}</p>
        </div>

        {done ? (
          <p className="gcamp-dl-done">
            Sent — your curriculum PDF has been downloaded.
          </p>
        ) : (
          <form className="gcamp-dl-form" onSubmit={handleSubmit}>
            <input
              required
              type="email"
              aria-label="Email address"
              placeholder="Your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="gcamp-cta" disabled={loading}>
              {loading ? 'Verifying…' : 'Download curriculum'}
            </button>
            <p className="gcamp-dl-note">PDF · no spam, we verify your email once.</p>
          </form>
        )}
      </Reveal>
    </section>
  );
}
