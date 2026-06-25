import { useState } from 'react';
import { submitLead } from '../../services/leadService';
import { useToast } from '../common/Toast';

export default function MiniLeadForm({ defaultProgram = '' }) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState(defaultProgram);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({ email, program, cta_label: 'Mini lead form', section: program || 'Mini lead' });
      setDone(true);
      toast.success("You're on the list — we'll reach out soon.");
    } catch {
      toast.error("Couldn't sign you up just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return <div className="mini-lead-success">You're on the list — we'll reach out soon!</div>;
  }

  return (
    <form className="mini-lead-form" onSubmit={handleSubmit}>
      <input
        required
        type="email"
        aria-label="Email address"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="email"
      />
      <select aria-label="Program of interest" value={program} onChange={e => setProgram(e.target.value)}>
        <option value="">Select program…</option>
        <option>Gen AI Kickstarter</option>
        <option>Claude AI Generalist</option>
        <option>Claude AI Engineering</option>
        <option>Not sure yet</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? '…' : 'Notify me'}
      </button>
    </form>
  );
}
