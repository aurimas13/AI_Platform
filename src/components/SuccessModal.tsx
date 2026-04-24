import { useState } from 'react';
import { Sparkles, X, Send, Loader2, Check, UserPlus } from 'lucide-react';
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
      setError('Enter a teammate\'s email.');
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

    setTimeout(() => {
      onClose(inviteEmail.trim().toLowerCase());
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
        onClick={() => onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-stone-200 shadow-card-lg rounded-2xl p-6 sm:p-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={() => onClose()}
          aria-label="Close"
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
            {sent ? (
              <Check className="w-7 h-7 text-emerald-600" strokeWidth={1.75} />
            ) : (
              <Sparkles className="w-7 h-7 text-emerald-600" strokeWidth={1.75} />
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2 text-stone-900">
            {sent ? 'Invite sent' : 'You\u2019re all set'}
          </h2>
          <p className="text-stone-600 text-sm max-w-xs mx-auto">
            {sent
              ? 'Your teammate will receive an invitation shortly.'
              : (
                <>
                  Your workspace is being configured. We&apos;ll send a confirmation to{' '}
                  <span className="text-stone-900 font-medium">{email}</span>.
                </>
              )}
          </p>
        </div>

        {/* Provisioning indicator */}
        {!sent && (
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-6 sm:mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Provisioning your agents&hellip;
          </div>
        )}

        {/* Invite section */}
        {!sent && (
          <div className="border-t border-stone-200 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-brass-600" strokeWidth={1.75} />
              <h3 className="text-sm font-semibold text-stone-900">Invite your team</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              AI agents work better when your whole team is on board. Send an invite to get started together.
            </p>

            <form onSubmit={handleSendInvite}>
              <div className="relative group">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="teammate@company.com"
                  className="w-full h-12 bg-cream-50 border border-stone-200 rounded-xl px-4 pr-12 text-stone-900 placeholder-stone-400 text-sm outline-none transition-all duration-200 focus:border-brass-400 focus:ring-2 focus:ring-brass-200 focus:bg-white"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending}
                  aria-label="Send invite"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-stone-900 text-cream-50 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-xs text-red-600 animate-fade-in">{error}</p>
              )}
            </form>

            <button
              onClick={() => onClose()}
              className="w-full mt-4 text-xs text-stone-500 hover:text-stone-900 transition-colors py-2"
            >
              Skip &mdash; I&apos;ll invite later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
