import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { trackFunnelEvent } from '../lib/analytics';

interface PaywallModalProps {
  templateSlug: string;
  onClose: () => void;
}

export default function PaywallModal({ templateSlug, onClose }: PaywallModalProps) {
  useEffect(() => {
    trackFunnelEvent({ event: 'paywall_viewed', template_slug: templateSlug });
  }, [templateSlug]);

  const handleUpgrade = () => {
    trackFunnelEvent({ event: 'upgrade_intent_clicked', template_slug: templateSlug });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-paper-light border border-rule shadow-press-hover p-7 sm:p-9"
      >
        {/* Hairline brass frame */}
        <div className="absolute inset-2 border border-brass/30 pointer-events-none" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-stone hover:text-ink transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Folio mark */}
        <div className="text-center mb-7">
          <p className="silcrow justify-center mb-5">§ Pro tier · Folio</p>

          {/* Brass-foil seal */}
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 56 56" className="w-14 h-14" aria-hidden>
              <defs>
                <linearGradient id="seal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E8CD8B" />
                  <stop offset="1" stopColor="#9C6A1F" />
                </linearGradient>
              </defs>
              <polygon
                points="28,4 50,16 50,40 28,52 6,40 6,16"
                fill="url(#seal)"
              />
              <polygon
                points="28,12 44,20 44,36 28,44 12,36 12,20"
                fill="none"
                stroke="#1C1714"
                strokeOpacity="0.3"
                strokeWidth="0.8"
              />
              <text
                x="28"
                y="32"
                textAnchor="middle"
                fontFamily="serif"
                fontSize="14"
                fontStyle="italic"
                fontWeight="600"
                fill="#1C1714"
              >
                ★
              </text>
            </svg>
          </div>

          <h2
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink mb-3 leading-[1.0]"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 40' }}
          >
            A premium{' '}
            <em
              className="italic text-brass"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 40' }}
            >
              instrument
            </em>
            .
          </h2>
          <p className="font-sans text-sm text-stone leading-relaxed max-w-xs mx-auto">
            This agent is reserved for Pro members. Upgrade to unlock the full library and advanced features.
          </p>
        </div>

        {/* Features list — printed catalogue */}
        <div className="border-t border-b border-rule mb-7">
          {[
            'Unlimited premium agents',
            'Priority response queue',
            'Advanced analytics & SSO',
          ].map((feature, i) => (
            <div
              key={feature}
              className={`flex items-baseline gap-3 px-2 py-3 ${i > 0 ? 'border-t border-rule/60' : ''}`}
            >
              <span className="font-mono text-[11px] tabular-nums tracking-widest text-brass-bright">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-sans text-sm text-ink">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          className="btn-ink w-full"
        >
          Upgrade to Pro
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-stone hover:text-ink transition-colors py-2"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  );
}
