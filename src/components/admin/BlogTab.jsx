import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi } from '../../lib/adminApi';

/* The writing desk.
 *
 * Built for someone who writes for a living and has never seen this admin
 * before: one column of content in the order you'd actually write it, a live
 * preview of the real article, and no jargon. Everything saves itself — the
 * single fastest way to lose a writer's trust is to lose their draft. */

const BLOCK_KINDS = [
  { type: 'p', label: 'Paragraph' },
  { type: 'h2', label: 'Heading' },
  { type: 'h3', label: 'Sub-heading' },
  { type: 'quote', label: 'Quote' },
  { type: 'ul', label: 'Bullet list' },
];

const slugify = (s) => String(s || '').toLowerCase().replace(/['’"]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);

const wordsIn = (body = []) => body.reduce((n, b) => {
  const t = b.type === 'ul' ? (b.items || []).join(' ') : (b.text || '');
  return n + t.trim().split(/\s+/).filter(Boolean).length;
}, 0);

const fmtDate = (d) => (d
  ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—');

/** A textarea that grows with its content — writers shouldn't fight scrollbars. */
function Grow({ value, onChange, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return <textarea ref={ref} value={value} onChange={onChange} rows={1} {...rest} />;
}

/* ── One body block ──────────────────────────────────────────────────────── */

function Block({ block, i, total, onChange, onRemove, onMove, onSplit }) {
  const isList = block.type === 'ul';
  return (
    <div className={`bl bl--${block.type}`}>
      <div className="bl-side">
        <select
          className="bl-kind"
          value={block.type}
          onChange={(e) => {
            const type = e.target.value;
            // Carry the words across when swapping between text and list.
            if (type === 'ul' && !isList) onChange({ type, items: block.text ? [block.text] : [''] });
            else if (type !== 'ul' && isList) onChange({ type, text: (block.items || []).join(' ') });
            else onChange({ ...block, type });
          }}
        >
          {BLOCK_KINDS.map((k) => <option key={k.type} value={k.type}>{k.label}</option>)}
        </select>
        <div className="bl-tools">
          <button type="button" title="Move up" disabled={i === 0} onClick={() => onMove(-1)}>↑</button>
          <button type="button" title="Move down" disabled={i === total - 1} onClick={() => onMove(1)}>↓</button>
          <button type="button" title="Delete this block" className="bl-del" onClick={onRemove}>✕</button>
        </div>
      </div>

      <div className="bl-main">
        {isList ? (
          <>
            {(block.items || ['']).map((item, j) => (
              <div className="bl-li" key={j}>
                <span aria-hidden="true">•</span>
                <Grow
                  value={item}
                  placeholder="List item"
                  onChange={(e) => {
                    const items = [...(block.items || [])];
                    items[j] = e.target.value;
                    onChange({ ...block, items });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const items = [...(block.items || [])];
                      items.splice(j + 1, 0, '');
                      onChange({ ...block, items });
                    }
                    if (e.key === 'Backspace' && !item && (block.items || []).length > 1) {
                      e.preventDefault();
                      onChange({ ...block, items: (block.items || []).filter((_, k) => k !== j) });
                    }
                  }}
                />
              </div>
            ))}
            <button type="button" className="bl-additem"
              onClick={() => onChange({ ...block, items: [...(block.items || []), ''] })}>
              + item
            </button>
          </>
        ) : (
          <Grow
            value={block.text || ''}
            placeholder={
              block.type === 'h2' ? 'Section heading'
                : block.type === 'h3' ? 'Sub-heading'
                  : block.type === 'quote' ? 'A line worth pulling out'
                    : 'Write here… press Enter for a new paragraph'
            }
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            onKeyDown={(e) => {
              // Enter starts a new paragraph, as it would in any writing tool.
              // Shift+Enter stays inside the block for a manual line break.
              if (e.key === 'Enter' && !e.shiftKey && block.type !== 'quote') {
                e.preventDefault();
                onSplit();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── Live preview ────────────────────────────────────────────────────────── */

function Preview({ post }) {
  return (
    <article className="bpv">
      {post.tag && <span className="bpv-tag">{post.tag}</span>}
      <h1>{post.title || 'Untitled post'}</h1>
      {post.excerpt && <p className="bpv-excerpt">{post.excerpt}</p>}
      <div className="bpv-meta">
        {post.author?.name || 'The Menler Team'} · {fmtDate(post.datePublished || Date.now())} ·{' '}
        {Math.max(1, Math.ceil(wordsIn(post.body) / 200))} min read
      </div>
      <div className="bpv-body">
        {(post.body || []).map((b, i) => {
          if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
          if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>;
          if (b.type === 'quote') return <blockquote key={i}>{b.text}</blockquote>;
          if (b.type === 'ul') {
            return <ul key={i}>{(b.items || []).filter(Boolean).map((it, j) => <li key={j}>{it}</li>)}</ul>;
          }
          return <p key={i}>{b.text}</p>;
        })}
        {!(post.body || []).length && <p className="bpv-empty">Your article will appear here as you write.</p>}
      </div>
    </article>
  );
}

/* ── Editor ──────────────────────────────────────────────────────────────── */

const EDITABLE = ['title', 'excerpt', 'tag', 'body', 'cover', 'thumb', 'featured', 'author', 'seoTitle', 'seoDescription', 'slug'];
const snapshot = (p) => JSON.stringify(EDITABLE.map((k) => p?.[k]));

function Editor({ id, onBack, onChanged }) {
  const [p, setP] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [save, setSave] = useState('');          // '' | 'saving' | 'saved'
  const [showPreview, setShowPreview] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const savedRef = useRef('');

  const load = useCallback(() => {
    adminApi.post(id).then(({ post }) => { savedRef.current = snapshot(post); setP(post); })
      .catch((e) => setErr(e.message));
  }, [id]);
  useEffect(load, [load]);

  // Autosave. A writer should never have to think about a Save button.
  useEffect(() => {
    if (!p) return undefined;
    const now = snapshot(p);
    if (now === savedRef.current) return undefined;
    setSave('saving');
    const t = setTimeout(async () => {
      try {
        await adminApi.updatePost(id, Object.fromEntries(EDITABLE.map((k) => [k, p[k]])));
        savedRef.current = now;
        setSave('saved');
        onChanged?.();
        setTimeout(() => setSave((s) => (s === 'saved' ? '' : s)), 1600);
      } catch (e) { setSave(''); setErr(e.message); }
    }, 900);
    return () => clearTimeout(t);
  }, [p, id, onChanged]);

  // Warn before closing the tab while an edit is still in flight.
  useEffect(() => {
    const onLeave = (e) => { if (save === 'saving') { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [save]);

  if (err && !p) return <p className="admin-empty" style={{ color: '#c0392b' }}>{err}</p>;
  if (!p) return <p className="admin-empty">Loading…</p>;

  const set = (k, v) => setP({ ...p, [k]: v });
  const setBody = (body) => setP({ ...p, body });
  const live = p.status === 'published';

  const setBlock = (i, next) => setBody(p.body.map((b, j) => (i === j ? next : b)));
  const addBlock = (type = 'p', at = p.body.length) => {
    const body = [...p.body];
    body.splice(at, 0, type === 'ul' ? { type, items: [''] } : { type, text: '' });
    setBody(body);
  };
  const moveBlock = (i, dir) => {
    const body = [...p.body];
    const j = i + dir;
    if (j < 0 || j >= body.length) return;
    [body[i], body[j]] = [body[j], body[i]];
    setBody(body);
  };

  const act = async (fn, ok) => {
    setBusy(true); setErr(''); setMsg('');
    try { await fn(); setMsg(ok); load(); onChanged?.(); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const words = wordsIn(p.body);

  return (
    <div className="bed">
      <div className="bed-bar">
        <button className="admin-btn" onClick={onBack}>← All posts</button>
        <span className={`admin-badge ${live ? 'admin-badge--ok' : ''}`}>{live ? 'Live' : 'Draft'}</span>
        <span className="bed-save">{save === 'saving' ? 'Saving…' : save === 'saved' ? '✓ Saved' : ''}</span>
        <span className="bed-count">{words.toLocaleString('en-IN')} words · {Math.max(1, Math.ceil(words / 200))} min read</span>
        <div className="bed-bar-right">
          <button className="admin-btn" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
          {live && (
            <a className="admin-btn" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">View live ↗</a>
          )}
          {live
            ? <button className="admin-btn" disabled={busy}
              onClick={() => act(() => adminApi.setPostStatus(id, 'draft'), 'Unpublished — it’s a draft again.')}>
              Unpublish
            </button>
            : <button className="admin-btn admin-btn--primary bed-publish" disabled={busy}
              onClick={() => act(() => adminApi.setPostStatus(id, 'published'), 'Published — it’s live on the blog.')}>
              Publish
            </button>}
        </div>
      </div>

      {err && <div className="admin-note admin-note--bad">{err}</div>}
      {msg && <div className="admin-note admin-note--ok">{msg}</div>}

      <div className={`bed-grid ${showPreview ? '' : 'bed-grid--solo'}`}>
        <div className="bed-write">
          <input
            className="bed-title"
            placeholder="Your headline"
            value={p.title === 'Untitled post' ? '' : p.title}
            onChange={(e) => {
              const title = e.target.value;
              // The slug follows the headline until someone edits it by hand.
              setP({ ...p, title, ...(slugTouched || live ? {} : { slug: slugify(title) }) });
            }}
          />

          <Grow
            className="bed-excerpt"
            placeholder="One or two sentences. This shows on the blog card and in Google results."
            value={p.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
          />

          <div className="bed-row">
            <label className="admin-field"><span>Category</span>
              <input className="admin-search" list="blog-tags" placeholder="e.g. AI in Education"
                value={p.tag} onChange={(e) => set('tag', e.target.value)} />
              <datalist id="blog-tags">
                <option value="AI in Education" />
                <option value="LMS Guides" />
                <option value="AI Careers" />
                <option value="Build Logs" />
              </datalist>
            </label>
            <label className="admin-field"><span>Author</span>
              <input className="admin-search" placeholder="The Menler Team"
                value={p.author?.name || ''}
                onChange={(e) => set('author', {
                  ...p.author,
                  name: e.target.value,
                  initials: (e.target.value.trim()[0] || 'M').toUpperCase(),
                  type: e.target.value.trim().toLowerCase().includes('team') ? 'Organization' : 'Person',
                })} />
            </label>
          </div>

          <div className="bed-blocks">
            {p.body.map((b, i) => (
              <Block
                key={i}
                block={b}
                i={i}
                total={p.body.length}
                onChange={(next) => setBlock(i, next)}
                onRemove={() => setBody(p.body.filter((_, j) => j !== i))}
                onMove={(dir) => moveBlock(i, dir)}
                onSplit={() => addBlock('p', i + 1)}
              />
            ))}

            {!p.body.length && (
              <button type="button" className="bed-start" onClick={() => addBlock('p')}>
                Start writing
              </button>
            )}
          </div>

          <div className="bed-add">
            <span>Add</span>
            {BLOCK_KINDS.map((k) => (
              <button type="button" key={k.type} onClick={() => addBlock(k.type)}>{k.label}</button>
            ))}
          </div>

          <details className="bed-more">
            <summary>Cover image, link and SEO</summary>
            <div className="bed-more-in">
              <label className="admin-field"><span>Cover image URL <span className="admin-muted">— optional</span></span>
                <input className="admin-search" placeholder="https://… or /images/post.jpg"
                  value={p.cover} onChange={(e) => set('cover', e.target.value)} />
                {p.cover
                  ? <img className="bed-cover" src={p.cover} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  : <em className="admin-field-hint">Leave blank and a branded graphic is used instead.</em>}
              </label>

              <label className="admin-field"><span>Web address</span>
                <div className="bed-slug">
                  <span>menler.in/blog/</span>
                  <input className="admin-search" value={p.slug}
                    onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} />
                </div>
                {live && <em className="admin-field-hint">This post is live — changing the address breaks any existing links to it.</em>}
              </label>

              <label className="admin-field"><span>Google title <span className="admin-muted">— defaults to the headline</span></span>
                <input className="admin-search" value={p.seoTitle} placeholder={p.title}
                  onChange={(e) => set('seoTitle', e.target.value)} />
              </label>
              <label className="admin-field"><span>Google description <span className="admin-muted">— defaults to the excerpt</span></span>
                <Grow className="admin-search" value={p.seoDescription} placeholder={p.excerpt}
                  onChange={(e) => set('seoDescription', e.target.value)} />
              </label>

              <label className="bed-check">
                <input type="checkbox" checked={Boolean(p.featured)}
                  onChange={(e) => set('featured', e.target.checked)} />
                <span>Feature this at the top of the blog <em>— only one post can be featured</em></span>
              </label>
            </div>
          </details>
        </div>

        {showPreview && (
          <div className="bed-preview">
            <div className="bed-preview-head">Preview</div>
            <div className="bed-preview-scroll"><Preview post={p} /></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── List ────────────────────────────────────────────────────────────────── */

export default function BlogTab() {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.posts({ status, search });
      setRows(d.rows || []);
      setCounts(d.counts || {});
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }, [status, search]);
  useEffect(() => { load(); }, [load]);

  if (open) return <Editor id={open} onBack={() => { setOpen(null); load(); }} onChanged={load} />;

  const create = async () => {
    try {
      const { post } = await adminApi.createPost({ title: '' });
      setOpen(post._id);
    } catch (e) { setErr(e.message); }
  };

  const remove = async (e, r) => {
    e.stopPropagation();
    if (!window.confirm(`Delete “${r.title}”? This can’t be undone.`)) return;
    try { await adminApi.deletePost(r._id); load(); }
    catch (e2) { window.alert(e2.message); }
  };

  const TABS = [['', 'All', counts.all], ['published', 'Live', counts.published], ['draft', 'Drafts', counts.draft]];

  return (
    <div>
      <div className="admin-toolbar">
        <input className="admin-search" type="search" placeholder="Search posts…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="bl-tabs">
          {TABS.map(([k, label, n]) => (
            <button key={k} className={`bl-tab ${status === k ? 'is-on' : ''}`} onClick={() => setStatus(k)}>
              {label} {n !== undefined && <em>{n}</em>}
            </button>
          ))}
        </div>
        <button className="admin-btn admin-btn--primary" onClick={create}>+ Write a post</button>
      </div>

      {err && <div className="admin-note admin-note--bad">{err}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Status</th><th>Published</th><th>Last edited</th><th /></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="admin-empty">Loading…</td></tr>}
            {!loading && !rows.length && (
              <tr><td colSpan={6} className="admin-empty">
                <b>No posts here yet</b>
                Click <b>Write a post</b> to start one — it saves as you type.
              </td></tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r._id} onClick={() => setOpen(r._id)}>
                <td>
                  <b>{r.title}</b>
                  {r.featured && <> <span className="admin-badge admin-badge--paid">Featured</span></>}
                  {r.excerpt && <><br /><span className="admin-muted bl-sub">{r.excerpt.slice(0, 90)}{r.excerpt.length > 90 ? '…' : ''}</span></>}
                </td>
                <td>{r.tag ? <span className="admin-pill">{r.tag}</span> : <span className="admin-muted">—</span>}</td>
                <td>
                  <span className={`admin-badge ${r.status === 'published' ? 'admin-badge--ok' : ''}`}>
                    {r.status === 'published' ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td className="admin-muted">{r.status === 'published' ? fmtDate(r.datePublished) : '—'}</td>
                <td className="admin-muted">{fmtDate(r.updatedAt)}</td>
                <td>
                  <button className="admin-del" title="Delete post" onClick={(e) => remove(e, r)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
