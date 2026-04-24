import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { trackFunnelEvent } from '../lib/analytics';

export type ABVariant = 'A' | 'B';

interface EmailSignupProps {
  onSubmit: (email: string, variant: ABVariant) => Promise<void>;
  variant: ABVariant;
  onVariantChange: (v: ABVariant) => void;
}

export default function EmailSignup({ onSubmit, variant, onVariantChange }: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    trackFunnelEvent({ event: 'signup_view', ab_variant: variant });
  }, [variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email.trim().toLowerCase(), variant);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      {/* Portfolio context banner */}
      <div className="mb-6 sm:mb-8 mx-auto max-w-lg bg-white border border-stone-200 shadow-card rounded-xl px-4 py-3">
        <p className="text-xs text-stone-600 leading-relaxed">
          <span className="text-brass-600 font-semibold">PM Case Study &middot;</span>{' '}
          A live prototype that solves the cold-start problem in AI platforms with role-based guided onboarding.{' '}
          <a
            href="/case-study"
            className="text-stone-900 font-medium underline underline-offset-2 decoration-brass-400 hover:decoration-brass-600 transition-colors whitespace-nowrap"
          >
            Read the case study &rarr;
          </a>
        </p>
      </div>

      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full">
          Get started
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-4 text-stone-900">
        Build AI agents<br />
        <span className="text-brass-600">for your team</span>
      </h1>

      <p className="text-stone-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
        Deploy purpose-built AI across every department. Start with your work email &mdash; setup takes under a minute.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="relative group">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="you@company.com"
            className="w-full h-14 bg-white border border-stone-200 shadow-card rounded-xl px-5 pr-14 text-stone-900 placeholder-stone-400 text-base outline-none transition-all duration-200 focus:border-brass-400 focus:ring-2 focus:ring-brass-200"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            aria-label="Continue"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-stone-900 text-cream-50 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 animate-fade-in">{error}</p>
        )}
      </form>

      <p className="mt-6 sm:mt-8 text-xs text-stone-500 max-w-sm mx-auto">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>

      {/* A/B Test Toggle */}
      <div className="mt-10 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/60 border border-stone-200 rounded-full px-4 py-2">
        <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">
          A/B test simulator
        </span>
        <button
          type="button"
          onClick={() => onVariantChange(variant === 'B' ? 'A' : 'B')}
          aria-label="Toggle A/B test variant"
          className="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brass-300"
          style={{ backgroundColor: variant === 'B' ? '#A87627' : '#A8A29E' }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm"
            style={{ transform: variant === 'B' ? 'translateX(20px)' : 'translateX(0)' }}
          />
        </button>
        <span className="text-[11px] text-stone-600 font-medium min-w-[7rem] text-left">
          {variant === 'A' ? 'Variant A (Control)' : 'Variant B (Guided)'}
        </span>
      </div>
    </div>
  );
}
