import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { trackFunnelEvent } from '../lib/analytics';

export type ABVariant = 'A' | 'B';

interface EmailSignupProps {
  onSubmit: (email: string, variant: ABVariant) => Promise<void>;
  variant: ABVariant;
  onVariantChange: (v: ABVariant) => void;
}

const reveal = {
  hidden: { opacity: 0, y: 14, filter: 'blur(2px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
      className="relative"
    >
      {/* Editorial folio rule */}
      <motion.div variants={reveal} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-7">
        <span className="silcrow">§ 01 · the prologue</span>
        <span className="flex-1 h-px bg-rule/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-mute">
          Folio I
        </span>
      </motion.div>

      {/* Display headline — Fraunces variable with SOFT */}
      <motion.h1
        variants={reveal}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-[2.6rem] sm:text-[3.6rem] md:text-[4.4rem] font-medium leading-[0.98] tracking-tight text-ink mb-6"
        style={{ fontVariationSettings: '"SOFT" 50, "opsz" 110' }}
      >
        Build AI agents
        <br />
        <em
          className="italic font-normal text-brass"
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 110, "wght" 500' }}
        >
          for your atelier
        </em>
        <span className="text-brass-bright">.</span>
      </motion.h1>

      {/* Lede paragraph */}
      <motion.p
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-sans text-base sm:text-lg text-stone leading-relaxed max-w-xl mb-12"
      >
        Purpose-built AI deployed across every department of your team. Begin with your work email&mdash;the door opens in under a minute.
      </motion.p>

      {/* Email form — editorial input with hairline + ink button */}
      <motion.form
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit}
        className="max-w-xl"
      >
        <label htmlFor="email" className="block eyebrow mb-2">
          Your work email
        </label>
        <div className="relative group">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="firstname@yourcompany.com"
            disabled={loading}
            className="w-full h-14 bg-paper-light border border-rule px-4 pr-16 font-sans text-[1rem] text-ink placeholder-stone-mute outline-none transition-all duration-200 focus:border-brass focus:bg-paper-light focus:ring-1 focus:ring-brass/30 rounded-none"
          />
          <button
            type="submit"
            disabled={loading}
            aria-label="Continue"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-ink text-paper-light flex items-center justify-center transition-all duration-300 hover:bg-brass-deep group-focus-within:bg-brass-deep disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-mono text-[11px] uppercase tracking-widest text-vermilion"
          >
            ⌐ {error}
          </motion.p>
        )}
      </motion.form>

      {/* Footer marginalia row */}
      <motion.div
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-xl marginalia"
      >
        By continuing you agree to our{' '}
        <span className="text-stone underline decoration-rule underline-offset-2">Terms</span>
        {' & '}
        <span className="text-stone underline decoration-rule underline-offset-2">Privacy</span>.
      </motion.div>

      {/* A/B variant toggle — editorial chip with mono labels */}
      <motion.div
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-12 max-w-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-b border-rule/60 bg-paper-light/40">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
            ◇ A/B simulator · live experiment
          </span>
          <div className="inline-flex items-center bg-paper-light border border-rule">
            <button
              type="button"
              onClick={() => onVariantChange('A')}
              aria-pressed={variant === 'A'}
              className={`px-3 h-7 font-mono text-[10px] uppercase tracking-widest transition-all ${
                variant === 'A'
                  ? 'bg-ink text-paper-light'
                  : 'text-stone hover:text-ink'
              }`}
            >
              A · Control
            </button>
            <span className="w-px h-7 bg-rule" aria-hidden />
            <button
              type="button"
              onClick={() => onVariantChange('B')}
              aria-pressed={variant === 'B'}
              className={`px-3 h-7 font-mono text-[10px] uppercase tracking-widest transition-all ${
                variant === 'B'
                  ? 'bg-brass text-paper-light'
                  : 'text-stone hover:text-ink'
              }`}
            >
              B · Guided
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footnote — case study link */}
      <motion.p
        variants={reveal}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 max-w-xl marginalia"
      >
        <span className="text-brass">¹</span>{' '}
        A live PM case study, built from scratch&mdash;solving the cold-start problem in AI platforms.{' '}
        <a
          href="/case-study"
          className="text-ink font-medium underline decoration-brass underline-offset-4 hover:decoration-brass-bright transition-colors whitespace-nowrap"
        >
          Read the essay →
        </a>
      </motion.p>
    </motion.div>
  );
}
