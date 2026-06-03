import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Check, ExternalLink } from 'lucide-react';
import TopNav from './TopNav';
import { loadConversations, saveConversations } from '../lib/chat';

interface TeamMember {
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending';
}

const STORAGE_WORKSPACE = 'ai_gateway_workspace_v1';
const STORAGE_TEAM = 'ai_gateway_team_v1';

interface WorkspaceSettings {
  name: string;
  email: string;
  yourRole: string;
}

function loadWorkspace(): WorkspaceSettings {
  try {
    const raw = localStorage.getItem(STORAGE_WORKSPACE);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { name: 'My workspace', email: 'you@company.com', yourRole: '' };
}

function loadTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_TEAM);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export default function Settings() {
  const [workspace, setWorkspace] = useState<WorkspaceSettings>(loadWorkspace);
  const [team, setTeam] = useState<TeamMember[]>(loadTeam);
  const [inviteEmail, setInviteEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [convCount, setConvCount] = useState(0);

  useEffect(() => {
    setConvCount(loadConversations().length);
  }, []);

  const saveWorkspace = () => {
    localStorage.setItem(STORAGE_WORKSPACE, JSON.stringify(workspace));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const inviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const next: TeamMember[] = [
      ...team,
      { email: inviteEmail.trim().toLowerCase(), role: 'member', status: 'pending' },
    ];
    setTeam(next);
    localStorage.setItem(STORAGE_TEAM, JSON.stringify(next));
    setInviteEmail('');
  };

  const removeMember = (email: string) => {
    const next = team.filter((m) => m.email !== email);
    setTeam(next);
    localStorage.setItem(STORAGE_TEAM, JSON.stringify(next));
  };

  const clearAllChats = () => {
    if (!confirm('Delete all conversation history? This cannot be undone.')) return;
    saveConversations([]);
    setConvCount(0);
  };

  return (
    <div className="min-h-screen text-ink flex flex-col">
      <TopNav />

      {/* Running header */}
      <div className="border-b border-rule/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
          <span>AI Gateway · Settings</span>
          <span className="hidden sm:inline">workspace ledger</span>
          <span>vol. V</span>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-12 sm:py-16">
        <div className="mb-12 sm:mb-16">
          <p className="silcrow mb-5">§ Workspace ledger</p>
          <h1
            className="font-display text-[2.4rem] sm:text-[3.2rem] font-medium leading-[1.0] tracking-[-0.025em] text-ink mb-3"
            style={{ fontVariationSettings: '"SOFT" 50, "opsz" 80' }}
          >
            Settings.
          </h1>
          <p className="font-sans text-base text-stone max-w-xl">
            Manage your workspace, team, and integrations.
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          {/* Workspace */}
          <Section num="01" eyebrow="Workspace" title="Identity">
            <div className="space-y-px">
              <Field label="Workspace name">
                <input
                  type="text"
                  value={workspace.name}
                  onChange={(e) => setWorkspace((w) => ({ ...w, name: e.target.value }))}
                  className="w-full h-11 bg-paper-light border border-rule px-3 font-sans text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 transition-all rounded-none"
                />
              </Field>
              <Field label="Your email">
                <input
                  type="email"
                  value={workspace.email}
                  onChange={(e) => setWorkspace((w) => ({ ...w, email: e.target.value }))}
                  className="w-full h-11 bg-paper-light border border-rule px-3 font-sans text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 transition-all rounded-none"
                />
              </Field>
              <Field label="Your role">
                <select
                  value={workspace.yourRole}
                  onChange={(e) => setWorkspace((w) => ({ ...w, yourRole: e.target.value }))}
                  className="w-full h-11 bg-paper-light border border-rule px-3 font-sans text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 transition-all rounded-none"
                >
                  <option value="">Select a role…</option>
                  <option value="marketing">Marketing</option>
                  <option value="developers">Engineering</option>
                  <option value="legal">Legal</option>
                  <option value="hr">HR</option>
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <button onClick={saveWorkspace} className="btn-ink h-10">
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Saved
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </div>
          </Section>

          {/* Team */}
          <Section num="02" eyebrow="Team" title="Atelier members">
            <form onSubmit={inviteMember} className="flex gap-px mb-6">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="flex-1 h-11 bg-paper-light border border-rule px-3 font-sans text-sm text-ink placeholder-stone-mute outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 transition-all rounded-none"
              />
              <button type="submit" className="btn-ink h-11">
                Send invite
              </button>
            </form>
            {team.length === 0 ? (
              <p className="marginalia text-center py-6 border border-dashed border-rule">
                No team members yet. Invite a colleague to begin.
              </p>
            ) : (
              <ul className="border-t border-b border-rule">
                {team.map((m, i) => (
                  <li
                    key={m.email}
                    className={`flex items-center justify-between gap-3 px-3 py-3 ${i > 0 ? 'border-t border-rule/60' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 bg-paper-light border border-rule flex items-center justify-center font-mono text-[11px] font-semibold text-brass-deep flex-shrink-0">
                        {m.email.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-ink truncate">{m.email}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-mute">
                          {m.role} · <span className={m.status === 'active' ? 'text-emerald-700' : 'text-brass'}>{m.status}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMember(m.email)}
                      className="p-2 text-stone-mute hover:text-vermilion transition-colors"
                      aria-label="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* API */}
          <Section num="03" eyebrow="API & integrations" title="Connect a key">
            <p className="font-sans text-sm text-stone mb-4 leading-relaxed max-w-xl">
              For real OpenAI responses, set{' '}
              <code className="font-mono text-brass-deep bg-brass-tint px-1.5 py-0.5 text-xs">
                OPENAI_API_KEY
              </code>{' '}
              as a server-side environment variable in your Vercel project. The key is never exposed to the browser.
            </p>
            <pre className="bg-ink text-paper-edge px-4 py-3 font-mono text-xs mb-4 overflow-x-auto">
              <span className="text-brass-bright">$</span> vercel env add OPENAI_API_KEY
            </pre>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass hover:text-brass-deep transition-colors inline-flex items-center gap-1.5"
            >
              Get an OpenAI API key <ExternalLink className="w-3 h-3" />
            </a>
          </Section>

          {/* Usage */}
          <Section num="04" eyebrow="Usage" title="Tally">
            <div className="grid grid-cols-2 gap-px bg-rule">
              <div className="p-5 bg-paper-light">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-mute mb-2">
                  Saved conversations
                </p>
                <p
                  className="font-display text-4xl font-medium text-brass tabular-nums leading-none"
                  style={{ fontVariationSettings: '"SOFT" 60, "opsz" 40' }}
                >
                  {convCount}
                </p>
              </div>
              <div className="p-5 bg-paper-light">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-mute mb-2">
                  Current plan
                </p>
                <p
                  className="font-display text-4xl font-medium text-brass leading-none"
                  style={{ fontVariationSettings: '"SOFT" 60, "opsz" 40' }}
                >
                  Free
                </p>
                <p className="marginalia mt-2">
                  <Link to="/pricing" className="text-brass hover:text-brass-deep underline decoration-brass-deep underline-offset-4">
                    Upgrade →
                  </Link>
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Link
                to="/metrics"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass hover:text-brass-deep transition-colors inline-flex items-center gap-1.5"
              >
                View funnel metrics <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </Section>

          {/* Danger */}
          <Section num="05" eyebrow="Danger zone" title="Erasure" tone="danger">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border border-vermilion/30 bg-vermilion/5">
              <div>
                <p className="font-display text-lg font-medium text-ink"
                   style={{ fontVariationSettings: '"SOFT" 30, "opsz" 20' }}>
                  Clear conversation history
                </p>
                <p className="marginalia mt-0.5">
                  Deletes all locally-stored chats. Cannot be undone.
                </p>
              </div>
              <button
                onClick={clearAllChats}
                className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-vermilion/10 text-vermilion font-sans text-sm font-medium border border-vermilion/40 hover:bg-vermilion/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear chats
              </button>
            </div>
          </Section>
        </div>
      </main>

      <footer className="border-t border-rule/60 mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-7 marginalia text-center">
          © MMXXVI · AI Gateway ·{' '}
          <Link to="/case-study" className="text-brass hover:text-brass-deep transition-colors">
            Read the essay
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Section({
  num,
  eyebrow,
  title,
  children,
  tone = 'default',
}: {
  num: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <section className="grid sm:grid-cols-[6rem_1fr] gap-x-8 gap-y-3 pb-2">
      <aside className="sm:pt-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-mute mb-1">
          §
        </div>
        <div
          className={`font-display text-3xl sm:text-4xl font-medium leading-none ${
            tone === 'danger' ? 'text-vermilion' : 'text-brass'
          }`}
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 36' }}
        >
          {num}
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass mt-2">
          {eyebrow}
        </p>
      </aside>
      <div>
        <h2
          className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-6 leading-tight"
          style={{ fontVariationSettings: '"SOFT" 50, "opsz" 30' }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-stone mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
