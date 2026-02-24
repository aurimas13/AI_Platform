import { Hexagon } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <Hexagon className="w-7 h-7 text-white" strokeWidth={1.5} />
          <span className="text-lg font-semibold tracking-tight">nexos.ai</span>
        </div>
        <StepIndicator total={steps.length} current={currentIndex} />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-2xl animate-fade-in">{children}</div>
      </main>

      <footer className="px-6 py-5 sm:px-10 text-center">
        <p className="text-xs text-neutral-500">
          &copy; 2026 nexos.ai &middot; Enterprise AI Platform
        </p>
      </footer>
    </div>
  );
}
