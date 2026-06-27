import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_ROOT = path.resolve(__dirname, '../../public');

export function isAllowedPdf(publicPath) {
  return typeof publicPath === 'string'
    && (publicPath.startsWith('/pdfs/') || publicPath.startsWith('/question_banks/'))
    && publicPath.toLowerCase().endsWith('.pdf')
    && !publicPath.includes('..');
}

/** Map a public URL path (/pdfs/foo.pdf) to an on-disk file under public/. */
export function resolvePdfPath(publicPath) {
  if (!isAllowedPdf(publicPath)) return null;
  const rel = publicPath.replace(/^\//, '');
  const abs = path.normalize(path.join(PUBLIC_ROOT, rel));
  if (!abs.startsWith(PUBLIC_ROOT)) return null;
  if (!fs.existsSync(abs)) return null;
  return abs;
}

/** Nodemailer attachment objects for one or more allowed PDF paths. */
export function pdfAttachments(publicPaths) {
  const unique = [...new Set(publicPaths)];
  const attachments = [];
  for (const publicPath of unique) {
    const abs = resolvePdfPath(publicPath);
    if (!abs) throw new Error(`PDF not found: ${publicPath}`);
    attachments.push({
      filename: path.basename(abs),
      path: abs,
      contentType: 'application/pdf',
    });
  }
  return attachments;
}
