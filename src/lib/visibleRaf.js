// Drives a per-frame callback with requestAnimationFrame, but ONLY while `el`
// is on-screen and the browser tab is visible. Off-screen marquees and the
// WebGL hero would otherwise keep rendering every frame forever, saturating the
// main thread / GPU and making the whole page feel laggy while you scroll.
//
// `frame(time)` gets the rAF timestamp and should do exactly one frame of work
// (it must NOT schedule the next frame itself). Returns a cleanup function.
export function visibleRaf(el, frame) {
  let raf = null;
  let inView = true;

  const tick = (t) => { frame(t); raf = requestAnimationFrame(tick); };
  const start = () => {
    if (raf == null && inView && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (raf != null) { cancelAnimationFrame(raf); raf = null; }
  };

  let io = null;
  if (el && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    }, { rootMargin: '150px' }); // resume just before it scrolls into view
    io.observe(el);
  }

  const onVisibility = () => { if (document.hidden) stop(); else start(); };
  document.addEventListener('visibilitychange', onVisibility);

  start();

  return () => {
    stop();
    if (io) io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
