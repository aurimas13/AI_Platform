import { useState } from 'react';
import { motion } from 'framer-motion';
import PaywallModal from './PaywallModal';
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
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Lock,
} from 'lucide-react';
import type { Role, Template } from '../types/onboarding';
import { templatesByRole, roleOptions } from '../data/templates';
import { trackFunnelEvent } from '../lib/analytics';

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

interface TemplateLibraryProps {
  role: Role;
  onFinish: (templates: string[]) => Promise<void>;
  onSkip: () => void;
  onBack: () => void;
}

const PRO_TEMPLATES = new Set([
  'audience-insights',
  'docs-generator',
  'regulatory-monitor',
  'sentiment-analyzer',
]);

const reveal = {
  hidden: { opacity: 0, y: 14, filter: 'blur(2px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export default function TemplateLibrary({ role, onFinish, onSkip, onBack }: TemplateLibraryProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [paywallSlug, setPaywallSlug] = useState<string | null>(null);

  const templates = templatesByRole[role];
  const roleLabel = roleOptions.find((r) => r.id === role)?.label ?? role;

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await onFinish(Array.from(selected));
    } catch {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
    >
      {/* Back link */}
      <motion.button
        variants={reveal}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={onBack}
        className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-stone hover:text-ink transition-colors mb-10"
      >
        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
        Back to role
      </motion.button>

      {/* Folio rule */}
      <motion.div
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-7"
      >
        <span className="silcrow">§ 03 · the catalogue</span>
        <span className="flex-1 h-px bg-rule/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-mute">
          {roleLabel}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        variants={reveal}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-[2.4rem] sm:text-[3.2rem] md:text-[3.8rem] font-medium leading-[0.98] tracking-tight text-ink mb-5"
        style={{ fontVariationSettings: '"SOFT" 50, "opsz" 100' }}
      >
        Compose your{' '}
        <em className="italic font-normal text-brass" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 100' }}>
          library
        </em>
        .
      </motion.h2>

      <motion.p
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-sans text-base sm:text-lg text-stone leading-relaxed max-w-xl mb-3"
      >
        Curated for <span className="text-ink font-medium underline decoration-brass underline-offset-4 decoration-1">{roleLabel}</span>. Tap entries to compose your starting agents.
      </motion.p>

      <motion.p
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="marginalia mb-10"
      >
        <span className="text-brass">{selected.size}</span>
        <span className="text-stone"> of </span>
        <span className="text-ink">{templates.length}</span>
        <span className="text-stone"> entries selected</span>
      </motion.p>

      {/* Catalogue list — full-width hairline rows */}
      <motion.ol
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="border-t border-b border-rule mb-10"
      >
        {templates.map((template: Template, i) => {
          const Icon = iconMap[template.icon] ?? Sparkles;
          const isSelected = selected.has(template.slug);
          const isPro = PRO_TEMPLATES.has(template.slug);
          const num = String(i + 1).padStart(2, '0');

          return (
            <li key={template.slug} className={i > 0 ? 'border-t border-rule/60' : ''}>
              <button
                onClick={() => {
                  if (isPro) {
                    setPaywallSlug(template.slug);
                    return;
                  }
                  toggle(template.slug);
                  trackFunnelEvent({ event: 'template_clicked', template_slug: template.slug });
                }}
                className={`relative w-full text-left grid grid-cols-[2.5rem_2.5rem_1fr_auto] sm:grid-cols-[3rem_3rem_1fr_auto] items-center gap-3 sm:gap-5 py-4 sm:py-5 px-2 sm:px-4 transition-colors duration-300 ${
                  isSelected
                    ? 'bg-brass-tint/40'
                    : 'hover:bg-paper-light/60'
                }`}
              >
                {/* Index */}
                <span
                  className={`font-mono text-[11px] tabular-nums tracking-widest transition-colors ${
                    isSelected ? 'text-brass-deep' : 'text-stone-mute'
                  }`}
                >
                  {num}
                </span>

                {/* Icon */}
                <span
                  className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 ${
                    isSelected
                      ? 'bg-ink text-brass-foil'
                      : isPro
                        ? 'bg-paper-light text-brass border border-brass/30'
                        : 'bg-transparent text-stone border border-rule/60'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.6} />
                </span>

                {/* Name + description */}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3
                      className="font-display text-lg sm:text-xl font-medium tracking-tight text-ink leading-tight"
                      style={{ fontVariationSettings: '"SOFT" 30, "opsz" 22' }}
                    >
                      {template.name}
                    </h3>
                    {isPro && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brass-deep bg-brass-tint border border-brass/40 px-1.5 py-0.5 inline-flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-stone leading-relaxed mt-0.5">
                    {template.description}
                  </p>
                </div>

                {/* Right control — checkbox or pro arrow */}
                <span aria-hidden className="flex items-center justify-end">
                  {isPro ? (
                    <ArrowRight className="w-4 h-4 text-brass" strokeWidth={1.5} />
                  ) : (
                    <span
                      className={`flex items-center justify-center w-5 h-5 border transition-all ${
                        isSelected
                          ? 'border-brass bg-brass'
                          : 'border-rule bg-transparent'
                      }`}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 12 12" className="w-3 h-3 text-paper-light" aria-hidden>
                          <path
                            d="M2 6.5L5 9.5L10 3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                </span>

                {isSelected && (
                  <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[2px] bg-brass-bright" />
                )}
              </button>
            </li>
          );
        })}
      </motion.ol>

      {/* Footer actions */}
      <motion.div
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
      >
        <button
          onClick={handleFinish}
          disabled={selected.size === 0 || loading}
          className="btn-ink"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Composing&hellip;
            </>
          ) : (
            <>
              Launch workspace
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <button
          onClick={onSkip}
          disabled={loading}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone hover:text-ink transition-colors h-12 px-2 sm:px-4"
        >
          Skip for now
        </button>
        <p className="marginalia sm:ml-auto">
          ¶ {selected.size} agent{selected.size === 1 ? '' : 's'} ready
        </p>
      </motion.div>

      {paywallSlug && (
        <PaywallModal
          templateSlug={paywallSlug}
          onClose={() => setPaywallSlug(null)}
        />
      )}
    </motion.div>
  );
}
