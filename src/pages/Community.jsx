import Seo from '../components/common/Seo';
import Footer from '../components/layout/Footer';
import MenlerCommunitySection from '../components/common/MenlerCommunitySection';

// Standalone, indexable community landing page (/community). Linkable from ads,
// emails and socials — the WhatsApp community join is the primary CTA.
const PERKS = [
  { t: 'Updates & announcements', d: 'Cohort news, new programs, workshops and events — you hear it here first.' },
  { t: 'Free resources', d: 'Prompt packs, playbooks, tool guides and question banks, shared regularly.' },
  { t: 'Peer support', d: 'Ask questions and learn alongside students, professionals and builders.' },
  { t: 'Mentor tips', d: 'Practical answers and pointers from people who use AI every day.' },
  { t: 'Events & workshops', d: 'Live sessions, AMAs and hands-on workshops to sharpen your AI skills.' },
  { t: 'Opportunities', d: 'Internships, projects and hiring updates from our partner network.' },
];

export default function Community() {
  return (
    <>
      <Seo
        title="Community | Menler"
        description="Join the Menler community — updates, free resources, peer support and mentor tips for your AI journey. Connect with us on WhatsApp."
        path="/community"
        keywords="Menler community, AI community India, AI learning community, WhatsApp AI group, Claude AI community"
      />
      <section className="section" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Community</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Join the <em>Menler community.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 28px' }}>
          A space for learners, professionals and builders growing their AI skills together —
          updates, resources and support across all our channels.
        </p>

        <div style={{ marginBottom: 40 }}>
          <MenlerCommunitySection className="menler-community--confirm" />
        </div>

        <div className="cluster-grid" style={{ maxWidth: 920, margin: '0 auto' }}>
          {PERKS.map((p) => (
            <div key={p.t} className="cluster-card">
              <p className="cluster-name">{p.t}</p>
              <p className="cluster-sets">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
