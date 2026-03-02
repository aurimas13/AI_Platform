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
      <div className="mb-3">
        <span className="inline-block px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-neutral-400 border border-neutral-800 rounded-full">
          Get Started
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
        Build AI agents<br />for your team
      </h1>

      <p className="text-neutral-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
        Deploy purpose-built AI across every department. Start with your work email.
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
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-xl px-5 pr-14 text-white placeholder-neutral-600 text-base outline-none transition-all duration-200 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400 animate-fade-in">{error}</p>
        )}
      </form>

      <p className="mt-8 text-xs text-neutral-600 max-w-sm mx-auto">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>

      {/* A/B Test Toggle */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-neutral-700">
          Simulate A/B Test Variant
        </span>
        <button
          type="button"
          onClick={() => onVariantChange(variant === 'B' ? 'A' : 'B')}
          className="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ backgroundColor: variant === 'B' ? '#059669' : '#525252' }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200"
            style={{ transform: variant === 'B' ? 'translateX(20px)' : 'translateX(0)' }}
          />
        </button>
        <span className="text-[10px] text-neutral-500 w-28 text-left">
          {variant === 'A' ? 'Variant A (Control)' : 'Variant B (Guided)'}
        </span>
      </div>
    </div>
  );
}
