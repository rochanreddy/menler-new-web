import { useState } from 'react';
import { submitLead } from '../../services/leadService';
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
      await submitLead({ ...form, program, cta_label: 'Program interest', section: program || 'Program lead' });
      setDone(true);
      toast.success("Brochure on its way — check your inbox shortly.");
    } catch {
      toast.error("Couldn't send that just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="lead-ok">
        ✓ Got it! We'll send your brochure + cohort details within a few hours.
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
          <input type="tel" placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" />
        </div>
      </div>
      <div>
        <label>Your background</label>
        <select value={form.track} onChange={e => set('track', e.target.value)}>
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
