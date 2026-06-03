import { useState } from 'react';
import { motion } from 'framer-motion';
import type { OnboardingStep, Role } from './types/onboarding';
import type { ABVariant } from './components/EmailSignup';
import { supabase } from './lib/supabase';
import OnboardingLayout from './components/OnboardingLayout';
import EmailSignup from './components/EmailSignup';
import RoleSelector from './components/RoleSelector';
import TemplateLibrary from './components/TemplateLibrary';
import SuccessModal from './components/SuccessModal';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function App() {
  const [step, setStep] = useState<OnboardingStep>('email');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [done, setDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState('');
  const [variant, setVariant] = useState<ABVariant>('B');
  const [showBlankChat, setShowBlankChat] = useState(false);
  const [firstAgent, setFirstAgent] = useState<string | null>(null);

  const handleEmailSubmit = async (submittedEmail: string, v: ABVariant) => {
    try {
      await supabase.from('onboarding_signups').upsert(
        { email: submittedEmail },
        { onConflict: 'email' },
      );
    } catch {
      /* DB unavailable — continue without persistence */
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
      /* DB unavailable */
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
      /* DB unavailable */
    }
    if (templates.length > 0) setFirstAgent(templates[0]);
    setDone(true);
    setShowModal(true);
  };

  const handleSkip = () => setDone(true);

  /* ============ Blank-chat — Variant A control ============ */
  if (showBlankChat) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16 text-ink">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-xl"
        >
          <p className="silcrow mb-6">§ Variant A · the control</p>

          <h1
            className="font-display text-5xl sm:text-6xl font-medium tracking-tight leading-[1.02] text-ink mb-6"
            style={{ fontVariationSettings: '"SOFT" 50, "opsz" 90' }}
          >
            A blank<br />
            <em className="italic font-normal text-brass" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 90' }}>
              cursor
            </em>{' '}
            blinks.
          </h1>

          <p className="font-sans text-base sm:text-lg text-stone leading-relaxed max-w-md mx-auto mb-10">
            This is what most AI platforms ship today. The user must invent the prompt, the use case, the value &mdash; alone. It is the activation killer.
          </p>

          {/* The chasm — a tall, empty paper-card that performs the void */}
          <div className="relative max-w-md mx-auto mb-8 paper-card shadow-press">
            <div className="h-64 sm:h-72 flex items-center justify-center">
              <span className="font-mono text-sm text-stone-mute tracking-wide">
                <span className="blink-caret">▍</span>
              </span>
            </div>
            <p className="absolute bottom-3 left-0 right-0 marginalia text-stone-mute">
              ⌐ Empty. Most users churn at this point.
            </p>
          </div>

          <button
            onClick={() => {
              setShowBlankChat(false);
              setStep('email');
            }}
            className="font-mono text-[12px] uppercase tracking-[0.2em] text-brass hover:text-brass-deep transition-colors inline-flex items-center gap-2"
          >
            ← Try the guided experience (Variant B)
          </button>
        </motion.div>
      </div>
    );
  }

  /* ============ Done — provisioning state ============ */
  if (done && !showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16 text-ink">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
          className="text-center max-w-lg"
        >
          <motion.p
            className="silcrow mb-6"
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            § Fin. · provisioning your atelier
          </motion.p>

          <motion.h1
            className="font-display text-5xl sm:text-6xl font-medium tracking-tight leading-[1.02] text-ink mb-6"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 100' }}
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            All <em className="italic font-normal text-brass">set</em>.
          </motion.h1>

          <motion.p
            className="font-sans text-base sm:text-lg text-stone leading-relaxed max-w-md mx-auto mb-2"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Your workspace is being configured. We&rsquo;ll send a confirmation to{' '}
            <span className="font-medium text-ink underline decoration-brass underline-offset-4 decoration-1">
              {email}
            </span>
            .
          </motion.p>

          {invitedEmail && (
            <motion.p
              className="font-sans text-sm text-stone mb-6"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              Invite sent to{' '}
              <span className="text-ink font-medium">{invitedEmail}</span>.
            </motion.p>
          )}

          <motion.div
            className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-widest text-stone mt-6 mb-10"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-brass-bright animate-ping opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brass-bright" />
            </span>
            Provisioning agents
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch justify-center gap-3"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={firstAgent ? `/workspace?agent=${firstAgent}` : '/workspace'}
              className="btn-ink"
            >
              Enter workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/metrics" className="btn-ghost">
              <BarChart3 className="w-4 h-4" />
              Live metrics
            </Link>
          </motion.div>

          <motion.p
            className="marginalia mt-8"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <Link to="/case-study" className="text-brass hover:text-brass-deep transition-colors">
              Read the case study
            </Link>
            <span className="mx-2 text-rule">·</span>
            <Link to="/agents" className="text-stone hover:text-ink transition-colors">
              Browse all agents
            </Link>
          </motion.p>
        </motion.div>
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
