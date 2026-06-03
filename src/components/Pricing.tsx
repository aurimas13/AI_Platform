import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users as UsersIcon, Sparkles, Zap } from 'lucide-react';
import TopNav from './TopNav';
import { trackFunnelEvent } from '../lib/analytics';

interface Tier {
  name: string;
  numeral: string;
  price: string;
  unit: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  icon: React.ElementType;
  features: string[];
  fineprint?: string;
}

const tiers: Tier[] = [
  {
    name: 'Free',
    numeral: 'I',
    price: '$0',
    unit: '/ user / month',
    tagline: 'For individuals exploring AI agents.',
    cta: 'Start free',
    ctaHref: '/',
    icon: Sparkles,
    features: [
      '12 standard agents',
      '500 messages / month',
      'Conversation history (7 days)',
      'Community support',
      'Single workspace',
    ],
  },
  {
    name: 'Pro',
    numeral: 'II',
    price: '$29',
    unit: '/ user / month',
    tagline: 'For power users and small teams.',
    cta: 'Upgrade to Pro',
    ctaHref: '/',
    highlight: true,
    icon: Zap,
    features: [
      'Everything in Free',
      'All 16 agents (incl. Pro tier)',
      'Unlimited messages',
      'Conversation history (unlimited)',
      'GPT-4o & Claude 3.5 Sonnet',
      'Priority response queue',
      'Email support — 24h SLA',
    ],
    fineprint: 'Billed annually. $34 / month if billed monthly.',
  },
  {
    name: 'Team',
    numeral: 'III',
    price: '$79',
    unit: '/ user / month',
    tagline: 'For teams scaling AI across departments.',
    cta: 'Start team trial',
    ctaHref: '/',
    icon: UsersIcon,
    features: [
      'Everything in Pro',
      'Shared agent library',
      'Role-based access control',
      'Team-wide analytics',
      'Custom agent templates',
      'Slack & Notion integrations',
      'Priority support — 4h SLA',
    ],
    fineprint: 'Minimum 5 seats. 14-day free trial, no card required.',
  },
  {
    name: 'Enterprise',
    numeral: 'IV',
    price: 'Custom',
    unit: '',
    tagline: 'For organizations with security & compliance needs.',
    cta: 'Contact sales',
    ctaHref: 'mailto:hello@aurimas.io?subject=AI%20Gateway%20Enterprise%20inquiry',
    icon: Building2,
    features: [
      'Everything in Team',
      'SSO / SAML / SCIM',
      'Dedicated VPC deployment',
      'BYO LLM (Azure, Bedrock, on-prem)',
      'SOC 2 Type II / HIPAA / GDPR',
      'Custom data residency',
      'Dedicated CSM — 1h SLA',
      'Audit logs & DLP',
    ],
  },
];

const faqs = [
  {
    q: 'Is this a real product or a demo?',
    a: 'A working Product-Led Growth prototype built as a portfolio piece. The onboarding, chat workspace, agent library, and funnel analytics are all functional. Real OpenAI integration activates when an OPENAI_API_KEY is set in the deployment.',
  },
  {
    q: 'How does the free tier work?',
    a: 'In the live demo all features are open. In a real deployment Free would be limited to 500 messages per month and standard agents only — enough to experience the product without committing.',
  },
  {
    q: 'Can I bring my own API key?',
    a: 'Yes. On Pro and above you can configure your own OpenAI, Anthropic, or Azure OpenAI key in Settings. Enterprise plans support fully isolated deployments.',
  },
  {
    q: 'Discounts for startups or non-profits?',
    a: '50% off Pro and Team plans for verified early-stage startups (under $5M ARR) and registered non-profits. Reach out via the Enterprise contact link.',
  },
];

