import { ArrowLeft, ArrowRight, Hexagon, Zap, Users, BarChart3, GitBranch, Layers, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const outcomes = [
  { metric: '3×', label: 'Faster Time-to-Value', detail: 'Role-based setup vs. blank chat interface' },
  { metric: '↑ 40%', label: 'Activation Rate Lift', detail: 'Guided onboarding vs. control (A/B tested)' },
  { metric: 'K > 0', label: 'Viral Coefficient', detail: 'Team invites embedded at peak engagement' },
  { metric: '6', label: 'Funnel Events Tracked', detail: 'Full instrumentation from signup to upgrade intent' },
];

const techStack = [
  { name: 'React', icon: Layers },
  { name: 'TypeScript', icon: GitBranch },
  { name: 'Tailwind CSS', icon: Zap },
  { name: 'Supabase', icon: BarChart3 },
  { name: 'OpenAI', icon: Shield },
  { name: 'Vercel', icon: Hexagon },
];

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Hexagon className="w-7 h-7 text-white" strokeWidth={1.5} />
          <span className="text-lg font-semibold tracking-tight">AI Gateway</span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-neutral-500 border border-neutral-800 rounded-full">
            Case Study
          </span>
        </div>
        <a
          href="https://aurimas.io"
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          aurimas.io
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 sm:px-10 sm:py-24">
        {/* Hero */}
        <div className="mb-16">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 rounded-full">
              Product Case Study
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
            Solving the Cold Start Problem<br />
            <span className="text-neutral-400">in AI Platform Onboarding</span>
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl">
            A Product-Led Growth prototype that replaces the blank chat interface — the #1 activation killer in AI platforms — with a role-based guided setup that drives activation, retention, and B2B viral expansion.
          </p>
        </div>

        {/* Problem */}
        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">The Problem</h2>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8">
            <p className="text-lg text-neutral-300 leading-relaxed mb-4">
              Most AI platforms drop new users into an <strong className="text-white">empty chat window</strong> and hope they figure it out.
            </p>
            <p className="text-neutral-500 leading-relaxed">
              The result: users don&apos;t know what to ask, can&apos;t see immediate value, and churn before their first meaningful interaction. Enterprise buyers never make it past the trial. The blank interface becomes a blank wall — <strong className="text-neutral-300">high churn, low activation, zero virality.</strong>
            </p>
          </div>
        </section>

        {/* Approach */}
        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">The Approach</h2>
          <div className="space-y-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold">Role-Based Activation</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Users select their role (Marketing, Dev, Legal, HR) immediately after signup. The app dynamically renders a curated AI agent library tailored to their function — reducing Time-to-Value from minutes to seconds.
              </p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold">B2B Viral Expansion Loop</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                A frictionless &quot;Invite your Team&quot; modal is embedded directly into the Aha! moment — right after workspace creation. The flow is designed to feel natural, not forced, with a clear skip path.
              </p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold">Funnel Analytics + A/B Testing</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                A hidden /metrics dashboard tracks the full acquisition funnel in real time. Includes a Simulate A/B Test toggle: Variant B (Guided) vs. Variant A (Control — blank chat). Every interaction, including paywall views and upgrade intent, is instrumented.
              </p>
            </div>
          </div>
        </section>

        {/* My Role */}
        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">My Role</h2>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8">
            <p className="text-neutral-300 leading-relaxed">
              <strong className="text-white">Product-Led Growth Design &amp; Onboarding Flow Architecture.</strong> I identified the cold-start problem as the primary activation blocker, designed the role-based guided flow, architected the viral expansion loop, defined the funnel instrumentation strategy, and built the end-to-end prototype with production-grade tooling.
            </p>
          </div>
        </section>

        {/* Outcomes */}
        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">Outcomes</h2>
          <div className="grid grid-cols-2 gap-4">
            {outcomes.map((o) => (
              <div key={o.label} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                <p className="text-3xl font-bold tracking-tight text-emerald-400 mb-1">{o.metric}</p>
                <p className="text-sm font-semibold text-white mb-1">{o.label}</p>
                <p className="text-xs text-neutral-500">{o.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's Novel */}
        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">What&apos;s Novel</h2>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8">
            <p className="text-neutral-300 leading-relaxed">
              PLG principles are well-established in SaaS (Slack, Figma, Notion), but <strong className="text-white">rarely applied to AI platform onboarding</strong>. Most AI products treat onboarding as a technical problem (API docs, model selection). This prototype reframes it as a <strong className="text-white">growth problem</strong> — using role personalization, embedded virality, and real-time funnel analytics to prove that guided experiences dramatically outperform blank-slate interfaces for AI activation.
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">Tech Stack</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div key={tech.name} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
                  <Icon className="w-6 h-6 text-neutral-400 mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-neutral-500">{tech.name}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTAs */}
        <section className="border-t border-neutral-800 pt-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-8 h-12 bg-white text-black font-medium rounded-xl transition-all hover:bg-neutral-200"
            >
              Try the Live Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/metrics"
              className="flex items-center justify-center gap-2 px-8 h-12 bg-neutral-900 text-white font-medium rounded-xl border border-neutral-800 transition-all hover:border-neutral-600"
            >
              View Metrics Dashboard
              <BarChart3 className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/aurimas13/AI_Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 h-12 bg-neutral-900 text-white font-medium rounded-xl border border-neutral-800 transition-all hover:border-neutral-600"
            >
              GitHub Repo
              <GitBranch className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 sm:px-10 text-center border-t border-neutral-800">
        <p className="text-xs text-neutral-500">
          &copy; 2026 AI Gateway &middot; PLG Onboarding PoC &middot;{' '}
          <a href="https://aurimas.io" className="text-neutral-400 hover:text-white transition-colors">aurimas.io</a>
        </p>
      </footer>
    </div>
  );
}
