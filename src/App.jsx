import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import Navbar from './components/layout/Navbar';
import PageLoader from './components/common/PageLoader';
import { ToastProvider } from './components/common/Toast';
import { ApplyProvider } from './components/common/ApplyContext';
import { supabase } from './lib/supabase';

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
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Register = lazy(() => import('./pages/Register'));
const Admin = lazy(() => import('./pages/Admin'));
const Policy = lazy(() => import('./pages/Policy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Jump to top instantly on navigation. Use Lenis if it's running so its
    // internal scroll state stays in sync; otherwise fall back to the native API.
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Move focus to main on navigation so keyboard / screen-reader users
    // land at the start of the new page's content.
    const main = document.getElementById('main');
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

export default function App() {
  const navigate = useNavigate();

  // ── Site-wide momentum smooth scrolling (Lenis) ──
  // Honours prefers-reduced-motion (skips entirely → native scroll). The
  // instance is exposed on window.__lenis so navigation + in-page scrolls
  // (e.g. scroll-into-view on the Kickstarter/Generalist curriculums) can drive it.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
      // Gentle ease-out for a longer, softer glide.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
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

  // Handle email confirmation link redirect → send to /profile
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && window.location.hash.includes('access_token')) {
        navigate('/profile');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

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
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/policy/:slug" element={<Policy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      </ApplyProvider>
    </ToastProvider>
  );
}
