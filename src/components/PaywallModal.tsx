import { useEffect } from 'react';
import { X, Crown, Zap } from 'lucide-react';
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-stone-200 shadow-card-lg rounded-2xl p-6 sm:p-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brass-100 border border-brass-200 flex items-center justify-center mx-auto mb-5">
            <Crown className="w-7 h-7 text-brass-600" strokeWidth={1.75} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2 text-stone-900">
            Unlock enterprise agents
            <br />
            <span className="text-brass-600">with AI Gateway Pro</span>
          </h2>
          <p className="text-stone-600 text-sm max-w-xs mx-auto">
            This agent is part of our Pro plan. Upgrade to access premium agents and advanced features.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2.5 mb-6 sm:mb-8 bg-cream-100 rounded-xl p-4 border border-stone-200">
          {['Unlimited premium agents', 'Priority processing', 'Advanced analytics & SSO'].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-brass-600 flex-shrink-0" strokeWidth={1.75} />
              <span className="text-sm text-stone-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Upgrade button */}
        <button
          onClick={handleUpgrade}
          className="w-full h-12 bg-brass-600 hover:bg-brass-700 text-cream-50 font-semibold rounded-xl transition-colors duration-200 shadow-card hover:shadow-card-hover"
        >
          Upgrade now
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-xs text-stone-500 hover:text-stone-900 transition-colors py-2"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
