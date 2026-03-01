import { useState } from 'react';
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

export default function TemplateLibrary({ role, onFinish, onSkip, onBack }: TemplateLibraryProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

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
        className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-4 py-2 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back
      </button>

      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Your Agent Library
        </h2>
      </div>

      <p className="text-neutral-400 text-lg mb-2">
        Curated for <span className="text-white font-medium">{roleLabel}</span>. Select the agents you want to activate.
      </p>
      <p className="text-neutral-600 text-sm mb-10">
        {selected.size} of {templates.length} selected
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {templates.map((template: Template) => {
          const Icon = iconMap[template.icon] ?? Sparkles;
          const isSelected = selected.has(template.slug);

          return (
            <button
              key={template.slug}
              onClick={() => {
                toggle(template.slug);
                trackFunnelEvent({ event: 'template_clicked', template_slug: template.slug });
              }}
              className={`relative text-left p-6 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    isSelected ? 'bg-black/10' : 'bg-neutral-800'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isSelected ? 'text-black' : 'text-neutral-400'
                    }`}
                    strokeWidth={1.5}
                  />
                </div>

                <div
                  className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                    isSelected
                      ? 'border-black bg-black'
                      : 'border-neutral-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>

              <h3 className="text-base font-semibold mb-1.5">{template.name}</h3>
              <p
                className={`text-sm leading-relaxed transition-colors duration-300 ${
                  isSelected ? 'text-black/60' : 'text-neutral-500'
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
          className="flex items-center justify-center gap-2 px-8 h-12 bg-white text-black font-medium rounded-xl transition-all duration-200 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              Launch Workspace
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          disabled={loading}
          className="text-sm text-neutral-500 hover:text-white transition-colors h-12 px-4"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
