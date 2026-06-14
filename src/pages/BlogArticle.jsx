import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';

export default function BlogArticle() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  return (
    <>
      <Seo
        title="How we shipped a Claude-native earnings agent in six days | Menler"
        description="Full prompt, full MCP map, full failure log — the Claude-native earnings agent build that shaped Menler's Finance track. Agentic AI workflows explained by operators."
        keywords="agentic AI explained, agentic AI workflows, Claude earnings agent, MCP, AI build log, AI blog India, enterprise AI use cases"
        path="/blog/earnings-agent"
        type="article"
      />
      <article className="article-shell">
        <div className="article-hero">
          <p className="article-cat">Build Logs · Featured</p>
          <h1 className="article-h1">How we shipped a Claude-native<br /><em>earnings agent in six days.</em></h1>
          <p className="article-dek">Full prompt, full MCP map, full failure log. The build that taught our Finance track everything we now teach in Week 8 of the Generalist Fellowship.</p>
          <div className="article-byline">
            <div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>RT</div>
            <div>
              <p style={{ fontWeight: 500, color: 'var(--ink)' }}>Rohit Tandon, FP&A Lead at a listed Indian co. · Generalist Cohort 01</p>
              <p style={{ color: 'var(--text-muted)' }}>12 min read · 3 days ago</p>
            </div>
          </div>
        </div>

        <div className="article-body">
          <p>An earnings season is a wall of PDFs. Every company you cover releases a results PDF, a transcript PDF, and a slide deck, all in the same 48-hour window. If you cover twenty companies — I cover thirty-one — that's ninety documents, and they all demand the same structured thinking: What did management guide? What changed? What are they not saying?</p>
          <p>I spent six days in Week 8 of the Generalist Fellowship trying to build something that would read these documents the way a good analyst reads them, not just extract text. Here's exactly what I built, what failed, and what finally worked.</p>

          <h2>Day one: the wrong abstraction</h2>
          <p>My first instinct was to treat each PDF as a RAG problem. Chunk the document, embed it, retrieve the relevant chunks, ask Claude. This is the standard playbook and it does not work for earnings analysis.</p>
          <p>The problem is that earnings analysis requires cross-document reasoning. The interesting signal in an earnings call is almost never in one paragraph — it's in the gap between what the CFO said this quarter and what she said last quarter. RAG retrieves by semantic similarity to a query. It doesn't retrieve "the delta."</p>

          <blockquote className="pullquote">"A confident wrong answer is worse than no answer. The RAG system gave me confident wrong answers — retrieved the right section but missed the context that made it meaningful."</blockquote>

          <h2>Day three: the right abstraction</h2>
          <p>The architecture I landed on is a three-stage Claude pipeline — no vector DB, no embedding, just structured prompting and Claude's native ability to reason over long documents.</p>
          <ol>
            <li><strong>Extractor</strong>: takes the full transcript (passed via Claude Projects document upload) and returns a structured JSON object: guidance numbers, management commentary quotes (verbatim), risk language, and a sentiment tag.</li>
            <li><strong>Analyst</strong>: takes the current period extractor output and the previous period output as context, produces a delta analysis — what changed, what worsened, what contradicts previous guidance.</li>
            <li><strong>Editor</strong>: takes the Analyst output and writes a 250-word management commentary brief in the style of an Indian equity research note.</li>
          </ol>

          <h2>The actual extractor prompt</h2>
          <pre>{`You are a senior equity analyst at an Indian asset management firm.

I will give you an earnings call transcript. Extract structured data.

Return ONLY valid JSON — no prose, no markdown — matching this schema exactly:
{
  "company": "string",
  "quarter": "Q1FY26",
  "guidance_numbers": [{"metric": "...", "value": "...", "verbatim": "..."}],
  "management_quotes": [{"speaker": "...", "quote": "...", "topic": "..."}],
  "risk_language": ["verbatim sentences that signal caution or risk"],
  "sentiment": "positive | neutral | cautious | negative",
  "headline": "single sentence — the most important thing management said"
}

If you are uncertain about a value, use null. Do not guess numbers.
Never infer verbatim quotes — only extract what was explicitly said.

TRANSCRIPT:
[transcript here]`}</pre>

          <h2>Day five: the failure log</h2>
          <p>The extractor works. The analyst stage was the hard part. My first Analyst prompt asked Claude to "compare the current and previous quarter." Claude would produce excellent analysis — but it would hallucinate previous-quarter numbers if the previous extractor output had nulls.</p>
          <p>The fix was counterintuitive: I added an explicit null-handling instruction. "If a value is null in either period, do not compute a delta for that metric. Instead, flag it as 'data gap' and explain what information is missing." This turned out to be more useful than the delta — a finance team needs to know what they don't know.</p>

          <h2>The MCP map</h2>
          <p>The final version connects three MCP tools via Claude Desktop:</p>
          <ul>
            <li><strong>filesystem MCP</strong>: reads PDFs from a local folder I drop transcripts into</li>
            <li><strong>Google Drive MCP</strong>: writes the final brief back to a shared team folder</li>
            <li><strong>Slack MCP</strong>: posts a one-line summary and the Drive link to our team channel</li>
          </ul>
          <p>The whole workflow runs in Claude Desktop. I drop the PDF. I type "run earnings brief." Three minutes later the brief is in Drive and Slack has pinged the team.</p>

          <h2>Day six: when it became real</h2>
          <p>My manager asked me to cover an unplanned results announcement at 7 PM on a Thursday. Pre-agent, I would have stayed until midnight. I dropped the transcript at 7:15. Brief was in the folder at 7:19. I spent 25 minutes on the judgment layer — the part only I could do — and was done by 8 PM.</p>

          <blockquote className="pullquote">"If you are a finance team and you are not running some version of this, you are leaving 10–15 hours per earnings season on the table. Per analyst."</blockquote>

          <h2>What this looks like inside the Fellowship</h2>
          <p>This build became the Week 8 Finance track project in the Generalist Fellowship. We added an eval layer — a rubric prompt that scores each brief for completeness, accuracy, and tone before it goes out — and a template Skills layer so non-finance team members can trigger the workflow without understanding the underlying prompts.</p>
          <p>The student version takes about 90 minutes to build in the live session. Mine took six days because I was figuring it out. That's the point of the course — you don't have to figure it out yourself anymore.</p>

          <div style={{ background: 'var(--cloud)', borderRadius: 14, padding: '28px 32px', marginTop: 40, border: '0.5px solid rgba(83,74,183,0.2)' }}>
            <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: 'var(--ink)', marginBottom: 8 }}>Want to build like this?</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>The Finance track in the Generalist Fellowship builds this exact system in Week 8. No coding required.</p>
            <button className="btn-primary" onClick={() => go('/generalist')}>See the Generalist Fellowship</button>
          </div>
        </div>
      </article>

      <div style={{ padding: '32px clamp(20px, 5vw, 40px)', maxWidth: 760, margin: '0 auto' }}>
        <button className="btn-ghost" onClick={() => go('/blog')} style={{ color: 'var(--specialist)', fontWeight: 500 }}>Back to Blog</button>
      </div>

      <Footer />
    </>
  );
}
