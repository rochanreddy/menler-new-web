import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import Navbar from './components/layout/Navbar';
import PageLoader from './components/common/PageLoader';
import { ToastProvider } from './components/common/Toast';
import { ApplyProvider } from './components/common/ApplyContext';

const Home = lazy(() => import('./pages/Home'));
const Kickstarter = lazy(() => import('./pages/Kickstarter'));
const KickstarterLanding = lazy(() => import('./pages/KickstarterLanding'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Generalist = lazy(() => import('./pages/Generalist'));
const Engineering = lazy(() => import('./pages/Engineering'));
const Projects = lazy(() => import('./pages/Projects'));
const Outcomes = lazy(() => import('./pages/Outcomes'));
const Aptitude = lazy(() => import('./pages/Aptitude'));
const Report = lazy(() => import('./pages/Report'));
const Join = lazy(() => import('./pages/Join'));
const Resources = lazy(() => import('./pages/Resources'));
const Blog = lazy(() => import('./pages/Blog'));
const Community = lazy(() => import('./pages/Community'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));
const Policy = lazy(() => import('./pages/Policy'));
const PayTest = lazy(() => import('./pages/PayTest'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  const firstRun = useRef(true);
  useEffect(() => {
    // Jump to top instantly on navigation. Use Lenis if it's running so its
    // internal scroll state stays in sync; otherwise fall back to the native API.
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Move focus to main on navigation so keyboard / screen-reader users
    // land at the start of the new page's content.
    const main = document.getElementById('main');
    if (main) main.focus({ preventScroll: true });
    // Meta Pixel: fire a PageView on each client-side route change (the base
    // pixel in index.html only fires on the initial hard load). Skip the first
    // run so we don't double-count that initial PageView.
    if (firstRun.current) firstRun.current = false;
    else if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
  }, [pathname]);
  return null;
}

export default function App() {

  // ── Site-wide momentum smooth scrolling (Lenis) ──
  // Honours prefers-reduced-motion (skips entirely → native scroll). The
  // instance is exposed on window.__lenis so navigation + in-page scrolls
  // (e.g. scroll-into-view on the Kickstarter/Generalist curriculums) can drive it.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      // Shorter glide so scroll tracks the wheel closely instead of feeling
      // floaty/laggy; the ease-out keeps it smooth without the long tail.
      duration: 1.0,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
    });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <ToastProvider>
      <ApplyProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kickstarter" element={<Kickstarter />} />
            <Route path="/ai-kickstarter" element={<KickstarterLanding />} />
            <Route path="/campaign/:slug" element={<KickstarterLanding />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/generalist" element={<Generalist />} />
            <Route path="/engineering" element={<Engineering />} />
            <Route path="/projects/:slug" element={<Projects />} />
            <Route path="/outcomes" element={<Outcomes />} />
            <Route path="/aptitude" element={<Aptitude />} />
            <Route path="/report/:id" element={<Report />} />
            <Route path="/join" element={<Join />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/earnings-agent" element={<BlogArticle />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pay-test" element={<PayTest />} />
            <Route path="/policy/:slug" element={<Policy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      </ApplyProvider>
    </ToastProvider>
  );
}
