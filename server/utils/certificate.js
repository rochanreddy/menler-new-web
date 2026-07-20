// Generates a Menler participation certificate as a PDF (landscape A4).
//
// This is a faithful reproduction of the `.lp2-cert-mock` certificate shown on
// the campaign landing pages (see src/styles/global.css) — same gold double
// frame, cream gradient, verified seal, DM Serif Display name and dual
// signatures. Pure JS (pdf-lib + fontkit) so it runs on the API server with no
// native deps or headless browser.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dirname, '../assets/fonts');
const LOGO = path.resolve(__dirname, '../../public/email-logo-dark.png');

/* ── Palette (mirrors .lp2-cert-mock) ─────────────────────────────────────── */
const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const GOLD = hex('#BA7517');
const GOLD_DARK = hex('#854F0B');
const GOLD_LIGHT = hex('#F6C457');
const INK = hex('#26215C');
const PURPLE = hex('#534AB7');            // brand accent — wordmark rule + tagline
const MUTED = hex('#888780');
const CREAM_TOP = hex('#FFFDF8');
const CREAM_BOTTOM = hex('#FFF6E1');
const WHITE = rgb(1, 1, 1);

const mix = (a, b, t) => rgb(
  a.red + (b.red - a.red) * t,
  a.green + (b.green - a.green) * t,
  a.blue + (b.blue - a.blue) * t,
);

/* ── Geometry (CSS px × 1.4033, the 600px mock scaled to a 842pt page) ─────── */
const W = 842;
const H = 595;
const CARD = 10;                 // page edge → card edge
const PAD_X = 62;                // card padding-left/right (44px)
const LEFT = CARD + PAD_X;
const RIGHT = W - CARD - PAD_X;

/** Deterministic-ish public certificate id, e.g. MNLR-9F3A21C8 */
export function makeCertId(seed = '') {
  const h = crypto.createHash('sha1').update(seed + Date.now() + Math.random()).digest('hex');
  return `MNLR-${h.slice(0, 8).toUpperCase()}`;
}

const roundRect = (x, y, w, h, r) =>
  `M ${x + r},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r}` +
  ` V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h}` +
  ` H ${x + r} A ${r},${r} 0 0 1 ${x},${y + h - r}` +
  ` V ${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`;

/**
 * Build one certificate PDF.
 * @returns {Promise<{buffer: Buffer, certId: string}>}
 */
