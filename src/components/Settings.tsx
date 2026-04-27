import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Users as UsersIcon,
  Key,
  BarChart3,
  Trash2,
  Check,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
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
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <TopNav />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-stone-900">
            Settings
          </h1>
          <p className="text-stone-600">Manage your workspace, team, and integrations.</p>
        </div>

        <div className="space-y-6">
          {/* Workspace */}
          <SettingsCard icon={User} title="Workspace">
            <div className="space-y-4">
              <Field label="Workspace name">
                <input
                  type="text"
                  value={workspace.name}
                  onChange={(e) => setWorkspace((w) => ({ ...w, name: e.target.value }))}
                  className="w-full h-11 bg-cream-50 border border-stone-200 rounded-lg px-3 text-sm text-stone-900 outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-200 focus:bg-white transition-all"
                />
              </Field>
              <Field label="Your email">
                <input
                  type="email"
                  value={workspace.email}
                  onChange={(e) => setWorkspace((w) => ({ ...w, email: e.target.value }))}
                  className="w-full h-11 bg-cream-50 border border-stone-200 rounded-lg px-3 text-sm text-stone-900 outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-200 focus:bg-white transition-all"
                />
              </Field>
              <Field label="Your role">
                <select
                  value={workspace.yourRole}
                  onChange={(e) => setWorkspace((w) => ({ ...w, yourRole: e.target.value }))}
                  className="w-full h-11 bg-cream-50 border border-stone-200 rounded-lg px-3 text-sm text-stone-900 outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-200 focus:bg-white transition-all"
                >
                  <option value="">Select a role&hellip;</option>
                  <option value="marketing">Marketing</option>
                  <option value="developers">Engineering</option>
                  <option value="legal">Legal</option>
                  <option value="hr">HR</option>
                </select>
              </Field>
              <button
                onClick={saveWorkspace}
                className="inline-flex items-center gap-2 px-5 h-10 bg-stone-900 text-cream-50 text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Saved
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </div>
          </SettingsCard>

          {/* Team */}
          <SettingsCard icon={UsersIcon} title="Team">
            <form onSubmit={inviteMember} className="flex gap-2 mb-5">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="flex-1 h-11 bg-cream-50 border border-stone-200 rounded-lg px-3 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-200 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="px-5 h-11 bg-stone-900 text-cream-50 text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
              >
                Send invite
              </button>
            </form>
            {team.length === 0 ? (
              <p className="text-sm text-stone-500 text-center py-6 bg-cream-50 rounded-lg border border-stone-200">
                No team members yet. Invite teammates to collaborate.
              </p>
            ) : (
              <div className="space-y-2">
                {team.map((m) => (
                  <div
                    key={m.email}
                    className="flex items-center justify-between gap-3 p-3 bg-cream-50 border border-stone-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-brass-100 flex items-center justify-center text-xs font-bold text-brass-700 flex-shrink-0">
                        {m.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{m.email}</p>
                        <p className="text-xs text-stone-500 capitalize">
                          {m.role} &middot;{' '}
                          <span
                            className={
                              m.status === 'active' ? 'text-emerald-600' : 'text-amber-600'
                            }
                          >
                            {m.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMember(m.email)}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      aria-label="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SettingsCard>

          {/* API Keys */}
          <SettingsCard icon={Key} title="API keys & integrations">
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              For real OpenAI responses, set <code className="text-brass-700 bg-brass-50 px-1.5 py-0.5 rounded text-xs font-mono">OPENAI_API_KEY</code> as a server-side environment variable in your Vercel project.{' '}
              The key is never exposed to the browser.
            </p>
            <div className="bg-cream-50 border border-stone-200 rounded-lg p-4 mb-4">
              <p className="text-xs font-mono text-stone-700">
                vercel env add OPENAI_API_KEY
              </p>
            </div>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-brass-600 hover:text-brass-700 font-medium"
            >
              Get an OpenAI API key <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </SettingsCard>

          {/* Usage */}
          <SettingsCard icon={BarChart3} title="Usage">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-cream-50 border border-stone-200 rounded-lg">
                <p className="text-2xl font-bold text-brass-600 mb-0.5">{convCount}</p>
                <p className="text-xs text-stone-500">Saved conversations</p>
              </div>
              <div className="p-4 bg-cream-50 border border-stone-200 rounded-lg">
                <p className="text-2xl font-bold text-brass-600 mb-0.5">Free</p>
                <p className="text-xs text-stone-500">Current plan &middot;{' '}
                  <Link to="/pricing" className="text-brass-600 hover:underline">Upgrade</Link>
                </p>
              </div>
            </div>
            <Link
              to="/metrics"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-brass-600 hover:text-brass-700 font-medium"
            >
              View funnel metrics dashboard <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </SettingsCard>

          {/* Danger zone */}
          <SettingsCard icon={AlertTriangle} title="Danger zone" tone="danger">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-stone-900 text-sm">Clear conversation history</p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Deletes all locally-stored chats. Cannot be undone.
                </p>
              </div>
              <button
                onClick={clearAllChats}
                className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear chats
              </button>
            </div>
          </SettingsCard>
        </div>
      </main>

      <footer className="px-4 sm:px-10 py-8 text-center border-t border-stone-200/60">
        <p className="text-xs text-stone-500">
          &copy; 2026 AI Gateway &middot; <Link to="/case-study" className="text-brass-600 font-medium">Case Study</Link>
        </p>
      </footer>
    </div>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  children,
  tone = 'default',
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <section
      className={`bg-white border rounded-2xl shadow-card p-6 sm:p-7 ${
        tone === 'danger' ? 'border-red-200' : 'border-stone-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            tone === 'danger'
              ? 'bg-red-50 border border-red-200'
              : 'bg-brass-50 border border-brass-200'
          }`}
        >
          <Icon
            className={`w-4 h-4 ${tone === 'danger' ? 'text-red-600' : 'text-brass-600'}`}
            strokeWidth={1.75}
          />
        </div>
        <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
