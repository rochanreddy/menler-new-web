import { useEffect } from 'react';

/**
 * Project detail popup — shared by the program pages' "What you'll build"
 * grids. Pass the clicked project (or null) and an onClose handler.
 */
export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [project, onClose]);

  if (!project) return null;
  const tag = project.track || project.tag;

  return (
    <div className="proj-modal-overlay" onClick={onClose}>
      <div className="proj-modal" role="dialog" aria-modal="true" aria-label={project.title} onClick={(e) => e.stopPropagation()}>
        <button className="apply-modal-close" onClick={onClose} aria-label="Close">×</button>
        {tag && <span className="proj-modal-track">{tag}</span>}
        <h3 className="proj-modal-title">{project.title}</h3>
        {project.meta && <p className="proj-modal-meta">{project.meta}</p>}
        <p className="proj-doc-lead">{project.desc}</p>
        {project.stack && <p className="proj-modal-stack">{project.stack}</p>}
      </div>
    </div>
  );
}
