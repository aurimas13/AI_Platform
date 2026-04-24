import { useState } from 'react';
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
  Check,
  Loader2,
  Sparkles,
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

export default function TemplateLibrary({ role, onFinish, onSkip, onBack }: TemplateLibraryProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [paywallSlug, setPaywallSlug] = useState<string | null>(null);

  const templates = templatesByRole[role];
  const roleLabel = roleOptions.find((r) => r.id === role)?.label ?? role;

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
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
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 bg-white border border-stone-200 shadow-card rounded-lg px-4 py-2 transition-all hover:shadow-card-hover hover:border-stone-300 mb-6 sm:mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 text-stone-900">
        Your agent library
      </h2>

      <p className="text-stone-600 text-base sm:text-lg mb-2 max-w-lg">
        Curated for <span className="text-stone-900 font-semibold">{roleLabel}</span>. Select the agents you want to activate.
      </p>
      <p className="text-stone-500 text-sm mb-8 sm:mb-10">
        {selected.size} of {templates.length} selected
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {templates.map((template: Template) => {
          const Icon = iconMap[template.icon] ?? Sparkles;
          const isSelected = selected.has(template.slug);
          const isPro = PRO_TEMPLATES.has(template.slug);

          return (
            <button
              key={template.slug}
              onClick={() => {
                if (isPro) {
                  setPaywallSlug(template.slug);
                  return;
                }
                toggle(template.slug);
                trackFunnelEvent({ event: 'template_clicked', template_slug: template.slug });
              }}
              className={`relative text-left p-5 sm:p-6 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-stone-900 text-cream-50 border-stone-900 shadow-card-lg'
                  : 'bg-white border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    isSelected ? 'bg-cream-50/10' : isPro ? 'bg-brass-100' : 'bg-brass-50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isSelected ? 'text-brass-300' : 'text-brass-600'
                    }`}
                    strokeWidth={1.75}
                  />
                </div>

                {isPro ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brass-600 text-cream-50 rounded-md shadow-sm">
                    Pro
                  </span>
                ) : (
                  <div
                    className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? 'border-cream-50 bg-cream-50'
                        : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-stone-900" />}
                  </div>
                )}
              </div>

              <h3 className="text-base font-semibold mb-1.5">{template.name}</h3>
              <p
                className={`text-sm leading-relaxed transition-colors duration-300 ${
                  isSelected ? 'text-cream-50/70' : 'text-stone-600'
                }`}
              >
                {template.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={handleFinish}
          disabled={selected.size === 0 || loading}
          className="flex items-center justify-center gap-2 px-8 h-12 bg-stone-900 text-cream-50 font-medium rounded-xl transition-all duration-200 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-stone-900 shadow-card hover:shadow-card-hover"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up&hellip;
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
          className="text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors h-12 px-4"
        >
          Skip for now
        </button>
      </div>
      {paywallSlug && (
        <PaywallModal
          templateSlug={paywallSlug}
          onClose={() => setPaywallSlug(null)}
        />
      )}
    </div>
  );
}
