import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import TopNav from './TopNav';

interface Release {
  version: string;
  date: string;
  title: string;
  type: 'major' | 'minor' | 'patch';
  highlights: string[];
}

const releases: Release[] = [
  {
    version: 'v0.6.0',
    date: 'Apr 2026',
    title: 'Atelier — full editorial redesign',
    type: 'major',
    highlights: [
      'Distinctive type system: Fraunces (display) + Geist (sans) + JetBrains Mono',
      'Cream paper / deep ink / brass-leaf palette with hairline gold rules',
      'Editorial sections with §-marked numbering and marginalia',
      'Orchestrated framer-motion page-load reveals',
      'Dark atelier night-mode for /workspace',
    ],
  },
  {
    version: 'v0.5.0',
    date: 'Apr 2026',
    title: 'Working chat workspace + agent catalogue',
    type: 'major',
    highlights: [
      'Live streaming chat workspace with conversation history',
      'Hybrid AI: real OpenAI when configured, deterministic mock otherwise',
      'Browseable agent catalogue with search and role filters',
      'Pricing page with Free / Pro / Team / Enterprise tiers',
      'Settings for workspace, team, and integrations',
    ],
  },
  {
    version: 'v0.4.0',
    date: 'Mar 2026',
    title: 'Cream redesign + LinkedIn featured image',
    type: 'major',
    highlights: [
      'Warm-cream + brass color palette (precursor to Atelier)',
      'Mobile responsiveness across every page',
      'LinkedIn-optimized og-image for social sharing',
      'Full-width Case Study page with author strip',
    ],
  },
  {
    version: 'v0.3.0',
    date: 'Feb 2026',
    title: 'Funnel analytics + A/B testing',
    type: 'minor',
    highlights: [
      'Live /metrics dashboard powered by Supabase',
      'A/B test simulator on the signup page',
      'Six funnel events instrumented end-to-end',
      'Real-time conversion and viral-rate tracking',
    ],
  },
  {
    version: 'v0.2.0',
    date: 'Jan 2026',
    title: 'Role-based agent library',
    type: 'minor',
    highlights: [
      '16 purpose-built agents across 4 roles',
      'Pro paywall with upgrade-intent tracking',
      'Per-agent template selection in onboarding',
    ],
  },
  {
    version: 'v0.1.0',
    date: 'Dec 2025',
    title: 'Initial PLG onboarding flow',
    type: 'minor',
    highlights: [
      'Email → Role → Templates onboarding flow',
      'B2B viral expansion modal at the Aha! moment',
      'Foundational React + TypeScript + Tailwind stack',
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen text-ink flex flex-col">
      <TopNav />

      {/* Running header */}
      <div className="border-b border-rule/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
          <span>AI Gateway · Almanack</span>
          <span className="hidden sm:inline">{releases.length} issues</span>
          <span>vol. IV · folio 1</span>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-12 sm:py-20">
        <motion.section
          initial={{ opacity: 0, y: 14, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-20"
        >
          <p className="silcrow mb-6">§ The almanack</p>
          <h1
            className="font-display text-[2.6rem] sm:text-[3.6rem] md:text-[4.4rem] font-medium leading-[0.98] tracking-[-0.025em] text-ink mb-5 max-w-3xl"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 110' }}
          >
            What&rsquo;s{' '}
            <em className="italic font-normal text-brass" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 110' }}>
              new
            </em>
            <span className="text-brass-bright">.</span>
          </h1>
          <p className="font-display italic text-lg sm:text-xl text-stone leading-[1.55] max-w-2xl"
             style={{ fontVariationSettings: '"SOFT" 100, "opsz" 22' }}>
            Release notes &amp; product updates. Built in public, set by hand.
          </p>
        </motion.section>

        {/* Issue list — editorial spread */}
        <div className="border-t border-rule">
          {releases.map((r, i) => (
            <motion.article
              key={r.version}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
              className="grid sm:grid-cols-[8rem_1fr] gap-x-8 gap-y-3 py-10 sm:py-14 border-b border-rule/60"
            >
              {/* Marginalia: version + date + type */}
              <aside className="sm:pt-2">
                <div className="flex items-baseline gap-2 sm:flex-col sm:items-start sm:gap-0">
                  {i === 0 && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 sm:mb-2 inline-flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      Current
                    </span>
                  )}
                  <span
                    className="font-display text-2xl sm:text-3xl font-medium text-brass tabular-nums leading-none"
                    style={{ fontVariationSettings: '"SOFT" 80, "opsz" 30' }}
                  >
                    {r.version}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-mute mt-1.5">
                  {r.date}
                </p>
                <p className={`font-mono text-[10px] uppercase tracking-[0.22em] mt-1 ${
                  r.type === 'major'
                    ? 'text-vermilion'
                    : r.type === 'minor'
                      ? 'text-brass'
                      : 'text-stone-mute'
                }`}>
                  {r.type === 'major' ? '◆' : r.type === 'minor' ? '◇' : '·'} {r.type}
                </p>
              </aside>

              {/* Body */}
              <div>
                <h2
                  className="font-display text-2xl sm:text-3xl font-medium leading-tight tracking-tight text-ink mb-5"
                  style={{ fontVariationSettings: '"SOFT" 50, "opsz" 30' }}
                >
                  {r.title}
                </h2>
                <ul className="space-y-2.5">
                  {r.highlights.map((h, j) => (
                    <li key={h} className="grid grid-cols-[1.5rem_1fr] gap-2 font-sans text-[15px] text-stone leading-relaxed">
                      <span className="font-mono text-[11px] tabular-nums tracking-widest text-brass-bright pt-1.5">
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/workspace" className="btn-ink inline-flex">
            Try the latest version
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-rule/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-7 marginalia text-center">
          © MMXXVI · AI Gateway ·{' '}
          <a
            href="https://github.com/aurimas13/AI_Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass hover:text-brass-deep transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
