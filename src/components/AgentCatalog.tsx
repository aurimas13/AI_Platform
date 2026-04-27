import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  PenTool,
  TrendingUp,
  BarChart3,
  Bug,
  GitPullRequest,
  Activity,
  FileText,
  FileCheck,
  ShieldCheck,
  Lightbulb,
  Bell,
  UserCheck,
  UserPlus,
  BookOpen,
  Heart,
  Sparkles,
  ArrowRight,
  Search as SearchIcon,
  Crown,
} from 'lucide-react';
import TopNav from './TopNav';
import { templatesByRole, roleOptions } from '../data/templates';
import type { Role, Template } from '../types/onboarding';

const iconMap: Record<string, React.ElementType> = {
  Search,
  PenTool,
  TrendingUp,
  BarChart3,
  Bug,
  GitPullRequest,
  Activity,
  FileText,
  FileCheck,
  ShieldCheck,
  Lightbulb,
  Bell,
  UserCheck,
  UserPlus,
  BookOpen,
  Heart,
};

const PRO_TEMPLATES = new Set([
  'audience-insights',
  'docs-generator',
  'regulatory-monitor',
  'sentiment-analyzer',
]);

type FlatAgent = Template & { role: Role };

export default function AgentCatalog() {
  const [query, setQuery] = useState('');
  const [activeRole, setActiveRole] = useState<Role | 'all'>('all');

  const allAgents: FlatAgent[] = useMemo(
    () =>
      (Object.entries(templatesByRole) as [Role, Template[]][]).flatMap(
        ([role, list]) => list.map((t) => ({ ...t, role })),
      ),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allAgents.filter((a) => {
      if (activeRole !== 'all' && a.role !== activeRole) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
      );
    });
  }, [allAgents, query, activeRole]);

  return (
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <TopNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-16">
        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full">
              Agent library
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 text-stone-900">
            Browse all agents
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl">
            16 purpose-built AI agents across Marketing, Engineering, Legal, and HR. Click any agent to start a conversation.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={'Search agents by name, role, or capability\u2026'}
              className="w-full h-12 bg-white border border-stone-200 shadow-card rounded-xl pl-11 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-200 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
            <FilterChip
              label="All"
              active={activeRole === 'all'}
              onClick={() => setActiveRole('all')}
            />
            {roleOptions.map((r) => (
              <FilterChip
                key={r.id}
                label={r.label}
                active={activeRole === r.id}
                onClick={() => setActiveRole(r.id)}
              />
            ))}
          </div>
        </div>

        {/* Counts */}
        <p className="text-xs text-stone-500 mb-4">
          Showing <strong className="text-stone-900">{filtered.length}</strong> of{' '}
          {allAgents.length} agents
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-stone-200 shadow-card rounded-2xl p-12 text-center">
            <p className="text-stone-500">No agents match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => {
              const Icon = iconMap[a.icon] ?? Sparkles;
              const isPro = PRO_TEMPLATES.has(a.slug);
              const roleLabel =
                roleOptions.find((r) => r.id === a.role)?.label ?? a.role;
              return (
                <Link
                  key={a.slug}
                  to={`/workspace?agent=${a.slug}`}
                  className="group bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-brass-300 rounded-2xl p-5 sm:p-6 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-brass-50 border border-brass-200 flex items-center justify-center">
                      <Icon
                        className="w-5 h-5 text-brass-600"
                        strokeWidth={1.75}
                      />
                    </div>
                    {isPro && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brass-600 text-cream-50 rounded-md">
                        <Crown className="w-2.5 h-2.5" /> Pro
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-1">
                    {roleLabel}
                  </p>
                  <h3 className="text-lg font-semibold mb-2 text-stone-900">
                    {a.name}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    {a.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium text-brass-600 group-hover:gap-2 transition-all">
                    Open agent
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="px-4 sm:px-10 py-8 text-center border-t border-stone-200/60">
        <p className="text-xs text-stone-500">
          &copy; 2026 AI Gateway &middot;{' '}
          <Link to="/case-study" className="text-brass-600 hover:text-brass-700 font-medium">Case Study</Link>{' '}
          &middot;{' '}
          <a href="https://github.com/aurimas13/AI_Platform" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-900">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 h-12 text-sm font-medium rounded-xl border whitespace-nowrap transition-all ${
        active
          ? 'bg-stone-900 text-cream-50 border-stone-900 shadow-card'
          : 'bg-white text-stone-700 border-stone-200 shadow-card hover:border-brass-300'
      }`}
    >
      {label}
    </button>
  );
}
