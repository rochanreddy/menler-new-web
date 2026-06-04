import { useEffect } from 'react';
import LeadForm from '../forms/LeadForm';

// Apply-to-the-Fellowship popup: left image + right lead form.
// Same look as the Home hero popup, reusable across pages.
export default function ApplyModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <div className="apply-modal" role="dialog" aria-modal="true" aria-label="Apply to the Fellowship" onClick={(e) => e.stopPropagation()}>
        <button className="apply-modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="apply-modal-media" aria-hidden="true" />
        <div className="apply-modal-form">
          <LeadForm />
        </div>
      </div>
    </div>
  );
}
