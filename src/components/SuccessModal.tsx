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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={() => onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-neutral-600 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            {sent ? (
              <Check className="w-7 h-7 text-emerald-400" strokeWidth={1.5} />
            ) : (
              <Sparkles className="w-7 h-7 text-emerald-400" strokeWidth={1.5} />
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {sent ? 'Invite Sent!' : 'You\'re all set'}
          </h2>
          <p className="text-neutral-400 text-sm max-w-xs mx-auto">
            {sent
              ? 'Your teammate will receive an invitation shortly.'
              : (
                <>
                  Your workspace is ready. We'll send a confirmation to{' '}
                  <span className="text-white">{email}</span>.
                </>
              )}
          </p>
        </div>

        {/* Provisioning indicator */}
        {!sent && (
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-600 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Provisioning agents...
          </div>
        )}

        {/* Invite section */}
        {!sent && (
          <div className="border-t border-neutral-800 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-neutral-300">Invite your team</h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              AI agents work better with your whole team. Send an invite to get started together.
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
                  className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-xl px-4 pr-12 text-white placeholder-neutral-600 text-sm outline-none transition-all duration-200 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white text-black rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-xs text-red-400 animate-fade-in">{error}</p>
              )}
            </form>

            <button
              onClick={() => onClose()}
              className="w-full mt-4 text-xs text-neutral-600 hover:text-neutral-400 transition-colors py-2"
            >
              Skip — I'll invite later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
