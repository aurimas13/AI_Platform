interface StepIndicatorProps {
  total: number;
  current: number;
  labels?: string[];
}

/**
 * Editorial step indicator. Numbered roman-style sections with hairline
 * connectors. Past steps in brass; current in ink+brass underline; future
 * in stone. Fully accessible — uses an ordered list semantically.
 */
export default function StepIndicator({
  total,
  current,
  labels = ['Sign in', 'Choose role', 'Pick agents'],
}: StepIndicatorProps) {
  return (
    <ol
      className="flex items-center gap-2 sm:gap-3"
      aria-label="Onboarding progress"
    >
      {Array.from({ length: total }).map((_, i) => {
        const past = i < current;
        const now = i === current;
        const label = labels[i] ?? `Step ${i + 1}`;
        const num = String(i + 1).padStart(2, '0');

        return (
          <li
            key={i}
            className="flex items-center gap-1.5 sm:gap-2"
            aria-current={now ? 'step' : undefined}
          >
            <span
              className={`font-mono text-[10px] sm:text-[11px] tabular-nums tracking-widest transition-colors duration-500 ${
                past
                  ? 'text-brass'
                  : now
                    ? 'text-brass-bright'
                    : 'text-stone-mute'
              }`}
            >
              {num}
            </span>
            <span
              className={`hidden sm:inline font-sans text-[12px] tracking-tight transition-colors duration-500 ${
                past
                  ? 'text-stone'
                  : now
                    ? 'text-ink font-medium'
                    : 'text-stone-mute'
              }`}
            >
              {label}
            </span>
            {/* Hairline rule between segments */}
            {i < total - 1 && (
              <span
                aria-hidden
                className={`block h-px w-4 sm:w-8 transition-colors duration-500 ${
                  past
                    ? 'bg-brass-bright'
                    : now
                      ? 'bg-gradient-to-r from-brass-bright to-rule'
                      : 'bg-rule/60'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
