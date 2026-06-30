// Remembers that the visitor verified their email (via OTP) for the current
// browser-tab session. Once verified, gated downloads / forms can skip the OTP
// step for the same email — "verify once, not on every PDF". Stored in
// sessionStorage so it clears when the tab closes.

const KEY = 'menler_verified_lead';

export function getVerifiedLead() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveVerifiedLead(data) {
  try {
    const prev = getVerifiedLead() || {};
    sessionStorage.setItem(KEY, JSON.stringify({ ...prev, ...data }));
  } catch {
    /* storage unavailable — verification just won't be remembered */
  }
}

// True when the session already holds a verified OTP token. When `email` is
// given, it must match the verified email (verification is per-email).
export function isEmailVerified(email) {
  const v = getVerifiedLead();
  if (!v || !v.otp_token) return false;
  if (!email) return true;
  return String(v.email || '').trim().toLowerCase() === String(email).trim().toLowerCase();
}
