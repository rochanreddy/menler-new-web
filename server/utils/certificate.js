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
  const ROW_MID = 484;
  const EDGE_INSET = 10;                    // seal pulled in a touch from the frame

  if (fs.existsSync(LOGO)) {
    const png = await pdf.embedPng(fs.readFileSync(LOGO));
    const lw = 114;                         // 24px wordmark at page scale
    const lh = (png.height / png.width) * lw;
    // The PNG carries transparent padding (18/14px at 96px) — offset so the
    // glyphs, not the padding, align to the content edge.
    const logoX = LEFT - 4 - lw * (18 / 358);
    const logoMid = ROW_MID + 14;           // sits diagonally up-left of centre
    page.drawImage(png, { x: logoX, y: logoMid - lh / 2, width: lw, height: lh });

    // Brand tagline, tucked under the wordmark and aligned to its glyph edge.
    const tag = 'Your turning point in the AI era.';
    draw(tag, {
      x: LEFT - 2,
      y: logoMid - lh / 2 - 13,
      font: serifItalic,
      size: 11.5,
      color: PURPLE,
    });
  }

  const R = 43.5;                           // 66px seal
  const cx = RIGHT - EDGE_INSET - R;
  const cy = ROW_MID;
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

    if (role) draw(role, { x: axis - rW / 2, y: 50, font: sans, size: rSize, color: MUTED });
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

Looking forward, talk soon!
Menler
Your turning point in the AI era

menler.in · support@menler.in`;

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your ${esc(programName)} certificate</title>
<style>
  img{ border:0; outline:none; text-decoration:none; display:block; }
  table{ border-collapse:collapse !important; }
  @media only screen and (max-width:600px){
    .container{ width:100% !important; }
    .px{ padding-left:24px !important; padding-right:24px !important; }
    .btn a{ display:block !important; text-align:center !important; }
  }
</style></head>
<body style="margin:0; padding:0; background:#F4F5F7; font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">Your certificate of participation is attached.&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F5F7;">
    <tr><td align="center" style="padding:32px 12px;">
      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">

        <tr><td bgcolor="#2A2260" align="center" style="background-color:#2A2260; padding:30px 20px;">
          <img src="https://menler.in/email-logo.png" width="132" alt="Menler" style="width:132px; height:auto; margin:0 auto;" />
        </td></tr>

        <tr><td class="px" style="padding:38px 40px 26px;">
          <h1 style="margin:0 0 22px; font-size:23px; line-height:1.35; color:#14142B; font-weight:700;">${esc(headingText)}</h1>
          ${paras.map((p) => `<p style="margin:0 0 16px; font-size:16px; line-height:1.65; color:#41465A;">${esc(p).replace(/\n/g, '<br />').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('\n          ')}
        </td></tr>

        <tr><td class="px" style="padding:0 40px;">
          <table role="presentation" class="btn" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td bgcolor="#534AB7" align="center" style="border-radius:8px;">
              <a href="https://menler.in/generalist" style="display:inline-block; padding:15px 30px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:8px;">Explore Programs</a>
            </td>
          </tr></table>
        </td></tr>

        <tr><td class="px" style="padding:30px 40px 38px;">
          <p style="margin:0 0 18px; font-size:16px; line-height:1.65; color:#41465A;">Looking forward, talk soon!</p>
          <p style="margin:0; font-size:16px; line-height:1.5; color:#14142B; font-weight:700;">Menler</p>
          <p style="margin:2px 0 0; font-size:14px; line-height:1.5; color:#7A7F92; font-style:italic;">Your turning point in the AI era</p>
        </td></tr>

        <tr><td bgcolor="#F7F7FA" class="px" style="background-color:#F7F7FA; padding:24px 40px; text-align:center; border-top:1px solid #ECECF2;">
          <div style="font-size:13px; line-height:1.9;">
            <a href="https://menler.in" style="color:#6B7185; text-decoration:none;">menler.in</a>
            <span style="color:#C9CCD8;">&nbsp;·&nbsp;</span>
            <a href="mailto:support@menler.in" style="color:#6B7185; text-decoration:none;">Support</a>
          </div>
          <div style="font-size:11.5px; color:#9DA2B3; line-height:1.7; margin-top:10px;">
            Menler Learning Systems Private Limited · Bengaluru, India
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;

  return { text, html };
}
