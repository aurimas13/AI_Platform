import { useState } from 'react';
import type { OnboardingStep, Role } from './types/onboarding';
import { supabase } from './lib/supabase';
import OnboardingLayout from './components/OnboardingLayout';
import EmailSignup from './components/EmailSignup';
import RoleSelector from './components/RoleSelector';
import TemplateLibrary from './components/TemplateLibrary';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<OnboardingStep>('email');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [done, setDone] = useState(false);

  const handleEmailSubmit = async (submittedEmail: string) => {
    try {
      await supabase.from('onboarding_signups').upsert(
        { email: submittedEmail },
        { onConflict: 'email' }
      );
    } catch {
      // DB unavailable — continue without persistence
    }
    setEmail(submittedEmail);
    setStep('role');
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
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            You're all set
          </h1>
          <p className="text-neutral-400 text-lg max-w-sm mx-auto mb-8">
            Your workspace is being configured. We'll send a confirmation to{' '}
            <span className="text-white">{email}</span>.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Provisioning agents...
          </div>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout step={step}>
      {step === 'email' && <EmailSignup onSubmit={handleEmailSubmit} />}
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
          onBack={() => setStep('role')}
        />
      )}
    </OnboardingLayout>
  );
}
