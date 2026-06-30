import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenlerLogo from '../components/common/MenlerLogo';
import Seo from '../components/common/Seo';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  return (
    <div className="auth-page">
      <Seo noindex />
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <MenlerLogo color="#534AB7" />
          <span className="auth-logo-text">Menler</span>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--placed)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="auth-h1">Check your inbox.</h1>
            <p className="auth-sub" style={{ marginBottom: 28 }}>
              We've sent a reset link to{' '}
              <span className="otp-email-highlight">{email}</span>.{' '}
              Check your spam folder if you don't see it within a few minutes.
            </p>
            <button className="auth-btn" onClick={() => navigate('/login')}>Back to Log In</button>
          </div>
        ) : (
          <>
            <div style={{ width: 52, height: 52, background: 'var(--cloud)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--specialist)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="auth-h1">Forgot your password?</h1>
            <p className="auth-sub">Enter your email and we'll send you a reset link.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="fp-email">Email</label>
                <input
                  id="fp-email"
                  type="email"
                  placeholder="priya@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <div className="auth-footer">
              <button className="auth-link" onClick={() => navigate('/login')}>Back to Log In</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