export async function buildCertificatePdf({
  name,
  programName,
  mentorName = 'Nitin K Sethi',
  mentorRole = 'Ex-McKinsey | MIT & UT Mentor',
  founderName = 'Sachin Roy',
  founderRole = 'Founder, Menler',
  certId = makeCertId(name),
}) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`Menler — Certificate of Participation — ${name}`);
  pdf.setAuthor('Menler Learning Systems Private Limited');
  pdf.setSubject(programName);
  pdf.setKeywords([certId]); // id lives in metadata so the face stays clean

  const page = pdf.addPage([W, H]);
  const ttf = (f) => pdf.embedFont(fs.readFileSync(path.join(ASSETS, f)), { subset: true });
  const serif = await ttf('DMSerifDisplay-Regular.ttf');
  const sans = await ttf('DMSans-Regular.ttf');
  const sansMed = await ttf('DMSans-Medium.ttf');
  const sansBold = await ttf('DMSans-Bold.ttf');
  const sansItalic = await ttf('DMSans-Italic.ttf');
  const serifItalic = await ttf('DMSerifDisplay-Italic.ttf');

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  const measure = (t, font, size, tracking = 0) =>
    font.widthOfTextAtSize(t, size) + tracking * Math.max(0, t.length - 1);

  // Draws text, honouring letter-spacing (pdf-lib has no tracking option).
  const draw = (t, { x, y, font, size, color = INK, tracking = 0, opacity = 1 }) => {
    if (!tracking) { page.drawText(t, { x, y, size, font, color, opacity }); return; }
    let cx = x;
    for (const ch of t) {
      page.drawText(ch, { x: cx, y, size, font, color, opacity });
      cx += font.widthOfTextAtSize(ch, size) + tracking;
    }
  };

  const centre = (t, opts) => draw(t, { ...opts, x: (W - measure(t, opts.font, opts.size, opts.tracking)) / 2 });

  /* ── Background: linear-gradient(160deg, #FFFDF8, #FFF6E1) ──────────────── */
  const BANDS = 90;
  for (let i = 0; i < BANDS; i += 1) {
    page.drawRectangle({
      x: 0, y: H - ((i + 1) * H) / BANDS, width: W, height: H / BANDS + 0.6,
      color: mix(CREAM_TOP, CREAM_BOTTOM, i / (BANDS - 1)),
    });
  }

  /* ── Double gold frame (card border + ::before + ::after) ───────────────── */
  const frame = (inset, radius, color, borderWidth, borderOpacity) =>
    page.drawSvgPath(roundRect(inset, inset, W - inset * 2, H - inset * 2, radius), {
      x: 0, y: H, borderColor: color, borderWidth, borderOpacity,
    });
  frame(CARD, 22.4, GOLD, 1.2, 0.4);
  frame(CARD + 15.4, 15.4, GOLD, 2.1, 1);
  frame(CARD + 21, 11.2, GOLD, 1.2, 0.3);

  /* ── Top row: wordmark + tagline (left) · verified seal (right) ─────────── */
  // Both marks sit diagonally outward-and-up toward their corners: the wordmark
  // up-left, the seal up-right. RISE/SHIFT tune that offset together.
  const ROW_MID = 484;
  const RISE = 28;                          // how far up from the row centre
  const SHIFT = 12;                         // how far out toward the corner

  if (fs.existsSync(LOGO)) {
    const png = await pdf.embedPng(fs.readFileSync(LOGO));
    const lw = 114;                         // 24px wordmark at page scale
    const lh = (png.height / png.width) * lw;
    // The PNG carries transparent padding (18/14px at 96px) — offset so the
    // glyphs, not the padding, align to the content edge.
    const logoX = LEFT - SHIFT - lw * (18 / 358);
    const logoMid = ROW_MID + RISE;
    page.drawImage(png, { x: logoX, y: logoMid - lh / 2, width: lw, height: lh });

    // Brand tagline, tucked under the wordmark and aligned to its glyph edge.
    const tag = 'Your turning point in the AI era.';
    draw(tag, {
      x: LEFT - SHIFT + 2,
      y: logoMid - lh / 2 - 13,
      font: serifItalic,
      size: 9,
      color: PURPLE,
    });
  }

  const R = 43.5;                           // 66px seal
  const cx = RIGHT + SHIFT - R;
  const cy = ROW_MID + RISE;
  // linear-gradient(155deg, #F6C457, #BA7517) + top highlight, approximated by
  // concentric circles drifting toward the light source.
  page.drawCircle({ x: cx, y: cy, size: R, color: GOLD });
  const STEPS = 30;
  for (let i = 1; i <= STEPS; i += 1) {
    const t = i / STEPS;
    page.drawCircle({
      x: cx - R * 0.3 * t,
      y: cy + R * 0.3 * t,
      size: R * (1 - 0.62 * t),
      color: mix(GOLD, GOLD_LIGHT, t),
      opacity: 0.5,
    });
  }
  page.drawCircle({ x: cx, y: cy, size: R, borderColor: WHITE, borderWidth: 2.8, borderOpacity: 0.9 });

  // ★ — five-pointed star
  const star = (sx, sy, outer, inner) => {
    const pts = [];
    for (let i = 0; i < 10; i += 1) {
      const rad = i % 2 === 0 ? outer : inner;
      const ang = -Math.PI / 2 + (i * Math.PI) / 5;
      // Points are built in SVG space (y grows downward) so the star sits
      // point-up once drawSvgPath flips the axis.
      pts.push(`${sx + rad * Math.cos(ang)},${H - sy + rad * Math.sin(ang)}`);
    }
    return `M ${pts.join(' L ')} Z`;
  };
  page.drawSvgPath(star(cx, cy + 13, 10.5, 4.4), { x: 0, y: H, color: WHITE, borderWidth: 0 });

  for (const [i, line] of ['MENLER', 'VERIFIED'].entries()) {
    const size = 9.8;
    const w = measure(line, sansBold, size, 0.78);
    draw(line, { x: cx - w / 2, y: cy - 7 - i * 11.3, font: sansBold, size, color: WHITE, tracking: 0.78 });
  }

  /* ── Kicker: — CERTIFICATE OF PARTICIPATION — ───────────────────────────── */
  const kicker = 'CERTIFICATE OF PARTICIPATION';
  const kSize = 16.8;
  const kTrack = kSize * 0.22;
  const kW = measure(kicker, sansBold, kSize, kTrack);
  const kY = 372;
  draw(kicker, { x: (W - kW) / 2, y: kY, font: sansBold, size: kSize, color: GOLD_DARK, tracking: kTrack });
  for (const dir of [-1, 1]) {
    const end = W / 2 + dir * (kW / 2 + 14);
    page.drawLine({
      start: { x: end, y: kY + kSize * 0.35 },
      end: { x: end + dir * 30.9, y: kY + kSize * 0.35 },
      thickness: 1.2, color: GOLD, opacity: 0.55,
    });
  }

  /* ── Presented to · name · rule ─────────────────────────────────────────── */
  centre('This is proudly presented to', { y: 326, font: sansItalic, size: 16.8, color: MUTED });

  let nameSize = 47.7;
  while (serif.widthOfTextAtSize(name, nameSize) > RIGHT - LEFT && nameSize > 22) nameSize -= 0.5;
  centre(name, { y: 266, font: serif, size: nameSize, color: INK });

  // 190px rule, gradient transparent → gold → transparent
  const ruleW = 266.6;
  const SEGS = 70;
  for (let i = 0; i < SEGS; i += 1) {
    page.drawRectangle({
      x: W / 2 - ruleW / 2 + (i * ruleW) / SEGS, y: 244,
      width: ruleW / SEGS + 0.4, height: 1.1,
      color: GOLD, opacity: Math.sin((Math.PI * (i + 0.5)) / SEGS),
    });
  }

  /* ── For successfully completing · programme ────────────────────────────── */
  const line = 'for successfully completing the masterclass on';
  let lineSize = 18.9;
  while (sans.widthOfTextAtSize(line, lineSize) > RIGHT - LEFT && lineSize > 11) lineSize -= 0.5;
  centre(line, { y: 190, font: sans, size: lineSize, color: INK });

  let progSize = 22;
  while (sansBold.widthOfTextAtSize(programName, progSize) > RIGHT - LEFT && progSize > 11) progSize -= 0.5;
  centre(programName, { y: 158, font: sansBold, size: progSize, color: INK });

  /* ── Signatures ─────────────────────────────────────────────────────────── */
  // The name, its rule and the designation all share one centre axis, and the
  // block's outer edge sits flush to the margin — so both signatures read as
  // one solid unit instead of three independently-placed lines.
  const signature = (label, role, anchorX, align) => {
    if (!label) return;
    const nSize = 21.5;
    const rSize = 12.5;
    const nW = serif.widthOfTextAtSize(label, nSize);
    const rW = role ? sans.widthOfTextAtSize(role, rSize) : 0;
    const blockW = Math.max(nW, rW);
    const axis = align === 'left' ? anchorX + blockW / 2 : anchorX - blockW / 2;

    draw(label, { x: axis - nW / 2, y: 84, font: serif, size: nSize, color: INK });

    const ruleW = nW + 17;                  // rule hugs the name, centred on the axis
    page.drawLine({
      start: { x: axis - ruleW / 2, y: 76 }, end: { x: axis + ruleW / 2, y: 76 },
      thickness: 1, color: INK, opacity: 0.3,
    });

    if (role) draw(role, { x: axis - rW / 2, y: 60, font: sans, size: rSize, color: MUTED });
  };
  signature(mentorName, mentorRole, LEFT, 'left');
  signature(founderName, founderRole, RIGHT, 'right');

  const bytes = await pdf.save();
  return { buffer: Buffer.from(bytes), certId };
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The default heading and body used when the admin doesn't customise them.
// Exported so the admin panel can pre-fill the editable fields with the same
// copy (single source of truth).
export const DEFAULT_EMAIL_HEADING = 'Congratulations, {first_name}!';
export const DEFAULT_EMAIL_MESSAGE =
  "You've completed **{program}**. Your certificate of participation is attached to this email as a PDF.\n\n" +
  'Share it on LinkedIn, add it to your CV, and keep building.';

