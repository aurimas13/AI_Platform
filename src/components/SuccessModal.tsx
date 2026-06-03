import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Loader2, Check, UserPlus } from 'lucide-react';
import { trackFunnelEvent } from '../lib/analytics';

interface SuccessModalProps {
  email: string;
  onClose: (invitedEmail?: string) => void;
}

export default function SuccessModal({ email, onClose }: SuccessModalProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!inviteEmail.trim()) {
      setError("Enter a teammate's email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    setSending(true);
    await trackFunnelEvent({
      event: 'team_invite_sent',
      invite_email: inviteEmail.trim().toLowerCase(),
    });
    setSending(false);
    setSent(true);
    setTimeout(() => onClose(inviteEmail.trim().toLowerCase()), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={() => onClose()}
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
          onClick={() => onClose()}
          aria-label="Close"
          className="absolute top-4 right-4 text-stone hover:text-ink transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Folio header */}
        <div className="text-center mb-6">
          <p className="silcrow justify-center mb-5">
            § {sent ? 'Fin.' : 'The aha'}
          </p>

          <h2
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink mb-3 leading-[1.0]"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 40' }}
          >
            {sent ? (
              <>
                Invite{' '}
                <em className="italic text-brass" style={{ fontVariationSettings: '"SOFT" 100' }}>
                  sent
                </em>
                .
              </>
            ) : (
              <>
                You&rsquo;re{' '}
                <em className="italic text-brass" style={{ fontVariationSettings: '"SOFT" 100' }}>
                  all set
                </em>
                .
              </>
            )}
          </h2>
          <p className="font-sans text-sm text-stone leading-relaxed max-w-xs mx-auto">
            {sent ? (
              'Your teammate will receive an invitation shortly.'
            ) : (
              <>
                Confirmation sent to{' '}
                <span className="text-ink font-medium underline decoration-brass underline-offset-4 decoration-1">
                  {email}
                </span>
                .
              </>
            )}
          </p>
        </div>

        {!sent && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone flex items-center justify-center gap-2 mb-7">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-brass-bright animate-ping opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brass-bright" />
            </span>
            Provisioning agents
          </p>
        )}

        {!sent && (
          <div className="border-t border-rule pt-6">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-4 h-4 text-brass" strokeWidth={1.6} />
              <h3
                className="font-display text-lg font-medium text-ink"
                style={{ fontVariationSettings: '"SOFT" 30, "opsz" 20' }}
              >
                Invite the team
              </h3>
            </div>
            <p className="font-sans text-sm text-stone leading-relaxed mb-4">
              An atelier works better with collaborators. Send an invitation to begin together.
            </p>

            <form onSubmit={handleSendInvite}>
              <div className="relative">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="teammate@company.com"
                  disabled={sending}
                  className="w-full h-12 bg-paper border border-rule px-4 pr-12 font-sans text-sm text-ink placeholder-stone-mute outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 transition-all rounded-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  aria-label="Send invite"
                  className="absolute right-1 top-1 h-10 w-10 bg-ink text-paper-light hover:bg-brass-deep flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {error && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
                  ⌐ {error}
                </p>
              )}
            </form>

            <button
              onClick={() => onClose()}
              className="w-full mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-stone hover:text-ink transition-colors py-2"
            >
              Skip — invite later
            </button>
          </div>
        )}

        {sent && (
          <div className="flex items-center justify-center pt-2">
            <span className="w-12 h-12 bg-brass-tint border border-brass flex items-center justify-center">
              <Check className="w-6 h-6 text-brass-deep" strokeWidth={1.5} />
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
