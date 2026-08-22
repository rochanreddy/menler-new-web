/**
 * Build guard: the OTP must be real in anything we ship.
 *
 * Local development can skip Amplifeed's widget (see VITE_OTP_DEV_BYPASS in
 * src/lib/amplifeedOtp.js). That path is written so Vite strips it from a build
 * — but "written so it should be stripped" is exactly the kind of thing that
 * quietly stops being true. A helper wrapping the check was enough to defeat
 * the minifier once already, and the bypass string went into dist/ without a
 * single warning.
 *
 * So this asserts it instead of trusting it: the marker must be absent from the
 * bundle, and the real widget loader must still be present. Either way round is
 * a failed build, not a surprise in production.
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';

// Must NOT survive a build.
const FORBIDDEN = ['DEV-BYPASS-NOT-VERIFIED', 'VITE_OTP_DEV_BYPASS', '[otp] dev bypass'];
// Must survive it — a bypass that shipped and an OTP that vanished look the
// same from the outside: nobody gets asked for a code.
const REQUIRED = ['amplifeed.tech/embed/otp'];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(js|mjs|css|html)$/.test(name)) out.push(full);
  }
  return out;
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error(`[otp-guard] no ${DIST}/ to check — run the build first.`);
  process.exit(1);
}

const contents = files.map((f) => [f, readFileSync(f, 'utf8')]);
const problems = [];

for (const needle of FORBIDDEN) {
  const hits = contents.filter(([, text]) => text.includes(needle)).map(([f]) => f);
  if (hits.length) problems.push(`the dev OTP bypass reached the bundle — "${needle}" found in:\n    ${hits.join('\n    ')}`);
}

for (const needle of REQUIRED) {
  if (!contents.some(([, text]) => text.includes(needle))) {
    problems.push(`the real OTP widget is missing from the bundle — nothing references "${needle}"`);
  }
}

if (problems.length) {
  console.error('\n[otp-guard] BUILD REJECTED\n');
  problems.forEach((p) => console.error('  - ' + p + '\n'));
  console.error('  Verification would not work for real applicants. Fix before shipping.\n');
  process.exit(1);
}

console.log(`[otp-guard] ok — no dev bypass in ${files.length} built files, and the OTP widget is still wired up.`);
