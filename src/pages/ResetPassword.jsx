import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MenlerLogo from '../components/common/MenlerLogo';
import { supabase } from '../lib/supabase';

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // reset token passed via email link

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--placed)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="auth-h1">Password reset.</h1>
          <p className="auth-sub" style={{ marginBottom: 28 }}>
            Your password has been updated. You can now log in with your new password.
          </p>
          <button className="auth-btn" onClick={() => navigate('/login')}>Log in →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <MenlerLogo color="#534AB7" />
          <span className="auth-logo-text">Menler</span>
        </div>

        <h1 className="auth-h1">Reset your password.</h1>
        <p className="auth-sub">Choose a new password for your account.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="rp-password">New Password</label>
            <div className="auth-field-pw">
              <input
                id="rp-password"
                type={showPw ? 'text' : 'password'}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="rp-confirm">Confirm New Password</label>
            <div className="auth-field-pw">
              <input
                id="rp-confirm"
                type={showPw ? 'text' : 'password'}
                placeholder="Repeat your new password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password →'}
          </button>
        </form>
      </div>
    </div>
  );
}
