// Lightweight "did you mean …?" suggestion for common email-domain typos.
// Returns a corrected email string, or null if the address looks fine.

const POPULAR = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'protonmail.com', 'live.com', 'aol.com', 'rediffmail.com', 'ymail.com',
];

// Classic Levenshtein edit distance.
function dist(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[m][n];
}

export function suggestEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  const m = /^[^\s@]+@([^\s@]+)$/.exec(e);
  if (!m) return null;
  const domain = m[1];
  if (POPULAR.includes(domain)) return null; // already a known-good domain

  let best = null, bestD = Infinity;
  for (const d of POPULAR) {
    const dd = dist(domain, d);
    if (dd < bestD) { bestD = dd; best = d; }
  }
  // Only suggest for close typos (1–2 edits) — avoids flagging real domains.
  if (best && bestD > 0 && bestD <= 2) return e.replace(`@${domain}`, `@${best}`);
  return null;
}
