import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Lock,
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

  // Group filtered by role for editorial section presentation.
  const grouped = useMemo(() => {
    const map: Record<string, FlatAgent[]> = {};
    for (const a of filtered) {
      if (!map[a.role]) map[a.role] = [];
      map[a.role].push(a);
    }
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen text-ink flex flex-col">
      <TopNav />

      {/* Editorial running header */}
      <div className="border-b border-rule/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
          <span>AI Gateway · Compendium</span>
          <span className="hidden sm:inline">{allAgents.length} agents</span>
          <span>vol. II · folio 1</span>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-12 sm:py-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 14, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-14"
        >
          <p className="silcrow mb-6">§ The compendium</p>
          <h1
            className="font-display text-[2.4rem] sm:text-[3.4rem] md:text-[4rem] font-medium leading-[0.98] tracking-[-0.025em] text-ink mb-5 max-w-3xl"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}
          >
            Sixteen agents,{' '}
            <em
              className="italic font-normal text-brass"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 100' }}
            >
              one library
            </em>
            .
          </h1>
          <p className="font-display italic text-base sm:text-lg text-stone leading-[1.55] max-w-2xl"
             style={{ fontVariationSettings: '"SOFT" 100, "opsz" 22' }}>
            Across Marketing, Engineering, Legal, and HR — purpose-built tools, organized as a printed compendium. Tap any entry to begin.
          </p>
        </motion.section>

        {/* Search + filters */}
        <section className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-mute" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, role, or capability…"
                className="w-full h-12 bg-paper-light border border-rule pl-11 pr-4 font-sans text-sm text-ink placeholder-stone-mute outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 transition-all rounded-none"
              />
            </div>
          </div>
          <div className="flex gap-px overflow-x-auto pb-px bg-rule">
            <FilterChip label="All" count={allAgents.length} active={activeRole === 'all'} onClick={() => setActiveRole('all')} />
            {roleOptions.map((r) => {
              const c = allAgents.filter((a) => a.role === r.id).length;
              return (
                <FilterChip
                  key={r.id}
                  label={r.label}
                  count={c}
                  active={activeRole === r.id}
                  onClick={() => setActiveRole(r.id)}
                />
              );
            })}
          </div>
          <p className="marginalia mt-4">
            <span className="text-brass">{filtered.length}</span>
            <span className="text-stone"> of </span>
            <span className="text-ink">{allAgents.length}</span>
            <span className="text-stone"> entries shown</span>
          </p>
        </section>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="border-y border-rule py-16 text-center">
            <p className="font-display italic text-stone text-lg"
               style={{ fontVariationSettings: '"SOFT" 100' }}>
              No agents match your search.
            </p>
            <p className="marginalia mt-3">
              <button
                onClick={() => {
                  setQuery('');
                  setActiveRole('all');
                }}
                className="text-brass hover:text-brass-deep underline decoration-brass-deep underline-offset-4 transition-colors"
              >
                Reset filters
              </button>
            </p>
          </div>
        )}

        {/* Grouped by role — editorial sections */}
        {(Object.keys(grouped) as Role[]).map((role, sectionIdx) => {
          const list = grouped[role];
          const roleLabel = roleOptions.find((r) => r.id === role)?.label ?? role;

          return (
            <motion.section
              key={role}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: sectionIdx * 0.04 }}
              className="mb-14 sm:mb-16"
            >
              {/* Section header */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="silcrow">§ 0{sectionIdx + 1} · {roleLabel}</span>
                <span className="flex-1 h-px bg-rule/60" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-mute">
                  {String(list.length).padStart(2, '0')} entries
                </span>
              </div>

              {/* Catalogue list */}
              <ol className="border-t border-b border-rule">
                {list.map((a, i) => {
                  const Icon = iconMap[a.icon] ?? Sparkles;
                  const isPro = PRO_TEMPLATES.has(a.slug);
                  const num = String(i + 1).padStart(2, '0');

                  return (
                    <li key={a.slug} className={i > 0 ? 'border-t border-rule/60' : ''}>
                      <Link
                        to={`/workspace?agent=${a.slug}`}
                        className="group relative grid grid-cols-[2.5rem_2.5rem_1fr_auto] sm:grid-cols-[3rem_3rem_1fr_auto] items-center gap-3 sm:gap-5 py-4 sm:py-5 px-2 sm:px-4 transition-colors duration-300 hover:bg-paper-light/60"
                      >
                        <span className="font-mono text-[11px] tabular-nums tracking-widest text-stone-mute group-hover:text-brass transition-colors">
                          {num}
                        </span>
                        <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 border border-rule/60 text-stone group-hover:border-brass group-hover:text-brass transition-colors">
                          <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.6} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <h3
                              className="font-display text-lg sm:text-xl font-medium tracking-tight text-ink leading-tight"
                              style={{ fontVariationSettings: '"SOFT" 30, "opsz" 22' }}
                            >
                              {a.name}
                            </h3>
                            {isPro && (
                              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brass-deep bg-brass-tint border border-brass/40 px-1.5 py-0.5 inline-flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                Pro
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-sm text-stone leading-relaxed mt-0.5">
                            {a.description}
                          </p>
                        </div>
                        <span
                          aria-hidden
                          className="justify-self-end text-stone-mute group-hover:text-brass-bright group-hover:translate-x-1 transition-all"
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </motion.section>
          );
        })}
      </main>

      <footer className="border-t border-rule/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-7 marginalia text-center">
          © MMXXVI · AI Gateway ·{' '}
          <Link to="/case-study" className="text-brass hover:text-brass-deep transition-colors">
            Read the essay
          </Link>
          {' · '}
          <a
            href="https://github.com/aurimas13/AI_Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone hover:text-ink transition-colors"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-baseline gap-1.5 px-4 h-10 font-mono text-[11px] uppercase tracking-[0.18em] whitespace-nowrap transition-colors ${
        active
          ? 'bg-ink text-paper-light'
          : 'bg-paper-light text-stone hover:bg-brass-tint/40 hover:text-ink'
      }`}
    >
      {label}
      <span className={`tabular-nums text-[10px] ${active ? 'text-brass-foil' : 'text-stone-mute'}`}>
        {String(count).padStart(2, '0')}
      </span>
    </button>
  );
}
