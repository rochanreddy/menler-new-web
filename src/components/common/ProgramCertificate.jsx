// "Your certificate" section on the program pages (Kickstarter, Generalist,
// AI FDE). The sample is the LMS certificate itself — same dark sheet, partner
// row, QR + id block and signatures as menler-lms CertificateModal.jsx — so
// what a visitor sees here is what they are handed at the end of the cohort.
//
// The sample code ends in 0000 on purpose: the LMS counter starts at 0001, so
// no issued certificate can carry it, and scanning the QR gets an honest "no
// certificate with that ID" rather than a real person's record.
// accent / em tint the heading to the page's own colours; the sheet itself
// never changes colour.
//
// The whole section has to fit in one screen, phone included. So the sheet is
// laid out once at a fixed 720px and scaled down as a single picture when its
// column is narrower — a thumbnail of the real certificate — rather than
// re-flowed into a long card that pushes the points off the screen.
import { useLayoutEffect, useRef, useState } from 'react';

const SHEET_W = 720;

function useFitScale() {
  const outer = useRef(null);
  const inner = useRef(null);
  const [fit, setFit] = useState(null); // { scale, height } once narrower than SHEET_W
  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return undefined;
    const measure = () => {
      const scale = Math.min(1, o.clientWidth / SHEET_W);
      setFit({ scale, height: Math.ceil(i.offsetHeight * scale) });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);
  return { outer, inner, fit };
}

const PARTNERS = [
  { src: '/certificate/anthropic.png', alt: 'Anthropic', h: 10 },
  { src: '/certificate/msme.png', alt: 'Ministry of MSME, Government of India', h: 26 },
  { src: '/certificate/sarvam.png', alt: 'Sarvam AI', h: 24 },
  { src: '/certificate/startup-india.png', alt: 'Startup India', h: 13 },
];

const SIGNATORIES = [
  { name: 'Nitin K Sethi', role: 'Ex-McKinsey, MIT & UT Mentor' },
  { name: 'Sachin Roy', role: 'Founder, Menler' },
];

const DEFAULT_POINTS = [
  ['Verifiable', 'Unique ID and QR code.'],
  ['LinkedIn-ready', 'Add it to your profile in one click.'],
  ['Earned, not attended', 'Issued only after your projects ship.'],
];

export default function ProgramCertificate({
  program,
  certId,
  qr,
  issued = 'November, 2026',
  title = <>Proof you can <em>show.</em></>,
  sub,
  points = DEFAULT_POINTS,
  accent,
  em,
  background = '#ffffff',
  style,
}) {
  const { outer, inner, fit } = useFitScale();
  return (
    <section className="section prog-cert" style={{ background, '--pc-accent': accent, '--pc-em': em || accent, ...style }}>
      <p className="section-label prog-cert-label">Certification</p>
      <h2 className="section-h2 prog-cert-h2">{title}</h2>
      {sub && <p className="section-sub prog-cert-sub">{sub}</p>}

      <div className="prog-cert-grid">
        <div ref={outer} className="pcert-fit" style={fit ? { height: fit.height } : undefined}>
          <div ref={inner} className="pcert" role="img" aria-label={`Sample Menler certificate for the ${program}`} style={fit ? { transform: `scale(${fit.scale})` } : undefined}>
            <div className="pcert-inner">
              <header className="pcert-head">
                <div>
                  <div className="pcert-brand">
                    <span className="pcert-brand-ruled">menle</span>r
                    <span className="pcert-brand-dot" />
                  </div>
                  <div className="pcert-tagline">Your turning point in the AI era.</div>
                </div>
                <div className="pcert-partners">
                  {PARTNERS.map((p) => <img key={p.alt} src={p.src} alt={p.alt} style={{ height: p.h }} loading="lazy" decoding="async" />)}
                </div>
              </header>

              <div className="pcert-rule" />

              <div className="pcert-kicker">Certificate of Fellowship</div>
              <p className="pcert-lede">This certificate is proudly presented to</p>
              <div className="pcert-name">Your Name</div>

              <p className="pcert-body">
                for successfully completing the <strong>{program}</strong>, demonstrating dedication to learning,
                hands-on application, and active participation throughout the program.
              </p>
              <p className="pcert-body">
                We recognize their commitment to becoming an AI-Native Professional and wish them
                continued success in their journey.
              </p>

              <footer className="pcert-foot">
                <div className="pcert-idblock">
                  <img className="pcert-qr" src={qr} alt="" width="58" height="58" loading="lazy" decoding="async" />
                  <div className="pcert-idtext">
                    <div className="pcert-id">{certId}</div>
                    <div className="pcert-issued">Issued on {issued}</div>
                  </div>
                </div>
                <div className="pcert-signs">
                  {SIGNATORIES.map((s) => (
                    <div className="pcert-sign" key={s.name}>
                      <div className="pcert-sign-name">{s.name}</div>
                      <div className="pcert-sign-role">{s.role}</div>
                    </div>
                  ))}
                </div>
              </footer>
            </div>
          </div>
        </div>

        <ul className="prog-cert-points">
          {points.map(([h, p]) => (
            <li key={h}>
              <span className="prog-cert-tick" aria-hidden="true">✓</span>
              <span><b>{h}</b>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
