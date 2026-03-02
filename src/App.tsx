import { useState } from 'react';
import type { OnboardingStep, Role } from './types/onboarding';
import type { ABVariant } from './components/EmailSignup';
import { supabase } from './lib/supabase';
import OnboardingLayout from './components/OnboardingLayout';
import EmailSignup from './components/EmailSignup';
import RoleSelector from './components/RoleSelector';
import TemplateLibrary from './components/TemplateLibrary';
import SuccessModal from './components/SuccessModal';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<OnboardingStep>('email');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [done, setDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState('');
  const [variant, setVariant] = useState<ABVariant>('B');
  const [showBlankChat, setShowBlankChat] = useState(false);

  const handleEmailSubmit = async (submittedEmail: string, v: ABVariant) => {
    try {
      await supabase.from('onboarding_signups').upsert(
        { email: submittedEmail },
        { onConflict: 'email' }
      );
    } catch {
      // DB unavailable — continue without persistence
    }
    setEmail(submittedEmail);

    if (v === 'A') {
      setShowBlankChat(true);
    } else {
      setStep('role');
    }
  };

  const handleRoleSelect = async (selectedRole: Role) => {
    try {
      await supabase
        .from('onboarding_signups')
        .update({ role: selectedRole })
        .eq('email', email);
    } catch {
      // DB unavailable
    }
    setRole(selectedRole);
    setStep('templates');
  };

  const handleFinish = async (templates: string[]) => {
    try {
      await supabase
        .from('onboarding_signups')
        .update({
          selected_templates: templates,
          completed_at: new Date().toISOString(),
        })
        .eq('email', email);
    } catch {
      // DB unavailable
    }
    setDone(true);
    setShowModal(true);
  };

  const handleSkip = () => {
    setDone(true);
  };

  if (showBlankChat) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-neutral-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Blank Chat Interface
          </h1>
          <p className="text-neutral-500 text-lg max-w-sm mx-auto mb-6">
            Variant A (Control) — no guided onboarding.
          </p>
          <div className="w-full max-w-md mx-auto h-64 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-center justify-center">
            <p className="text-neutral-600 text-sm">Chat interface placeholder</p>
          </div>
        </div>
      </div>
    );
  }

  if (done && !showModal) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            You're all set
          </h1>
          <p className="text-neutral-400 text-lg max-w-sm mx-auto mb-8">
            Your workspace is being configured. We'll send a confirmation to{' '}
            <span className="text-white">{email}</span>.
          </p>
          {invitedEmail && (
            <p className="text-neutral-400 text-sm max-w-sm mx-auto mb-8">
              Invite sent to <span className="text-white">{invitedEmail}</span>.
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Provisioning agents...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingLayout step={step}>
        {step === 'email' && (
          <EmailSignup
            onSubmit={handleEmailSubmit}
            variant={variant}
            onVariantChange={setVariant}
          />
        )}
        {step === 'role' && (
          <RoleSelector
            onSelect={handleRoleSelect}
            onBack={() => setStep('email')}
          />
        )}
        {step === 'templates' && role && (
          <TemplateLibrary
            role={role}
            onFinish={handleFinish}
            onSkip={handleSkip}
            onBack={() => setStep('role')}
          />
        )}
      </OnboardingLayout>

      {showModal && (
        <SuccessModal
          email={email}
          onClose={(invited) => {
            if (invited) setInvitedEmail(invited);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
