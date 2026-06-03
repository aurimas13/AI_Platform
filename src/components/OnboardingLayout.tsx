import { ArrowLeft } from 'lucide-react';
import type { OnboardingStep } from '../types/onboarding';
import StepIndicator from './StepIndicator';

interface OnboardingLayoutProps {
  step: OnboardingStep;
  children: React.ReactNode;
}

const steps: OnboardingStep[] = ['email', 'role', 'templates'];

/**
 * Editorial frame for the onboarding journey. Hairline gold rule masthead,
 * generous vertical rhythm, marginalia-style metadata at the foot.
 */
export default function OnboardingLayout({ step, children }: OnboardingLayoutProps) {
  const currentIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen flex flex-col text-ink">
      {/* Masthead */}
      <header className="relative z-30 sticky top-0 backdrop-blur-md bg-paper/80">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-10 py-3.5">
          {/* Left: brand cluster */}
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <a
              href="https://aurimas.io"
              className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-stone hover:text-ink transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3 h-3" />
              aurimas.io
            </a>
            <span className="hidden sm:block w-px h-4 bg-rule/70" />
            <a href="/" className="flex items-center gap-2.5 min-w-0 group">
              <svg viewBox="0 0 32 32" className="w-7 h-7 flex-shrink-0 transition-transform group-hover:rotate-[60deg] duration-700 ease-out" aria-hidden>
                <defs>
                  <linearGradient id="hex-foil-onboard" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#E8CD8B" />
                    <stop offset="1" stopColor="#9C6A1F" />
                  </linearGradient>
                </defs>
                <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="url(#hex-foil-onboard)" />
              </svg>
              <span className="flex flex-col leading-none min-w-0">
                <span
                  className="font-display text-[1.05rem] sm:text-[1.15rem] font-semibold tracking-tight truncate text-ink"
                  style={{ fontVariationSettings: '"SOFT" 30, "opsz" 14' }}
                >
                  AI Gateway
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-brass mt-0.5">
                  Atelier · MMXXVI
                </span>
              </span>
            </a>
          </div>

          {/* Right: progress */}
          <StepIndicator total={steps.length} current={currentIndex} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-rule/70" />
      </header>

      {/* Body — generous editorial whitespace */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-10 sm:py-20 overflow-y-auto">
        <div className="w-full max-w-2xl">{children}</div>
      </main>

      {/* Foot — marginalia-style metadata + hairline rule */}
      <footer className="relative px-4 sm:px-10 py-7 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-rule/60" />
        <p className="marginalia">
          <span className="text-stone">© MMXXVI · AI Gateway</span>
          <span className="mx-2 text-rule">|</span>
          <span className="text-stone">PLG case study</span>
          <span className="mx-2 text-rule">|</span>
          <a href="/case-study" className="text-brass hover:text-brass-deep transition-colors">
            Read essay
          </a>
          <span className="mx-2 text-rule">|</span>
          <a
            href="https://github.com/aurimas13/AI_Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone hover:text-ink transition-colors"
          >
            Source
          </a>
        </p>
      </footer>
    </div>
  );
}
