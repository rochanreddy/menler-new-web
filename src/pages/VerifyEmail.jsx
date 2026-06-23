import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenlerLogo from '../components/common/MenlerLogo';
import Seo from '../components/common/Seo';
import { supabase } from '../lib/supabase';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) { setError('Please enter the verification code.'); return; }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'signup',
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/profile');
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (!error) {
      setResendTimer(30);
      setCode('');
    }
  };

  return (
    <div className="auth-page">
      <Seo noindex />
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <MenlerLogo color="#534AB7" />
          <span className="auth-logo-text">Menler</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: 'var(--cloud)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--specialist)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="auth-h1">Check your email.</h1>
          <p className="auth-sub">
            We sent a verification code to{' '}
            <span className="otp-email-highlight">{email}</span>
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleVerify}>
          <div className="auth-field">
            <label htmlFor="otp-code">Verification code</label>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              placeholder="Enter your code"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              autoFocus
              autoComplete="one-time-code"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
        </form>

        <div className="resend-row">
          {resendTimer > 0 ? (
            <>Resend code in <strong>{resendTimer}s</strong></>
          ) : (
            <button className="auth-link" onClick={handleResend}>Resend code</button>
          )}
        </div>

        <div className="auth-footer">
          <button className="auth-link" onClick={() => navigate('/signup')}>Back to sign up</button>
        </div>
      </div>
    </div>
  );
}
