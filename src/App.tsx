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
      <div className="min-h-screen bg-cream-100 text-stone-900 flex items-center justify-center px-6">
        <div className="text-center animate-fade-in max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-card flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-stone-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Blank chat interface
          </h1>
          <p className="text-stone-600 text-base sm:text-lg max-w-sm mx-auto mb-6">
            Variant A (Control) &mdash; the unguided baseline. This is what most AI platforms ship today.
          </p>
          <div className="w-full max-w-md mx-auto h-64 bg-white border border-stone-200 shadow-card rounded-xl flex items-center justify-center">
            <p className="text-stone-400 text-sm">Empty chat &mdash; users churn here.</p>
          </div>
          <button
            onClick={() => { setShowBlankChat(false); setStep('email'); }}
            className="mt-8 text-sm text-brass-600 hover:text-brass-700 font-medium transition-colors"
          >
            &larr; Try the guided experience (Variant B)
          </button>
        </div>
      </div>
    );
  }

  if (done && !showModal) {
    return (
      <div className="min-h-screen bg-cream-100 text-stone-900 flex items-center justify-center px-6">
        <div className="text-center animate-fade-in max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            You&apos;re all set
          </h1>
          <p className="text-stone-600 text-base sm:text-lg max-w-sm mx-auto mb-6">
            Your workspace is being configured. We&apos;ll send a confirmation to{' '}
            <span className="text-stone-900 font-medium">{email}</span>.
          </p>
          {invitedEmail && (
            <p className="text-stone-600 text-sm max-w-sm mx-auto mb-6">
              Invite sent to <span className="text-stone-900 font-medium">{invitedEmail}</span>.
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Provisioning your agents…
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/case-study"
              className="px-5 h-11 inline-flex items-center justify-center gap-2 bg-stone-900 text-cream-50 text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors"
            >
              Read the case study &rarr;
            </a>
            <a
              href="/metrics"
              className="px-5 h-11 inline-flex items-center justify-center gap-2 bg-white text-stone-900 text-sm font-medium rounded-xl border border-stone-200 shadow-card hover:shadow-card-hover hover:border-stone-300 transition-all"
            >
              View live metrics
            </a>
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
