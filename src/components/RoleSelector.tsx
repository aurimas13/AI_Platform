import { useState } from 'react';
import {
  Megaphone,
  Code2,
  Scale,
  Users,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import type { Role, RoleOption } from '../types/onboarding';
import { roleOptions } from '../data/templates';
import { trackFunnelEvent } from '../lib/analytics';

const iconMap: Record<string, React.ElementType> = {
  Megaphone,
  Code2,
  Scale,
  Users,
};

interface RoleSelectorProps {
  onSelect: (role: Role) => void;
  onBack: () => void;
}

export default function RoleSelector({ onSelect, onBack }: RoleSelectorProps) {
  const [hovered, setHovered] = useState<Role | null>(null);
  const [selected, setSelected] = useState<Role | null>(null);

  const handleContinue = () => {
    if (selected) onSelect(selected);
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
        How will you use AI Gateway?
      </h2>
      <p className="text-stone-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-lg">
        Pick your primary role and we&apos;ll tailor your agent library to match.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {roleOptions.map((role: RoleOption) => {
          const Icon = iconMap[role.icon];
          const isSelected = selected === role.id;
          const isHovered = hovered === role.id;

          return (
            <button
              key={role.id}
              onClick={() => {
                setSelected(role.id);
                trackFunnelEvent({ event: 'role_selected', role_selected: role.id });
              }}
              onMouseEnter={() => setHovered(role.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative text-left p-5 sm:p-6 rounded-xl border transition-all duration-200 group ${
                isSelected
                  ? 'bg-stone-900 text-cream-50 border-stone-900 shadow-card-lg'
                  : 'bg-white border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${
                  isSelected ? 'bg-cream-50/10' : 'bg-brass-50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isSelected ? 'text-brass-300' : 'text-brass-600'
                  }`}
                  strokeWidth={1.75}
                />
              </div>

              <h3 className="text-base font-semibold mb-1">{role.label}</h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isSelected ? 'text-cream-50/70' : 'text-stone-600'
                }`}
              >
                {role.description}
              </p>

              <div
                className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? 'border-cream-50 bg-cream-50'
                    : isHovered
                      ? 'border-brass-400'
                      : 'border-stone-300'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-stone-900" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 h-12 bg-stone-900 text-cream-50 font-medium rounded-xl transition-all duration-200 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-stone-900 shadow-card hover:shadow-card-hover"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