/** Fills {name} / {first_name} / {program} placeholders (single or double braces). */
function fillPlaceholders(tmpl, { name, first, programName }) {
  return String(tmpl)
    .replace(/\{\{?\s*(first_name|first)\s*\}?\}/gi, first)
    .replace(/\{\{?\s*(name|full_name)\s*\}?\}/gi, name)
    .replace(/\{\{?\s*(program_name|program)\s*\}?\}/gi, programName);
}

/**
 * Covering email for the certificate — same minimal banner/footer shell as the
 * transactional templates (menler-templates). `heading` and `message` are
 * optional overrides from the admin panel; both support {name}/{first_name}/
 * {program} placeholders, and `message` supports **bold** and blank-line
 * paragraph breaks.
 */
export function buildCertificateEmail({ name, programName, certId, heading, message }) {
  const first = String(name || '').trim().split(/\s+/)[0] || 'there';
  const ctx = { name: String(name || '').trim() || 'there', first, programName };

  const headingText = fillPlaceholders(heading || DEFAULT_EMAIL_HEADING, ctx).trim();
  const messageText = fillPlaceholders(message || DEFAULT_EMAIL_MESSAGE, ctx).trim();

  // Split the message into paragraphs on blank lines; keep single newlines as breaks.
  const paras = messageText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const plainMessage = messageText.replace(/\*\*(.+?)\*\*/g, '$1');

  const text = `${headingText}

${plainMessage}

Explore our programs: https://menler.in/generalist

Looking forward, talk soon!

Menler
Your turning point in the AI era

menler.in`;

  const social = [
    ['https://menler.in', 'Website', 'internet'],
    ['https://www.linkedin.com/company/menler', 'LinkedIn', 'linkedin'],
    ['https://www.instagram.com/menler.in/', 'Instagram', 'instagram-new'],
    ['https://www.facebook.com/people/Menler/61589670181082/', 'Facebook', 'facebook-new'],
  ].map(([href, title, icon]) => `<td style="padding:0 0 0 8px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                    <td width="36" height="36" align="center" valign="middle" style="width:36px; height:36px; border:1px solid #453D80; border-radius:11px;">
                      <a href="${href}" title="${title}" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/100/B9B3E8/${icon}.png" width="17" height="17" alt="${title}" style="width:17px; height:17px; display:inline-block; vertical-align:middle; border:0;" /></a>
                    </td>
                  </tr></table>
                </td>`).join('\n                ');

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <title>${esc(headingText)}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
  <style>
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    img{ border:0; line-height:100%; outline:none; text-decoration:none; display:block; }
    table{ border-collapse:collapse !important; }
    a{ color:#534AB7; }
    @media only screen and (max-width:620px){
      .container{ width:100% !important; }
      .px{ padding-left:24px !important; padding-right:24px !important; }
      .stack{ display:block !important; width:100% !important; max-width:100% !important; text-align:left !important; }
      .stack-r{ display:block !important; width:100% !important; max-width:100% !important; text-align:left !important; padding-top:26px !important; }
      .gap{ display:none !important; }
      .fluid{ width:100% !important; height:auto !important; }
      .al{ float:none !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#FFFFFF; font-family:'DM Sans',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">Your certificate is ready — download it or find it attached.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;">
    <tr><td align="center" style="padding:0;">
      <table role="presentation" class="container" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px; max-width:620px; background:#ffffff;">

        <!-- ── BANNER — unlinked on purpose so Gmail offers its own image preview ── -->
        <tr><td style="font-size:0; line-height:0;">
          <img src="https://menler.in/email-banner.jpg" width="620" alt="Menler — Your turning point in the AI era."
               class="fluid" style="width:100%; max-width:620px; height:auto; display:block; border:0;" />
        </td></tr>

        <!-- ── BODY ── -->
        <tr><td class="px" style="padding:40px 40px 0;">
          <p style="margin:0 0 22px; font-size:22px; line-height:1.4; color:#1F2430; font-weight:700;">${esc(headingText)}</p>
          ${paras.map((p) => `<p style="margin:0 0 22px; font-size:16px; line-height:1.8; color:#1F2430;">${esc(p).replace(/\n/g, '<br />').replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;">$1</strong>')}</p>`).join('\n          ')}
        </td></tr>

        <!-- ── CTA ── -->
        <tr><td align="center" class="px" style="padding:8px 40px 6px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
            <td bgcolor="#211B4C" style="border-radius:6px;">
              <a href="https://menler.in/generalist" style="display:inline-block; padding:15px 42px; font-family:'DM Sans',Arial,sans-serif; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:6px;">Explore Programs</a>
            </td>
          </tr></table>
        </td></tr>

        <!-- ── SIGN-OFF ── -->
        <tr><td class="px" style="padding:32px 40px 44px;">
          <p style="margin:0; font-size:16px; line-height:1.8; color:#1F2430;">
            While you're here, explore what's next at
            <a href="https://menler.in/generalist" style="color:#534AB7; text-decoration:underline;">menler.in</a>.
          </p>
          <p style="margin:24px 0 0; font-size:16px; line-height:1.8; color:#1F2430;">Looking forward, talk soon!</p>
          <p style="margin:24px 0 0; font-size:16px; line-height:1.8; color:#1F2430;">
            <strong style="font-weight:700;">Menler</strong><br />
            Your turning point in the AI era
          </p>
        </td></tr>

        <!-- ── FOOTER ── -->
        <tr><td bgcolor="#211B4C" class="px" style="background-color:#211B4C; padding:34px 40px 30px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>

            <td class="stack" width="56%" valign="top" style="width:56%;">
              <img src="https://menler.in/email-logo.png" width="128" alt="menler" style="width:128px; height:auto; display:block;" />
              <div style="font-family:'DM Serif Display',Georgia,serif; font-style:italic; font-size:15px; color:#8E82F5; margin-top:14px; line-height:1.4;">
                Your turning point in the AI Era.
              </div>
              <div style="font-size:13.5px; color:#B9B3E8; margin-top:11px; line-height:1.6; max-width:215px;">
                AI learning, built for the people doing the work.
              </div>
            </td>

            <td class="gap" width="4%" style="width:4%; font-size:0;">&nbsp;</td>

            <td class="stack-r" width="40%" valign="top" align="right" style="width:40%;">
              <div style="font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#8F87C9; padding-bottom:14px;">Follow us</div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" class="al"><tr>
                ${social}
              </tr></table>
            </td>

          </tr></table>
        </td></tr>

        <!-- ── ACCENT RULE ── -->
        <tr><td height="3" bgcolor="#534AB7" style="height:3px; background-color:#534AB7; font-size:0; line-height:0;">&nbsp;</td></tr>

        <!-- ── PERMISSION BAR ── -->
        <tr><td bgcolor="#1B1640" align="center" class="px" style="background-color:#1B1640; padding:22px 40px 24px;">
          <div style="font-size:13px; line-height:1.6; color:#8F87C9;">
            You're receiving this because you took part in a Menler program at
            <a href="https://menler.in" style="color:#8E82F5; text-decoration:underline;">menler.in</a>.
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { text, html };
}
