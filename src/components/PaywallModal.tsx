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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-600 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <Crown className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Unlock Enterprise Agents
            <br />
            <span className="text-amber-400">with Nexos Pro</span>
          </h2>
          <p className="text-neutral-400 text-sm max-w-xs mx-auto">
            This agent requires a Pro subscription. Upgrade to access premium AI agents and advanced features.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {['Unlimited premium agents', 'Priority processing', 'Advanced analytics'].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-sm text-neutral-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Upgrade button */}
        <button
          onClick={handleUpgrade}
          className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors duration-200"
        >
          Upgrade Now
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-xs text-neutral-600 hover:text-neutral-400 transition-colors py-2"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
