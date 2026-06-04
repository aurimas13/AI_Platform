import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Github,
  Linkedin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TopNav from './TopNav';

const scope = [
  { metric: '16', label: 'AI agents shipped', detail: 'Across Marketing, Engineering, Legal & HR' },
  { metric: '4', label: 'Roles supported', detail: 'Each with its own curated agent library' },
  { metric: '6', label: 'Funnel events instrumented', detail: 'Signup → role → template → invite → paywall → upgrade' },
  { metric: '2', label: 'Onboarding variants', detail: 'Guided (B) vs. blank-chat control (A)' },
];

const sections = [
  {
    num: '01',
    eyebrow: 'The Problem',
    title: 'A blank cursor is not a product.',
    body: (
      <>
        <p className="drop-cap font-display text-[1.35rem] sm:text-[1.5rem] leading-[1.55] text-ink-soft mb-6">
          Most AI platforms ship the same opening move: an empty chat window and a hopeful invitation to <em className="text-brass">type something</em>. The result is well-documented and brutal&mdash;users do not know what to ask, cannot see immediate value, and churn before their first meaningful interaction.
        </p>
        <p className="font-sans text-base sm:text-lg leading-[1.7] text-stone">
          Enterprise buyers never make it past the trial. The blank interface becomes a blank wall: <strong className="text-ink font-semibold">high churn, low activation, zero virality.</strong>{' '}
          The cold-start problem is the single biggest activation killer in AI products today, and it is rarely treated as a growth problem.
        </p>
      </>
    ),
  },
  {
    num: '02',
    eyebrow: 'The Approach',
    title: 'Three moves, in concert.',
    body: (
      <ol className="space-y-7">
        {[
          {
            n: 'I.',
            head: 'Role-based activation',
            text:
              'After signup, users pick their role (Marketing, Engineering, Legal, HR). The app then dynamically renders a curated agent library tailored to their function — collapsing time-to-value from minutes to seconds.',
          },
          {
            n: 'II.',
            head: 'Embedded viral expansion',
            text:
              'A frictionless "Invite your team" prompt is woven into the Aha! moment — immediately after workspace creation. The flow feels natural, with an obvious skip path to preserve trust.',
          },
          {
            n: 'III.',
            head: 'Funnel analytics & A/B',
            text:
              'A live /metrics dashboard tracks the full funnel in real time. A toggle pits Variant B (Guided) against Variant A (Control — blank chat). Every signup, click, paywall view, and upgrade intent is instrumented.',
          },
        ].map((s) => (
          <li key={s.n} className="grid grid-cols-[2rem_1fr] gap-4">
            <span
              className="font-display text-2xl text-brass leading-none mt-0.5"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 24' }}
            >
              {s.n}
            </span>
            <div>
              <h4
                className="font-display text-xl font-medium text-ink mb-1.5 leading-tight"
                style={{ fontVariationSettings: '"SOFT" 30, "opsz" 22' }}
              >
                {s.head}
              </h4>
              <p className="font-sans text-base text-stone leading-relaxed">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
  {
    num: '03',
    eyebrow: 'My Role',
    title: 'Strategy through to ship.',
    body: (
      <>
        <p className="font-sans text-base sm:text-lg leading-[1.7] text-stone mb-6">
          <strong className="text-ink font-semibold">Product-Led Growth design and onboarding architecture.</strong>{' '}
          I identified the cold-start problem as the primary activation blocker, designed the role-based guided flow, architected the viral expansion loop, defined the funnel instrumentation strategy, and built the end-to-end prototype using production-grade tooling.
        </p>
        <ul className="flex flex-wrap gap-x-1 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-brass">
          {['Product strategy', 'PLG flow design', 'A/B testing', 'Analytics instrumentation', 'Full-stack prototyping'].map(
            (skill, i, arr) => (
              <li key={skill} className="flex items-center gap-2">
                <span>{skill}</span>
                {i < arr.length - 1 && <span className="text-rule">·</span>}
              </li>
            ),
          )}
        </ul>
      </>
    ),
  },
];

export default function CaseStudy() {
  return (
    <div className="min-h-screen text-ink">
      <TopNav />

      {/* Editorial running header */}
      <div className="border-b border-rule/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
          <span>AI Gateway · Case Study</span>
          <span className="hidden sm:inline">Anno MMXXVI</span>
          <span>vol. I · folio 1</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          className="mb-16 sm:mb-24"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10, filter: 'blur(2px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="silcrow mb-7"
          >
            § A product case study
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 14, filter: 'blur(2px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.6rem] sm:text-[3.6rem] md:text-[4.4rem] font-medium leading-[1.0] tracking-[-0.025em] text-ink mb-7"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 110' }}
          >
            Solving the cold-start problem in{' '}
            <em
              className="italic font-normal text-brass"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 110' }}
            >
              AI platform onboarding
            </em>
            <span className="text-brass-bright">.</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-lg sm:text-xl italic text-stone leading-[1.55] max-w-2xl"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 22' }}
          >
            A Product-Led Growth prototype that replaces the blank chat interface — the single biggest activation killer in AI platforms — with a role-based guided setup that drives activation, retention, and B2B viral expansion.
          </motion.p>

          {/* Author + meta */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
            className="mt-10 pt-6 border-t border-rule/60 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-stone"
          >
            <div>
              <span className="text-stone-mute block mb-1">Author</span>
              <a
                href="https://aurimas.io"
                className="text-ink hover:text-brass-deep transition-colors"
              >
                Aurimas A. Nausėdas
              </a>
            </div>
            <div>
              <span className="text-stone-mute block mb-1">Discipline</span>
              <span className="text-ink">Fractional AI PM &amp; Architect</span>
            </div>
            <div>
              <span className="text-stone-mute block mb-1">Anno</span>
              <span className="text-ink">MMXXVI</span>
            </div>
            <div>
              <span className="text-stone-mute block mb-1">Reading</span>
              <span className="text-ink">≈ 6 min</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Numbered sections */}
        {sections.map((s, i) => (
          <motion.section
            key={s.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid sm:grid-cols-[7rem_1fr] gap-x-8 gap-y-3 mb-16 sm:mb-24"
          >
            {/* Marginalia column */}
            <aside className="sm:pt-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-mute mb-1">
                Section
              </div>
              <div
                className="font-display text-3xl sm:text-4xl font-medium text-brass leading-none"
                style={{ fontVariationSettings: '"SOFT" 100, "opsz" 36' }}
              >
                {s.num}
              </div>
              <div className="hidden sm:block mt-3 h-px w-12 bg-rule" />
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass mt-2">
                {s.eyebrow}
              </div>
            </aside>

            {/* Body column */}
            <div>
              <h3
                className="font-display text-[2rem] sm:text-[2.6rem] font-medium leading-[1.05] tracking-tight text-ink mb-7"
                style={{ fontVariationSettings: '"SOFT" 50, "opsz" 50' }}
              >
                {s.title}
              </h3>
              {s.body}
            </div>

            {/* Section divider */}
            {i < sections.length - 1 && (
              <hr className="sm:col-span-2 mt-12 sm:mt-16 border-0 h-px bg-rule/60" />
            )}
          </motion.section>
        ))}

        {/* Outcomes — pull-quote treatment */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-24 -mx-4 sm:-mx-8 px-4 sm:px-8 py-12 sm:py-16 bg-paper-light/60 border-y border-rule"
        >
          <p className="silcrow mb-8">§ 04 · The build</p>
          <h3
            className="font-display text-[2rem] sm:text-[2.6rem] font-medium leading-[1.05] tracking-tight text-ink mb-4 max-w-2xl"
            style={{ fontVariationSettings: '"SOFT" 50, "opsz" 50' }}
          >
            What was actually shipped.
          </h3>
          <p className="font-sans text-base text-stone leading-relaxed max-w-2xl mb-10">
            This is a working prototype, not a live product with traffic — so these are the things you can open and verify, not invented conversion numbers. The <Link to="/metrics" className="text-brass hover:text-brass-deep underline decoration-brass-deep underline-offset-4">metrics dashboard</Link> computes its funnel live from real interactions (or seeded demo data).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {scope.map((o, i) => (
              <div
                key={o.label}
                className={`pt-5 ${i % 2 === 0 ? 'border-t border-rule sm:border-r sm:pr-8' : 'border-t border-rule'} `}
              >
                <p
                  className="font-display text-5xl sm:text-6xl font-medium text-brass leading-none mb-3 tabular-nums"
                  style={{ fontVariationSettings: '"SOFT" 60, "opsz" 60' }}
                >
                  {o.metric}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink mb-1">
                  {o.label}
                </p>
                <p className="font-sans text-sm text-stone leading-relaxed">{o.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* What's novel — inverted ink panel */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-24 bg-ink text-paper p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Decorative hairline frame */}
          <div className="absolute inset-3 sm:inset-5 border border-brass-deep/40 pointer-events-none" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass-bright mb-6">
            § 05 · What is novel
          </p>
          <p
            className="font-display text-2xl sm:text-3xl leading-[1.3] tracking-tight max-w-2xl mb-6"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 30' }}
          >
            PLG principles are well-established in SaaS — Slack, Figma, Notion. But they are{' '}
            <em
              className="italic text-brass-bright"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 30' }}
            >
              rarely applied
            </em>{' '}
            to AI platform onboarding.
          </p>
          <p className="font-sans text-sm sm:text-base text-paper-edge/80 leading-relaxed max-w-xl">
            Most AI products treat onboarding as a technical problem (API docs, model selection). This prototype reframes it as a <strong className="text-paper-light">growth problem</strong> — using role personalization, embedded virality, and real-time funnel analytics to prove that guided experiences dramatically outperform blank-slate interfaces for AI activation.
          </p>
        </motion.section>

        {/* Tech stack — colophon */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <p className="silcrow mb-6">§ 06 · Colophon</p>
          <p className="font-display italic text-lg sm:text-xl text-stone leading-relaxed mb-4 max-w-2xl"
             style={{ fontVariationSettings: '"SOFT" 100, "opsz" 22' }}>
            Composed in Fraunces, set in Geist, monospaced in JetBrains Mono. Built and shipped on:
          </p>
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-ink leading-loose">
            React <span className="text-rule">·</span>{' '}
            TypeScript <span className="text-rule">·</span>{' '}
            Tailwind <span className="text-rule">·</span>{' '}
            Supabase <span className="text-rule">·</span>{' '}
            OpenAI <span className="text-rule">·</span>{' '}
            Vercel
          </p>
        </motion.section>

        {/* CTA */}
        <section className="border-t border-rule pt-12 sm:pt-16">
          <div className="text-center mb-10">
            <p className="silcrow justify-center mb-5">Want to see more?</p>
            <h3
              className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink mb-3"
              style={{ fontVariationSettings: '"SOFT" 50, "opsz" 40' }}
            >
              Read the source. Run the demo.
            </h3>
            <p className="font-sans text-base text-stone max-w-md mx-auto">
              Live demo, metrics dashboard, and source code — all open.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/" className="btn-ink flex-1">
              Try the live demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/metrics" className="btn-ghost flex-1">
              <BarChart3 className="w-4 h-4" />
              Metrics dashboard
            </Link>
            <a
              href="https://github.com/aurimas13/AI_Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 marginalia">
            <a
              href="https://aurimas.io"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              aurimas.io
            </a>
            <span className="text-rule">·</span>
            <a
              href="https://www.linkedin.com/in/aurimasaleksandras"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <Linkedin className="w-3 h-3" />
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-7 marginalia text-center">
          © MMXXVI · AI Gateway · An atelier of agents · Set in Fraunces &amp; Geist
        </div>
      </footer>
    </div>
  );
}
