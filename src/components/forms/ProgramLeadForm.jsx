import { useState } from 'react';
import { verifyAndDownloadBrochure } from '../../lib/brochure';
import { useToast } from '../common/Toast';

export default function ProgramLeadForm({ program, programColor = 'var(--specialist)', buttonBg = 'var(--specialist)' }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', track: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyAndDownloadBrochure({
        ...form,
        program: program || 'generalist',
        resource: `${program || 'Menler'} Brochure`,
        source: 'program-lead-form',
        cta_label: 'Program brochure',
        section: program || 'Program lead',
      });
      setDone(true);
      toast.success("Verified — your brochure is downloading.");
    } catch {
      toast.error("Couldn't verify that just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="lead-ok">
        ✓ Verified! Your brochure is downloading. Check your downloads folder.
      </div>
    );
  }

  return (
    <form className="prog-lead-form" onSubmit={handleSubmit}>
      <div>
        <label>Full name</label>
        <input required placeholder="Arjun Kumar" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
      </div>
      <div className="row2">
        <div>
          <label>Email</label>
          <input required type="email" placeholder="arjun@example.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
        </div>
        <div>
          <label>Phone</label>
          <input required type="tel" placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" />
        </div>
      </div>
      <div>
        <label>Your background</label>
        <select required value={form.track} onChange={e => set('track', e.target.value)}>
          <option value="">Select…</option>
          <option>Student</option>
          <option>Working professional</option>
          <option>Founder / entrepreneur</option>
          <option>Career transition</option>
          <option>Other</option>
        </select>
      </div>
      <button type="submit" style={{ background: buttonBg }} disabled={loading}>
        {loading ? 'Sending…' : 'Get brochure & cohort details'}
      </button>
    </form>
  );
}