const reveal = {
  hidden: { opacity: 0, y: 14, filter: 'blur(2px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export default function Pricing() {
  return (
    <div className="min-h-screen text-ink flex flex-col">
      <TopNav />

      {/* Editorial running header */}
      <div className="border-b border-rule/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
          <span>AI Gateway · Tariff sheet</span>
          <span className="hidden sm:inline">Anno MMXXVI</span>
          <span>vol. III · folio 1</span>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-12 sm:py-20">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
          className="mb-14 sm:mb-20"
        >
          <motion.p variants={reveal} transition={{ duration: 0.7 }} className="silcrow mb-6">
            § The tariff
          </motion.p>
          <motion.h1
            variants={reveal}
            transition={{ duration: 0.85 }}
            className="font-display text-[2.6rem] sm:text-[3.6rem] md:text-[4.4rem] font-medium leading-[0.98] tracking-[-0.025em] text-ink mb-5 max-w-3xl"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 110' }}
          >
            Simple pricing,{' '}
            <em
              className="italic font-normal text-brass"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 110' }}
            >
              built for teams
            </em>
            <span className="text-brass-bright">.</span>
          </motion.h1>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.7 }}
            className="font-display italic text-lg sm:text-xl text-stone leading-[1.55] max-w-2xl"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 22' }}
          >
            Start free. Upgrade when you outgrow it. Cancel anytime — no contracts, no surprises.
          </motion.p>
        </motion.section>

        {/* Tier list — printed price ledger, not card grid */}
        <section className="mb-16 sm:mb-24">
          <div className="border-y border-rule">
            {tiers.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                  className={`relative grid sm:grid-cols-[5rem_1fr_1fr_auto] gap-x-6 gap-y-4 py-8 sm:py-10 px-2 sm:px-4 ${
                    i > 0 ? 'border-t border-rule/60' : ''
                  } ${t.highlight ? 'bg-brass-tint/30' : ''}`}
                >
                  {/* Roman numeral + icon column */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                    <span
                      className="font-display text-3xl sm:text-4xl font-medium text-brass leading-none"
                      style={{ fontVariationSettings: '"SOFT" 100, "opsz" 36' }}
                    >
                      {t.numeral}
                    </span>
                    <span className="flex items-center justify-center w-9 h-9 border border-rule/60 text-stone">
                      <Icon className="w-4 h-4" strokeWidth={1.6} />
                    </span>
                  </div>

                  {/* Name + tagline */}
                  <div>
                    <div className="flex items-baseline gap-3 flex-wrap mb-2">
                      <h3
                        className="font-display text-2xl sm:text-3xl font-medium text-ink leading-tight"
                        style={{ fontVariationSettings: '"SOFT" 50, "opsz" 30' }}
                      >
                        {t.name}
                      </h3>
                      {t.highlight && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-brass-deep bg-brass-foil border border-brass px-1.5 py-0.5">
                          ★ Most chosen
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-sm text-stone leading-relaxed mb-4">{t.tagline}</p>
                    {/* Features list — flowing prose */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 marginalia">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span className="text-brass mt-0.5">·</span>
                          <span className="text-stone">{f}</span>
                        </li>
                      ))}
                    </ul>
                    {t.fineprint && (
                      <p className="marginalia mt-3 italic text-stone-mute">¶ {t.fineprint}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex flex-col">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-mute mb-1">
                      Per seat
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="font-display text-4xl sm:text-5xl font-medium text-ink tabular-nums leading-none"
                        style={{ fontVariationSettings: '"SOFT" 50, "opsz" 50' }}
                      >
                        {t.price}
                      </span>
                    </div>
                    {t.unit && (
                      <p className="marginalia mt-1.5 text-stone">{t.unit.replace('/ ', '')}</p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-end">
                    <a
                      href={t.ctaHref}
                      onClick={() =>
                        trackFunnelEvent({
                          event: 'upgrade_intent_clicked',
                          template_slug: t.name.toLowerCase(),
                        })
                      }
                      className={t.highlight ? 'btn-ink' : 'btn-ghost'}
                    >
                      {t.cta}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Trust strip */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-10 bg-paper-light/60 border-y border-rule"
        >
          <p className="silcrow mb-7 justify-center sm:justify-start">§ Trust marks</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8">
            {[
              { metric: '99.9%', label: 'Uptime SLA', detail: 'on Team & Enterprise' },
              { metric: 'SOC 2', label: 'Type II certified', detail: 'audited annually' },
              { metric: '14 days', label: 'Free Team trial', detail: 'no card required' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`pt-4 ${i === 1 ? 'sm:border-x sm:border-rule sm:px-6' : ''}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass mb-2">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p
                  className="font-display text-4xl font-medium text-ink mb-1.5 tabular-nums"
                  style={{ fontVariationSettings: '"SOFT" 60, "opsz" 40' }}
                >
                  {s.metric}
                </p>
                <p className="font-sans text-sm font-medium text-ink">{s.label}</p>
                <p className="marginalia mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-16">
          <p className="silcrow mb-6">§ Frequently asked</p>
          <h2
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink mb-8"
            style={{ fontVariationSettings: '"SOFT" 50, "opsz" 40' }}
          >
            Notes &amp; clarifications.
          </h2>
          <div className="border-t border-b border-rule">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                className={`group ${i > 0 ? 'border-t border-rule/60' : ''}`}
              >
                <summary className="cursor-pointer list-none flex items-baseline justify-between gap-4 px-2 py-5 hover:bg-paper-light/40 transition-colors">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="font-mono text-[11px] tabular-nums tracking-widest text-stone-mute group-open:text-brass">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-display text-lg sm:text-xl text-ink leading-snug"
                      style={{ fontVariationSettings: '"SOFT" 30, "opsz" 22' }}
                    >
                      {f.q}
                    </span>
                  </div>
                  <span className="font-mono text-brass text-lg leading-none flex-shrink-0 group-open:rotate-45 transition-transform origin-center">
                    +
                  </span>
                </summary>
                <p className="px-2 pb-6 pl-9 font-sans text-base text-stone leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA — inverted ink panel */}
        <section className="bg-ink text-paper p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-3 sm:inset-5 border border-brass-deep/40 pointer-events-none" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass-bright mb-5">
            ◇ Ready to begin
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4 leading-[1.05]"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 50' }}
          >
            Ship AI to your team —{' '}
            <em
              className="italic text-brass-bright"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 50' }}
            >
              today
            </em>
            .
          </h2>
          <p className="font-display italic text-paper-edge/80 mb-8 max-w-xl mx-auto"
             style={{ fontVariationSettings: '"SOFT" 100, "opsz" 22' }}>
            Start free in under a minute. Upgrade when you&rsquo;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-paper text-ink font-sans text-sm font-medium hover:bg-brass-foil transition-colors border border-paper"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/case-study"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 border border-brass-deep/60 text-paper hover:bg-brass-deep/30 hover:border-brass-bright font-sans text-sm font-medium transition-colors"
            >
              Read the essay
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-7 marginalia text-center">
          © MMXXVI · AI Gateway · An atelier of agents
        </div>
      </footer>
    </div>
  );
}
