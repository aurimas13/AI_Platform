import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Code2, Scale, Users, ArrowRight, ArrowLeft } from 'lucide-react';
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

const reveal = {
  hidden: { opacity: 0, y: 14, filter: 'blur(2px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export default function RoleSelector({ onSelect, onBack }: RoleSelectorProps) {
  const [selected, setSelected] = useState<Role | null>(null);
  const [hovered, setHovered] = useState<Role | null>(null);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
    >
      {/* Back link */}
      <motion.button
        variants={reveal}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={onBack}
        className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-stone hover:text-ink transition-colors mb-10"
      >
        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
        Back to prologue
      </motion.button>

      {/* Editorial folio rule */}
      <motion.div
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-7"
      >
        <span className="silcrow">§ 02 · the role</span>
        <span className="flex-1 h-px bg-rule/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-mute">
          Folio II
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        variants={reveal}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-[2.4rem] sm:text-[3.2rem] md:text-[3.8rem] font-medium leading-[0.98] tracking-tight text-ink mb-5"
        style={{ fontVariationSettings: '"SOFT" 50, "opsz" 100' }}
      >
        Who&rsquo;s at the{' '}
        <em className="italic font-normal text-brass" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 100' }}>
          workbench
        </em>
        ?
      </motion.h2>

      <motion.p
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-sans text-base sm:text-lg text-stone leading-relaxed max-w-xl mb-10"
      >
        Pick your craft and we&rsquo;ll set out the agents most useful to it. You can change everything later.
      </motion.p>

      {/* Indexed list — vertical, editorial, full-width hover reveal */}
      <motion.ol
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="border-t border-b border-rule mb-10"
      >
        {roleOptions.map((role: RoleOption, i) => {
          const Icon = iconMap[role.icon];
          const isSelected = selected === role.id;
          const isHovered = hovered === role.id;
          const num = String(i + 1).padStart(2, '0');

          return (
            <li key={role.id} className={i > 0 ? 'border-t border-rule/60' : ''}>
              <button
                onClick={() => {
                  setSelected(role.id);
                  trackFunnelEvent({ event: 'role_selected', role_selected: role.id });
                }}
                onMouseEnter={() => setHovered(role.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative w-full text-left grid grid-cols-[3rem_2.5rem_1fr_2rem] sm:grid-cols-[3.5rem_3rem_1fr_2rem] items-center gap-3 sm:gap-5 py-5 sm:py-6 px-2 sm:px-4 transition-colors duration-300 group ${
                  isSelected ? 'bg-brass-tint/40' : 'hover:bg-paper-light/60'
                }`}
              >
                {/* Index number */}
                <span
                  className={`font-mono text-[12px] tabular-nums tracking-widest transition-colors ${
                    isSelected
                      ? 'text-brass-deep'
                      : isHovered
                        ? 'text-brass'
                        : 'text-stone-mute'
                  }`}
                >
                  {num}
                </span>

                {/* Icon glyph */}
                <span
                  className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 ${
                    isSelected
                      ? 'bg-ink text-brass-foil'
                      : isHovered
                        ? 'bg-paper-light text-brass border border-brass/40'
                        : 'bg-transparent text-stone border border-rule/60'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.6} />
                </span>

                {/* Title + description */}
                <div className="min-w-0">
                  <h3
                    className={`font-display text-xl sm:text-2xl font-medium tracking-tight leading-tight transition-colors ${
                      isSelected ? 'text-ink' : 'text-ink'
                    }`}
                    style={{ fontVariationSettings: '"SOFT" 30, "opsz" 24' }}
                  >
                    {role.label}
                  </h3>
                  <p
                    className={`font-sans text-sm leading-relaxed mt-1 transition-colors ${
                      isSelected ? 'text-stone' : isHovered ? 'text-stone' : 'text-stone-light'
                    }`}
                  >
                    {role.description}
                  </p>
                </div>

                {/* Selection caret */}
                <span
                  aria-hidden
                  className={`justify-self-end transition-all duration-300 ${
                    isSelected
                      ? 'text-brass-bright translate-x-0 opacity-100'
                      : isHovered
                        ? 'text-brass -translate-x-1 opacity-90'
                        : 'text-stone-mute -translate-x-2 opacity-40'
                  }`}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                </span>

                {/* Brass left edge mark when selected */}
                {isSelected && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-[2px] bg-brass-bright"
                  />
                )}
              </button>
            </li>
          );
        })}
      </motion.ol>

      {/* Continue */}
      <motion.div
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
      >
        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className="btn-ink"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="marginalia">
          {selected ? (
            <>
              <span className="text-brass">●</span> Selection logged. Press continue to compose your library.
            </>
          ) : (
            <>
              <span className="text-stone-mute">○</span> Choose a role to proceed.
            </>
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}
