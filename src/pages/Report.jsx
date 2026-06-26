import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import { getRecommendation } from '../data/aptitudeQuestions';
import { buildRoadmap } from '../data/aptitudeClusters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Public, read-only view of a shared aptitude result (/report/:id).
export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const go = (p) => { navigate(p); window.scrollTo(0, 0); };
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/reports/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('not found'))))
      .then((d) => { if (!cancelled) { setReport(d); setStatus('ok'); } })
      .catch(() => { if (!cancelled) setStatus('notfound'); });
    return () => { cancelled = true; };
  }, [id]);

  if (status === 'loading') {
    return (
      <section className="apt-runner">
        <div className="runner-shell apt-report"><p className="runner-meta">Loading report…</p></div>
      </section>
    );
  }

  if (status === 'notfound') {
    return (
      <>
        <Seo title="Report not found | Menler" noindex />
        <section className="apt-runner">
          <div className="runner-shell apt-report">
            <p className="runner-meta">This report link is invalid or has expired.</p>
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => go('/aptitude')}>Take the AI Aptitude Test</button>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const { name, cluster, setIdx, score, maxScore, dims = [] } = report;
  const rec = getRecommendation(score);
  const roadmap = buildRoadmap(rec.program);

  return (
    <>
      <Seo
        title={`AI Aptitude Report — ${score}/${maxScore} | Menler`}
        description={`AI readiness result: ${score}/${maxScore} on the ${cluster} track. Recommended pathway: ${rec.program}.`}
        path={`/report/${id}`}
        noindex
      />
      <section className="apt-runner">
        <div className="runner-shell apt-report">
          <p className="runner-meta">
            {name ? `${name}'s report` : 'AI Aptitude report'} · {cluster}
            {Number.isFinite(setIdx) ? ` · Set ${setIdx + 1}` : ''}
          </p>
          <p className="runner-score">{score}<em>/{maxScore}</em></p>
          <p className="runner-band">{rec.band}</p>

          <div className="apt-dims">
            {dims.map((d) => (
              <div key={d.label} className="apt-dim">
                <div className="apt-dim-head"><span>{d.label}</span><span>{d.pct}%</span></div>
                <div className="apt-dim-bar"><div className="apt-dim-fill" style={{ width: `${d.pct}%`, background: rec.color }} /></div>
              </div>
            ))}
          </div>

          <div className="runner-rec" style={{ background: rec.bg }}>
            <p className="runner-rec-label">Recommended pathway</p>
            <p className="runner-rec-name" style={{ color: rec.color }}>{rec.program}</p>
            <p className="runner-rec-desc">{rec.rationale}</p>
            <button className="btn-primary" style={{ background: rec.color, marginTop: 16 }} onClick={() => go(rec.path)}>Explore {rec.program}</button>
          </div>

          <p className="apt-roadmap-label">Your 14-day learning roadmap</p>
          <div className="apt-roadmap">
            {roadmap.map((r) => (
              <div key={r.day} className="apt-roadmap-item">
                <span className="apt-roadmap-day">Day {r.day}</span>
                <span className="apt-roadmap-focus">{r.focus}</span>
              </div>
            ))}
          </div>

          <div className="apt-report-actions">
            <button className="runner-btn" onClick={() => go('/aptitude')}>Take the test yourself</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
