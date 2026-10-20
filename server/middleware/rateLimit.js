// Per-address request limits for the public endpoints that can be abused:
// the admin and account logins (password guessing), OTP and password-reset
// (SMS and email spam), registrations and resource requests (fake leads and
// mail floods), and payment orders (junk Cashfree orders).
//
// In memory, per process: good enough for one Render instance, and it resets
// on deploy. Limits are generous on purpose — a whole class registering from
// one college Wi-Fi shares one address and must not be turned away.
//
// Only POSTs count, so CORS preflights and page reads are never limited. A
// limited request gets 429 with an `error` the site shows as written ("Too
// many attempts…", see src/lib/friendlyError.js).

const buckets = new Map();

function clientIp(req) {
  // Render sits behind a proxy; the first X-Forwarded-For entry is the visitor.
  return String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim() || 'unknown';
}

// Drop expired windows now and then, so the map doesn't grow one entry per
// visitor for the life of the process.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
}, 5 * 60 * 1000).unref();

export function rateLimit({ name, max, windowMs, message }) {
  return (req, res, next) => {
    if (req.method !== 'POST') return next();
    const key = `${name}:${clientIp(req)}`;
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now > b.resetAt) {
      b = { count: 0, resetAt: now + windowMs };
      buckets.set(key, b);
    }
    b.count += 1;
    if (b.count > max) {
      const retryAfter = Math.ceil((b.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      console.warn(`[rate-limit] ${name} blocked ${clientIp(req)} (${b.count}/${max})`);
      return res.status(429).json({ error: message || 'Too many attempts in a short time. Please wait a few minutes and try again.' });
    }
    return next();
  };
}
