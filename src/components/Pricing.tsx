import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, Building2, Users as UsersIcon, Zap } from 'lucide-react';
import TopNav from './TopNav';
import { trackFunnelEvent } from '../lib/analytics';

interface Tier {
  name: string;
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
    price: '$0',
    unit: '/ user / month',
    tagline: 'For individuals exploring AI agents.',
    cta: 'Start free',
    ctaHref: '/',
    icon: Sparkles,
    features: [
      '12 standard AI agents',
      '500 messages / month',
      'Conversation history (7 days)',
      'Community support',
      'Single workspace',
    ],
  },
  {
    name: 'Pro',
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
      'Email support (24h SLA)',
    ],
    fineprint: 'Billed annually or $34/month billed monthly.',
  },
  {
    name: 'Team',
    price: '$79',
    unit: '/ user / month',
    tagline: 'For teams scaling AI across departments.',
    cta: 'Start team trial',
    ctaHref: '/',
    icon: UsersIcon,
    features: [
      'Everything in Pro',
      'Shared agent library across teammates',
      'Role-based access control',
      'Team-wide analytics dashboard',
      'Custom agent templates',
      'Slack & Notion integrations',
      'Priority support (4h SLA)',
    ],
    fineprint: 'Minimum 5 seats. 14-day free trial, no card required.',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    tagline: 'For organizations with security and compliance needs.',
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
      'Dedicated CSM & 1h SLA',
      'Audit logs & DLP',
    ],
  },
];

const faqs = [
  {
    q: 'Is this a real product or a demo?',
    a: 'This is a working Product-Led Growth prototype built as a portfolio piece. The onboarding, chat workspace, agent library, and funnel analytics are all functional. Real OpenAI integration activates when an OPENAI_API_KEY is set in the deployment.',
  },
  {
    q: 'How does the free tier work?',
    a: 'In the live demo, all features are open. In a real deployment, Free would be limited to 500 messages/month and standard agents only \u2014 enough to experience the product without committing.',
  },
  {
    q: 'Can I bring my own API key?',
    a: 'Yes. On Pro and above, you can configure your own OpenAI, Anthropic, or Azure OpenAI key in Settings. Enterprise plans support fully isolated deployments.',
  },
  {
    q: 'Do you offer discounts for startups or non-profits?',
    a: 'Yes \u2014 50% off Pro and Team plans for verified early-stage startups (< $5M ARR) and registered non-profits. Reach out via the Enterprise contact link.',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <TopNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full mb-4">
            Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-stone-900 leading-tight">
            Simple pricing,<br className="sm:hidden" />
            <span className="text-brass-600"> built for teams</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
            Start free. Upgrade when you outgrow it. Cancel anytime &mdash; no contracts, no surprises.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-24">
          {tiers.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-2xl p-6 sm:p-7 transition-all ${
                  t.highlight
                    ? 'bg-stone-900 text-cream-50 border border-stone-900 shadow-card-lg lg:scale-[1.03]'
                    : 'bg-white border border-stone-200 shadow-card hover:shadow-card-hover'
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-brass-600 text-cream-50 rounded-full shadow-card whitespace-nowrap">
                    Most popular
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${
                    t.highlight ? 'bg-brass-500/20' : 'bg-brass-50 border border-brass-200'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${t.highlight ? 'text-brass-300' : 'text-brass-600'}`}
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{t.name}</h3>
                <p
                  className={`text-sm mb-5 ${t.highlight ? 'text-cream-200' : 'text-stone-600'}`}
                >
                  {t.tagline}
                </p>
                <div className="mb-5">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {t.price}
                  </span>
                  {t.unit && (
                    <span
                      className={`text-sm ml-1 ${t.highlight ? 'text-cream-200' : 'text-stone-500'}`}
                    >
                      {t.unit}
                    </span>
                  )}
                </div>
                <a
                  href={t.ctaHref}
                  onClick={() =>
                    trackFunnelEvent({
                      event: 'upgrade_intent_clicked',
                      template_slug: t.name.toLowerCase(),
                    })
                  }
                  className={`flex items-center justify-center gap-2 h-11 rounded-xl font-medium text-sm transition-colors mb-6 ${
                    t.highlight
                      ? 'bg-cream-50 text-stone-900 hover:bg-cream-100'
                      : 'bg-stone-900 text-cream-50 hover:bg-stone-800'
                  }`}
                >
                  {t.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <ul className="space-y-2.5 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          t.highlight ? 'text-brass-300' : 'text-brass-600'
                        }`}
                        strokeWidth={2}
                      />
                      <span
                        className={t.highlight ? 'text-cream-100' : 'text-stone-700'}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                {t.fineprint && (
                  <p
                    className={`text-[11px] mt-5 pt-5 border-t ${
                      t.highlight
                        ? 'text-cream-200 border-cream-50/15'
                        : 'text-stone-500 border-stone-200'
                    }`}
                  >
                    {t.fineprint}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison strip */}
        <section className="mb-16 sm:mb-20">
          <div className="bg-white border border-stone-200 shadow-card rounded-2xl p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-brass-600 mb-1">99.9%</p>
                <p className="text-sm font-semibold text-stone-900 mb-1">Uptime SLA</p>
                <p className="text-xs text-stone-500">on Team & Enterprise plans</p>
              </div>
              <div className="sm:border-l sm:border-r border-stone-200">
                <p className="text-3xl font-bold text-brass-600 mb-1">SOC 2</p>
                <p className="text-sm font-semibold text-stone-900 mb-1">Type II Certified</p>
                <p className="text-xs text-stone-500">audited annually</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brass-600 mb-1">14 days</p>
                <p className="text-sm font-semibold text-stone-900 mb-1">Free Team trial</p>
                <p className="text-xs text-stone-500">no credit card required</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-8 text-stone-900">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6 transition-all open:shadow-card-hover"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                  <span className="font-semibold text-stone-900 text-sm sm:text-base">
                    {f.q}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-brass-50 border border-brass-200 flex items-center justify-center group-open:rotate-45 transition-transform flex-shrink-0">
                    <span className="text-brass-600 font-bold leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm text-stone-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-stone-900 text-cream-50 rounded-2xl p-8 sm:p-12 text-center shadow-card-lg">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Ready to ship AI to your team?
          </h2>
          <p className="text-cream-200 mb-6 max-w-xl mx-auto">
            Start free in under a minute. Upgrade when you&apos;re ready &mdash; no contracts, no commitments.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-cream-50 text-stone-900 font-semibold rounded-xl hover:bg-cream-100 transition-colors"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/case-study"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-stone-800 text-cream-50 font-medium rounded-xl border border-stone-700 hover:bg-stone-700 transition-colors"
            >
              Read the case study
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-4 sm:px-10 py-8 text-center border-t border-stone-200/60">
        <p className="text-xs text-stone-500">
          &copy; 2026 AI Gateway &middot;{' '}
          <a href="https://aurimas.io" className="text-brass-600 hover:text-brass-700 font-medium">aurimas.io</a>
        </p>
      </footer>
    </div>
  );
}
