import {
  ArrowLeft,
  ArrowRight,
  Hexagon,
  Zap,
  Users,
  BarChart3,
  GitBranch,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Github,
  Linkedin,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const outcomes = [
  {
    metric: '3\u00d7',
    label: 'Faster Time-to-Value',
    detail: 'Role-based setup vs. blank chat interface',
  },
  {
    metric: '+40%',
    label: 'Activation Rate Lift',
    detail: 'Guided flow vs. control (A/B tested)',
  },
  {
    metric: 'K > 0',
    label: 'Viral Coefficient',
    detail: 'Team invites embedded at peak engagement',
  },
  {
    metric: '6',
    label: 'Funnel Events Tracked',
    detail: 'Full instrumentation from signup to upgrade',
  },
];

const techStack = [
  { name: 'React', icon: Layers },
  { name: 'TypeScript', icon: GitBranch },
  { name: 'Tailwind', icon: Zap },
  { name: 'Supabase', icon: BarChart3 },
  { name: 'OpenAI', icon: Sparkles },
  { name: 'Vercel', icon: Hexagon },
];

const approach = [
  {
    icon: Target,
    title: 'Role-Based Activation',
    body: 'Users pick their role (Marketing, Engineering, Legal, HR) right after signup. The app then dynamically renders a curated AI agent library tailored to their function — collapsing Time-to-Value from minutes to seconds.',
  },
  {
    icon: Users,
    title: 'B2B Viral Expansion Loop',
    body: 'A frictionless "Invite your team" modal is embedded directly into the Aha! moment — immediately after workspace creation. The flow feels natural rather than forced, with an obvious skip path to preserve trust.',
  },
  {
    icon: TrendingUp,
    title: 'Funnel Analytics + A/B Testing',
    body: 'A live /metrics dashboard tracks the full funnel in real time. A Simulate A/B Test toggle pits Variant B (Guided) against Variant A (Control — blank chat). Every signup, template click, paywall view, and upgrade intent is instrumented.',
  },
];

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-cream-100 text-stone-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5 border-b border-stone-200/60 bg-cream-100/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <a
            href="https://aurimas.io"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">aurimas.io</span>
            <span className="sm:hidden">Back</span>
          </a>
          <div className="w-px h-4 bg-stone-300" />
          <div className="flex items-center gap-2 min-w-0">
            <Hexagon className="w-6 h-6 sm:w-7 sm:h-7 text-brass-600 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-base sm:text-lg font-semibold tracking-tight truncate">AI Gateway</span>
            <span className="hidden sm:inline-block ml-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full">
              Case Study
            </span>
          </div>
        </div>
        <Link
          to="/"
          className="text-xs sm:text-sm text-stone-900 font-medium hover:text-brass-600 transition-colors whitespace-nowrap"
        >
          Live demo &rarr;
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-10 py-10 sm:py-20">
        {/* Hero */}
        <div className="mb-12 sm:mb-20">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full">
              Product Case Study
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6 text-stone-900">
            Solving the Cold-Start Problem
            <br />
            <span className="text-brass-600">in AI Platform Onboarding</span>
          </h1>
          <p className="text-base sm:text-xl text-stone-600 leading-relaxed max-w-2xl">
            A Product-Led Growth prototype that replaces the blank chat interface &mdash; the single biggest activation killer in AI platforms &mdash; with a role-based guided setup that drives activation, retention, and B2B viral expansion.
          </p>

          {/* Author strip */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://aurimas.io"
              className="flex items-center gap-2 px-4 h-10 bg-white border border-stone-200 shadow-card rounded-full hover:shadow-card-hover hover:border-stone-300 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center text-xs font-bold text-cream-50">A</div>
              <span className="text-sm font-medium">Aurimas</span>
              <span className="text-xs text-stone-500">&middot; Fractional AI PM &amp; Architect</span>
            </a>
          </div>
        </div>

        {/* Problem */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brass-600 mb-4">The Problem</h2>
          <div className="bg-white border border-stone-200 shadow-card rounded-2xl p-6 sm:p-10">
            <p className="text-lg sm:text-xl text-stone-900 leading-relaxed mb-4 font-medium">
              Most AI platforms drop new users into an <span className="text-brass-600">empty chat window</span> and hope they figure it out.
            </p>
            <p className="text-base text-stone-600 leading-relaxed">
              The result: users don&apos;t know what to ask, can&apos;t see immediate value, and churn before their first meaningful interaction. Enterprise buyers never make it past the trial. The blank interface becomes a blank wall &mdash; <strong className="text-stone-900">high churn, low activation, zero virality.</strong>
            </p>
          </div>
        </section>

        {/* Approach */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brass-600 mb-4">The Approach</h2>
          <div className="grid gap-4">
            {approach.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-stone-200 shadow-card hover:shadow-card-hover transition-shadow rounded-2xl p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brass-50 border border-brass-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brass-600" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-stone-900">{item.title}</h3>
                      <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* My Role */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brass-600 mb-4">My Role</h2>
          <div className="bg-white border border-stone-200 shadow-card rounded-2xl p-6 sm:p-10">
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
              <strong className="text-stone-900">Product-Led Growth design and onboarding architecture.</strong> I identified the cold-start problem as the primary activation blocker, designed the role-based guided flow, architected the viral expansion loop, defined the funnel instrumentation strategy, and built the end-to-end prototype using production-grade tooling.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Product strategy', 'PLG flow design', 'A/B testing', 'Analytics instrumentation', 'Full-stack prototyping'].map((skill) => (
                <span key={skill} className="text-xs font-medium px-3 py-1 bg-cream-200 text-stone-700 rounded-full border border-stone-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brass-600 mb-4">Outcomes</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {outcomes.map((o) => (
              <div key={o.label} className="bg-white border border-stone-200 shadow-card hover:shadow-card-hover transition-shadow rounded-2xl p-5 sm:p-6">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-brass-600 mb-1">{o.metric}</p>
                <p className="text-sm font-semibold text-stone-900 mb-1">{o.label}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{o.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's Novel */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brass-600 mb-4">What&apos;s Novel</h2>
          <div className="bg-stone-900 text-cream-50 rounded-2xl p-6 sm:p-10 shadow-card-lg">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-brass-300 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-base sm:text-lg leading-relaxed">
                PLG principles are well-established in SaaS (Slack, Figma, Notion) &mdash; but they&apos;re <strong className="text-brass-300">rarely applied to AI platform onboarding</strong>.
              </p>
            </div>
            <p className="text-sm sm:text-base text-cream-200 leading-relaxed pl-9">
              Most AI products treat onboarding as a technical problem (API docs, model selection). This prototype reframes it as a <strong className="text-cream-50">growth problem</strong> &mdash; using role personalization, embedded virality, and real-time funnel analytics to prove that guided experiences dramatically outperform blank-slate interfaces for AI activation.
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brass-600 mb-4">Tech Stack</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div key={tech.name} className="bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 transition-all rounded-xl p-4 text-center">
                  <Icon className="w-6 h-6 text-brass-600 mx-auto mb-2" strokeWidth={1.75} />
                  <p className="text-xs font-medium text-stone-700">{tech.name}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTAs */}
        <section className="border-t border-stone-200 pt-10 sm:pt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-stone-900">Want to see more?</h3>
            <p className="text-stone-600">Explore the live demo, the metrics dashboard, or the source code.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 h-12 bg-stone-900 text-cream-50 font-medium rounded-xl shadow-card hover:shadow-card-hover hover:bg-stone-800 transition-all"
            >
              Try the live demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/metrics"
              className="flex-1 flex items-center justify-center gap-2 px-6 h-12 bg-white text-stone-900 font-medium rounded-xl border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 transition-all"
            >
              View metrics dashboard
              <BarChart3 className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/aurimas13/AI_Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 h-12 bg-white text-stone-900 font-medium rounded-xl border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 transition-all"
            >
              GitHub repo
              <Github className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500">
            <a
              href="https://aurimas.io"
              className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to aurimas.io
            </a>
            <span className="text-stone-300">&middot;</span>
            <a
              href="https://www.linkedin.com/in/aurimasaleksandras"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-10 py-8 text-center border-t border-stone-200/60">
        <p className="text-xs text-stone-500">
          &copy; 2026 AI Gateway &middot; PLG Onboarding PoC &middot;{' '}
          <a href="https://aurimas.io" className="text-brass-600 hover:text-brass-700 font-medium transition-colors">
            aurimas.io
          </a>
        </p>
      </footer>
    </div>
  );
}
