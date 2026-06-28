import Seo from '../components/common/Seo';
import Footer from '../components/layout/Footer';
import AmplifeedOtpForm from '../components/common/AmplifeedOtpForm';

// Standalone verified-lead capture page (Amplifeed OTP form). Linkable from ads,
// emails, socials, etc. The form verifies the email via OTP and pushes the lead
// straight into the Amplifeed CRM.
export default function Join() {
  return (
    <>
      <Seo
        title="Join Menler — Get Started"
        description="Connect with Menler — verify your email and our team will reach out about the right AI learning path for you."
        path="/join"
        noindex
      />
      <section className="section" style={{ paddingTop: 56, paddingBottom: 48 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Get started</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Join <em>Menler.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 28px' }}>
          Verify your email and we'll reach out with the right AI learning path for you.
        </p>
        <AmplifeedOtpForm />
      </section>
      <Footer />
    </>
  );
}
