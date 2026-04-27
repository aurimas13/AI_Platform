import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, BarChart3, Users, MessageSquare } from 'lucide-react';
import TopNav from './TopNav';

interface Release {
  version: string;
  date: string;
  title: string;
  type: 'major' | 'minor' | 'patch';
  icon: React.ElementType;
  highlights: string[];
}

const releases: Release[] = [
  {
    version: 'v0.5.0',
    date: 'Apr 2026',
    title: 'Working chat workspace + agent catalog',
    type: 'major',
    icon: MessageSquare,
    highlights: [
      'Live streaming chat workspace with conversation history',
      'Hybrid AI: real OpenAI when configured, deterministic mock otherwise',
      'Browseable agent catalog with search and role filters',
      'Pricing page with Free / Pro / Team / Enterprise tiers',
      'Settings page for workspace, team, and integrations',
    ],
  },
  {
    version: 'v0.4.0',
    date: 'Mar 2026',
    title: 'Cream redesign + LinkedIn featured image',
    type: 'major',
    icon: Sparkles,
    highlights: [
      'Professional warm-cream + brass color palette',
      'Mobile-responsive across every page',
      'LinkedIn-optimized og-image for social sharing',
      'Full-width Case Study page with author strip',
    ],
  },
  {
    version: 'v0.3.0',
    date: 'Feb 2026',
    title: 'Funnel analytics + A/B testing',
    type: 'minor',
    icon: BarChart3,
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
    icon: Zap,
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
    icon: Users,
    highlights: [
      'Email \u2192 Role \u2192 Templates onboarding flow',
      'B2B viral expansion modal at the Aha! moment',
      'Foundational React + TypeScript + Tailwind stack',
    ],
  },
];

const typeStyle: Record<Release['type'], string> = {
  major: 'bg-brass-600 text-cream-50',
  minor: 'bg-brass-100 text-brass-700 border border-brass-200',
  patch: 'bg-stone-100 text-stone-700 border border-stone-200',
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <TopNav />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-20">
        <div className="mb-10 sm:mb-14">
          <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full mb-4">
            Changelog
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-stone-900 leading-tight">
            What&apos;s new
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-xl">
            Release notes and product updates for AI Gateway. Built in public.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {releases.map((r, i) => {
            const Icon = r.icon;
            return (
              <article
                key={r.version}
                className="relative bg-white border border-stone-200 shadow-card hover:shadow-card-hover transition-shadow rounded-2xl p-6 sm:p-8"
              >
                {i === 0 && (
                  <span className="absolute -top-2.5 left-6 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-600 text-cream-50 rounded-full">
                    Latest
                  </span>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brass-50 border border-brass-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brass-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-semibold text-stone-900">
                        {r.version}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${typeStyle[r.type]}`}
                      >
                        {r.type}
                      </span>
                      <span className="text-xs text-stone-500">{r.date}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                      {r.title}
                    </h2>
                  </div>
                </div>
                <ul className="space-y-2 ml-0 sm:ml-14">
                  {r.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm text-stone-700 leading-relaxed"
                    >
                      <span className="w-1 h-1 rounded-full bg-brass-500 mt-2 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 px-6 h-12 bg-stone-900 text-cream-50 font-medium rounded-xl hover:bg-stone-800 transition-colors"
          >
            Try the latest version
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="px-4 sm:px-10 py-8 text-center border-t border-stone-200/60">
        <p className="text-xs text-stone-500">
          &copy; 2026 AI Gateway &middot;{' '}
          <a href="https://github.com/aurimas13/AI_Platform" target="_blank" rel="noopener noreferrer" className="text-brass-600 hover:text-brass-700 font-medium">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
