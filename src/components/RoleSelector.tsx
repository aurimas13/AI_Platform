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
        className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-4 py-2 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        How will you use AI Gateway?
      </h2>
      <p className="text-neutral-400 text-lg mb-10">
        Select your primary role. We'll personalize your agent library.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
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
              className={`relative text-left p-6 rounded-xl border transition-all duration-300 group ${
                isSelected
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-600'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${
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

              <h3 className="text-base font-semibold mb-1">{role.label}</h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isSelected ? 'text-black/60' : 'text-neutral-500'
                }`}
              >
                {role.description}
              </p>

              <div
                className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? 'border-black bg-black'
                    : isHovered
                      ? 'border-neutral-500'
                      : 'border-neutral-700'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 h-12 bg-white text-black font-medium rounded-xl transition-all duration-200 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
