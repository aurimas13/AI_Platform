import { Hexagon, ArrowLeft } from 'lucide-react';
import type { OnboardingStep } from '../types/onboarding';
import StepIndicator from './StepIndicator';

interface OnboardingLayoutProps {
  step: OnboardingStep;
  children: React.ReactNode;
}

const steps: OnboardingStep[] = ['email', 'role', 'templates'];

export default function OnboardingLayout({ step, children }: OnboardingLayoutProps) {
  const currentIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5 border-b border-stone-200/60 backdrop-blur-sm bg-cream-100/80 sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <a
            href="https://aurimas.io"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">aurimas.io</span>
            <span className="sm:hidden">Back</span>
          </a>
          <div className="w-px h-4 bg-stone-300" />
          <div className="flex items-center gap-2 min-w-0">
            <Hexagon className="w-6 h-6 sm:w-7 sm:h-7 text-brass-600 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-base sm:text-lg font-semibold tracking-tight truncate">AI Gateway</span>
          </div>
        </div>
        <StepIndicator total={steps.length} current={currentIndex} />
      </header>

      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 sm:py-16 overflow-y-auto">
        <div className="w-full max-w-2xl animate-fade-in">{children}</div>
      </main>

      <footer className="px-4 sm:px-10 py-6 text-center border-t border-stone-200/60">
        <p className="text-xs text-stone-500">
          &copy; 2026 AI Gateway &middot; PLG Onboarding PoC &middot;{' '}
          <a href="/case-study" className="text-brass-600 hover:text-brass-700 font-medium transition-colors">
            Case Study
          </a>{' '}&middot;{' '}
          <a
            href="https://github.com/aurimas13/AI_Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
