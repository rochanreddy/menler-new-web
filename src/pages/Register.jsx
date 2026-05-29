import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MeridianLogo from '../components/common/MeridianLogo';
import { supabase } from '../lib/supabase';

/* ── Shared icons ── */
const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const handleGoogle = async (setError) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/profile` },
  });
  if (error) setError(error.message || 'Unable to start Google sign-in. Please try again.');
};

/* ── Sign Up form ── */
function SignUpForm({ onSwitch }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!/^\+?[\d\s\-(]{10,}$/.test(form.phone.replace(/\s/g, ''))) return 'Please enter a valid phone number.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, phone: form.phone } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    // If session is null, email confirmation is still ON — send to verify page
    if (!data?.session) {
      navigate('/verify-email', { state: { email: form.email } });
    } else {
      navigate('/profile');
    }
  };

  return (
    <>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="su-name">Full Name</label>
          <input id="su-name" type="text" placeholder="Priya Sharma" autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div className="auth-field">
          <label htmlFor="su-email">Email</label>
          <input id="su-email" type="email" placeholder="priya@example.com" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} required />
        </div>
        <div className="auth-field">
          <label htmlFor="su-phone">Phone Number</label>
          <input id="su-phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" value={form.phone} onChange={e => set('phone', e.target.value)} required />
        </div>
        <div className="auth-field">
          <label htmlFor="su-password">Password</label>
          <div className="auth-field-pw">
            <input id="su-password" type={showPw ? 'text' : 'password'} placeholder="At least 8 characters" autoComplete="new-password" value={form.password} onChange={e => set('password', e.target.value)} required />
            <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
              <EyeIcon open={showPw} />
            </button>
          </div>
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account →'}
        </button>
      </form>

      <div className="auth-divider"><span>or</span></div>
      <button className="auth-google-btn" onClick={() => handleGoogle(setError)}><GoogleIcon />Continue with Google</button>

      <div className="auth-footer">
        Already have an account?{' '}
        <button className="auth-link" onClick={onSwitch}>Log in</button>
      </div>
    </>
  );
}

/* ── Log In form ── */
function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/');
  };

  return (
    <>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="li-email">Email</label>
          <input id="li-email" type="email" placeholder="priya@example.com" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} required autoFocus />
        </div>
        <div className="auth-field">
          <label htmlFor="li-password">Password</label>
          <div className="auth-field-pw">
            <input id="li-password" type={showPw ? 'text' : 'password'} placeholder="Your password" autoComplete="current-password" value={form.password} onChange={e => set('password', e.target.value)} required />
            <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
              <EyeIcon open={showPw} />
            </button>
          </div>
        </div>
        <div className="auth-forgot">
          <button type="button" className="auth-link" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in →'}
        </button>
      </form>

      <div className="auth-divider"><span>or</span></div>
      <button className="auth-google-btn" onClick={() => handleGoogle(setError)}><GoogleIcon />Continue with Google</button>

      <div className="auth-footer">
        Don't have an account?{' '}
        <button className="auth-link" onClick={onSwitch}>Create one</button>
      </div>
    </>
  );
}

/* ── Unified Register page ── */
export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'login' ? 'login' : 'signup');

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <MeridianLogo color="#534AB7" />
          <span className="auth-logo-text">Meridian</span>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>
            Create account
          </button>
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>
            Log in
          </button>
        </div>

        {tab === 'signup'
          ? <SignUpForm onSwitch={() => setTab('login')} />
          : <LoginForm onSwitch={() => setTab('signup')} />
        }
      </div>
    </div>
  );
}
