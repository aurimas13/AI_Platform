import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  Plus,
  Trash2,
  ChevronDown,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Square,
} from 'lucide-react';
import TopNav from './TopNav';
import {
  loadConversations,
  saveConversations,
  newConversation,
  streamChat,
  type ChatMessage,
  type Conversation,
} from '../lib/chat';
import { templatesByRole, roleOptions } from '../data/templates';
import type { Template, Role } from '../types/onboarding';

// Flatten all templates for the picker.
const allAgents: (Template & { role: Role })[] = (
  Object.entries(templatesByRole) as [Role, Template[]][]
).flatMap(([role, list]) => list.map((t) => ({ ...t, role })));

function defaultAgent(): Template & { role: Role } {
  return allAgents[0];
}

/**
 * Atelier night-mode workspace. Deep void background with subtle warm
 * grain. Mono-typography heavy. Brass-foil accents. The chat reads like
 * a craftsman's terminal — not a SaaS chat box.
 */
export default function ChatWorkspace() {
  const [searchParams] = useSearchParams();
  const initialAgentSlug = searchParams.get('agent');
  const initialAgent =
    allAgents.find((a) => a.slug === initialAgentSlug) ?? defaultAgent();

  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [agent, setAgent] = useState<Template & { role: Role }>(initialAgent);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [provider, setProvider] = useState<'openai' | 'mock' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    if (!activeId && conversations.length === 0) {
      const c = newConversation(agent.slug, agent.name);
      setConversations([c]);
      setActiveId(c.id);
      saveConversations([c]);
    } else if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.messages, streaming]);

  const persist = (next: Conversation[]) => {
    setConversations(next);
    saveConversations(next);
  };

  const startNewChat = () => {
    const c = newConversation(agent.slug, agent.name);
    persist([c, ...conversations]);
    setActiveId(c.id);
  };

  const deleteChat = (id: string) => {
    const next = conversations.filter((c) => c.id !== id);
    persist(next);
    if (activeId === id) {
      setActiveId(next[0]?.id ?? null);
      if (next.length === 0) {
        const c = newConversation(agent.slug, agent.name);
        persist([c]);
        setActiveId(c.id);
      }
    }
  };

  const switchAgent = (a: Template & { role: Role }) => {
    setAgent(a);
    setAgentMenuOpen(false);
    const c = newConversation(a.slug, a.name);
    persist([c, ...conversations]);
    setActiveId(c.id);
  };

  const copyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || streaming || !active) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };

    const updatedConv: Conversation = {
      ...active,
      title:
        active.messages.length === 0
          ? trimmed.slice(0, 48) + (trimmed.length > 48 ? '\u2026' : '')
          : active.title,
      messages: [...active.messages, userMsg, assistantMsg],
      updatedAt: Date.now(),
    };
    let working = conversations.map((c) => (c.id === active.id ? updatedConv : c));
    persist(working);
    setInput('');
    setStreaming(true);
    abortRef.current = new AbortController();

    try {
      let buffer = '';
      await streamChat({
        messages: updatedConv.messages
          .filter((m) => m.content || m.role === 'user')
          .slice(0, -1)
          .concat({ role: 'user', content: trimmed }),
        agent: agent.slug,
        signal: abortRef.current.signal,
        onMeta: (meta) => setProvider(meta.provider),
        onChunk: (chunk) => {
          buffer += chunk;
          working = working.map((c) =>
            c.id === active.id
              ? {
                  ...c,
                  messages: c.messages.map((m, i, arr) =>
                    i === arr.length - 1 ? { ...m, content: buffer } : m,
                  ),
                  updatedAt: Date.now(),
                }
              : c,
          );
          setConversations(working);
        },
      });
      saveConversations(working);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      working = working.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: c.messages.map((m, i, arr) =>
                i === arr.length - 1 ? { ...m, content: `[error: ${msg}]` } : m,
              ),
            }
          : c,
      );
      persist(working);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const suggestions = getSuggestions(agent.slug);

  return (
    <div
      className="min-h-screen flex flex-col text-bone"
      style={{
        background:
          'radial-gradient(ellipse at top right, rgba(156, 106, 31, 0.10), transparent 55%), radial-gradient(ellipse at bottom left, rgba(184, 65, 42, 0.05), transparent 50%), #14110D',
      }}
    >
      <TopNav variant="workspace" />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-72' : 'w-0'
          } transition-all duration-300 border-r border-void-elev/80 bg-void-soft/60 backdrop-blur-sm flex-shrink-0 overflow-hidden hidden md:flex md:flex-col`}
        >
          {/* Sidebar header — folio mark */}
          <div className="px-4 pt-4 pb-3 border-b border-void-elev/70">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass-bright/80">
                ¶ Conversations
              </span>
              <span className="font-mono text-[10px] tabular-nums text-bone-soft">
                {String(conversations.length).padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={startNewChat}
              className="group w-full flex items-center justify-center gap-2 h-10 bg-bone text-void font-sans text-sm font-medium hover:bg-brass-foil transition-colors border border-bone"
            >
              <Plus className="w-4 h-4" />
              New conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2">
            {conversations.length === 0 && (
              <p className="font-mono text-[11px] text-bone-soft p-3 text-center">No conversations yet.</p>
            )}
            {conversations.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left p-3 group transition-colors flex items-start gap-3 border-l-2 ${
                  activeId === c.id
                    ? 'border-brass-bright bg-brass-deep/15'
                    : 'border-transparent hover:bg-void-elev/40'
                }`}
              >
                <span
                  className={`font-mono text-[10px] tabular-nums tracking-widest mt-0.5 ${
                    activeId === c.id ? 'text-brass-bright' : 'text-bone-soft/60'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${activeId === c.id ? 'text-bone' : 'text-bone-soft'}`}>
                    {c.title}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-bone-soft/60 truncate mt-0.5">
                    {c.agentName}
                  </p>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(c.id);
                  }}
                  role="button"
                  aria-label="Delete chat"
                  className="opacity-0 group-hover:opacity-100 text-bone-soft/60 hover:text-vermilion transition-opacity flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-void-elev/70">
            <Link
              to="/agents"
              className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-bone-soft hover:text-brass-bright transition-colors px-2 py-1.5"
            >
              <span>Browse all agents</span>
              <span className="text-brass-bright">→</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-void-elev/70 bg-void-soft/40 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="hidden md:flex w-8 h-8 items-center justify-center text-bone-soft hover:text-bone hover:bg-void-elev transition-colors flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>

              {/* Agent picker — terminal command style */}
              <div className="relative min-w-0">
                <button
                  onClick={() => setAgentMenuOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 h-9 bg-void-soft border border-void-elev hover:border-brass-deep transition-colors group"
                >
                  <span className="font-mono text-[11px] text-brass-bright">∴</span>
                  <span className="font-mono text-xs text-bone-soft">agent:</span>
                  <span className="font-sans text-sm font-medium text-bone truncate max-w-[140px] sm:max-w-none">
                    {agent.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-bone-soft transition-transform ${agentMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {agentMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAgentMenuOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-80 bg-void-soft border border-void-elev shadow-press-hover p-2 z-20 max-h-96 overflow-y-auto">
                      {(Object.keys(templatesByRole) as Role[]).map((roleKey) => {
                        const roleLabel = roleOptions.find((r) => r.id === roleKey)?.label ?? roleKey;
                        return (
                          <div key={roleKey} className="mb-2">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-brass-bright px-2 pt-2 pb-1.5 flex items-center gap-2">
                              <span className="text-brass-deep">§</span>
                              {roleLabel}
                              <span className="flex-1 h-px bg-void-elev/80" />
                            </p>
                            {templatesByRole[roleKey].map((t) => (
                              <button
                                key={t.slug}
                                onClick={() => switchAgent({ ...t, role: roleKey })}
                                className={`w-full text-left px-2 py-1.5 text-sm transition-colors ${
                                  agent.slug === t.slug
                                    ? 'bg-brass-deep text-bone'
                                    : 'text-bone-soft hover:bg-void-elev hover:text-bone'
                                }`}
                              >
                                {t.name}
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {provider === 'openai' && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Live · OpenAI
                </span>
              )}
              {provider === 'mock' && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 bg-brass-deep/40 text-brass-foil border border-brass-deep/60">
                  ⌐ Demo mode
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
            <div className="max-w-3xl mx-auto">
              {(!active || active.messages.length === 0) && (
                <div className="text-center py-12 sm:py-20">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass-bright mb-7 inline-flex items-center gap-2">
                    <span className="text-brass-deep">§</span> The workbench
                    <span className="block w-12 h-px bg-brass-deep/60" />
                  </p>
                  <h2
                    className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-bone mb-4"
                    style={{ fontVariationSettings: '"SOFT" 50, "opsz" 60' }}
                  >
                    {agent.name}
                  </h2>
                  <p className="font-sans text-bone-soft max-w-md mx-auto mb-10 text-base leading-relaxed">
                    {agent.description}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-soft/60 mb-4">
                    ◇ Try a starting query
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-void-elev/60 border border-void-elev max-w-2xl mx-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="text-left px-4 py-4 bg-void-soft hover:bg-void-elev hover:text-bone text-bone-soft text-sm transition-colors flex items-start gap-3"
                      >
                        <span className="font-mono text-[10px] tabular-nums tracking-widest text-brass-bright/80 mt-0.5 flex-shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {active?.messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  message={m}
                  index={i}
                  agentName={agent.name}
                  copied={copiedId === `${active.id}_${i}`}
                  onCopy={() => copyMessage(`${active.id}_${i}`, m.content)}
                  isStreaming={
                    streaming && i === active.messages.length - 1 && m.role === 'assistant'
                  }
                />
              ))}
            </div>
          </div>

          {/* Composer — command-line vibe */}
          <div className="border-t border-void-elev/70 bg-void-soft/50 backdrop-blur-sm px-4 sm:px-8 py-4">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto">
              <div className="relative bg-void-soft border border-void-elev focus-within:border-brass-bright transition-colors">
                {/* Prompt mark */}
                <span
                  aria-hidden
                  className="absolute left-3 top-3 font-mono text-sm text-brass-bright pointer-events-none select-none"
                >
                  →
                </span>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Ask ${agent.name}\u2026`}
                  rows={1}
                  disabled={streaming}
                  className="w-full bg-transparent pl-10 pr-14 py-3 font-sans text-sm text-bone placeholder-bone-soft/60 outline-none resize-none max-h-40 caret-brass-bright"
                  style={{ minHeight: '44px' }}
                />
                <button
                  type={streaming ? 'button' : 'submit'}
                  onClick={streaming ? stopStreaming : undefined}
                  disabled={!streaming && !input.trim()}
                  className={`absolute right-2 bottom-2 w-9 h-9 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                    streaming
                      ? 'bg-vermilion/20 text-vermilion border border-vermilion/40 hover:bg-vermilion/30'
                      : 'bg-bone text-void hover:bg-brass-foil border border-bone'
                  }`}
                  aria-label={streaming ? 'Stop' : 'Send'}
                >
                  {streaming ? <Square className="w-3 h-3" fill="currentColor" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-soft/60 mt-2.5 text-center">
                <kbd className="px-1.5 py-0.5 bg-void-elev border border-void-elev text-bone-soft mx-0.5">Enter</kbd>
                send
                <span className="mx-2 text-rule/30">·</span>
                <kbd className="px-1.5 py-0.5 bg-void-elev border border-void-elev text-bone-soft mx-0.5">⇧⏎</kbd>
                newline
                {provider === 'mock' && (
                  <>
                    <span className="mx-2 text-rule/30">·</span>
                    set <code className="font-mono text-brass-bright normal-case">OPENAI_API_KEY</code> for live
                  </>
                )}
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function MessageBubble({
  message,
  index,
  agentName,
  copied,
  onCopy,
  isStreaming,
}: {
  message: ChatMessage;
  index: number;
  agentName: string;
  copied: boolean;
  onCopy: () => void;
  isStreaming: boolean;
}) {
  const isUser = message.role === 'user';
  return (
    <div
      key={index}
      className={`flex gap-3 sm:gap-4 mb-7 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            background: 'linear-gradient(135deg, #E8CD8B 0%, #9C6A1F 100%)',
          }}
        >
          <span className="font-mono text-[10px] font-semibold text-void">∴</span>
        </div>
      )}
      <div className={`group relative max-w-[85%] sm:max-w-[78%] ${isUser ? 'order-1' : ''}`}>
        {!isUser && (
          <p className="font-mono text-[10px] font-semibold text-brass-bright uppercase tracking-[0.18em] mb-1.5">
            {agentName}
          </p>
        )}
        <div
          className={`px-4 py-3 font-sans text-[14.5px] leading-[1.65] whitespace-pre-wrap ${
            isUser
              ? 'bg-bone text-void border border-brass-foil/30'
              : 'bg-void-soft border-l-2 border-brass-bright text-bone'
          }`}
        >
          {message.content || (isStreaming && <BlinkingCursor />)}
          {isStreaming && message.content && <BlinkingCursor inline />}
        </div>
        {!isUser && message.content && (
          <button
            onClick={onCopy}
            className="absolute -bottom-6 left-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] uppercase tracking-[0.18em] text-bone-soft/60 hover:text-bone flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-void-elev border border-brass-foil/30 flex items-center justify-center flex-shrink-0 font-mono text-[11px] font-semibold text-brass-foil order-2 mt-0.5">
          A
        </div>
      )}
    </div>
  );
}

function BlinkingCursor({ inline = false }: { inline?: boolean }) {
  return (
    <span
      className={`inline-block w-[7px] h-4 bg-brass-bright blink-caret ${
        inline ? 'ml-1 align-text-bottom' : ''
      }`}
    />
  );
}

function getSuggestions(agentSlug: string): string[] {
  const map: Record<string, string[]> = {
    'seo-analyzer': [
      'Audit my homepage for SEO issues',
      'Suggest 10 long-tail keywords for "AI onboarding"',
      'Review my meta descriptions',
      'Compare my site SEO to a competitor',
    ],
    'content-generator': [
      'Draft a LinkedIn post about PLG onboarding',
      'Write 3 ad headlines for our product launch',
      'Outline a blog post on the cold-start problem',
      'Generate a 280-char Twitter announcement',
    ],
    'campaign-optimizer': [
      'Analyze my latest Google Ads performance',
      'Suggest A/B test ideas for my landing page',
      'Identify low-performing campaign segments',
      'Recommend budget reallocations across channels',
    ],
    'api-debugger': [
      'My POST /users returns 401 intermittently',
      'Trace why my webhook delivery is failing',
      'Help me debug a CORS error',
      'Diagnose 502 errors from my upstream service',
    ],
    'code-reviewer': [
      'Review this React hook for issues',
      'Check this SQL query for performance',
      'Audit my Express middleware for security',
      'Suggest refactors for this Python class',
    ],
    'contract-analyzer': [
      'Summarize key risks in this MSA',
      'Compare two SOWs for material differences',
      'Flag unusual indemnification language',
      'Extract all renewal and termination terms',
    ],
    'compliance-checker': [
      'Check this privacy policy against GDPR',
      'Audit our data flow for SOC 2 readiness',
      'Identify HIPAA gaps in our intake form',
      'Review terms for CCPA compliance',
    ],
    'resume-screener': [
      'Score this resume against a Senior PM JD',
      'Generate interview questions for this candidate',
      'Compare three candidates objectively',
      'Identify red flags in this resume',
    ],
    'employee-onboarder': [
      'Build a 30/60/90 plan for a new engineer',
      'Draft a first-week onboarding checklist',
      'Generate intro emails for new hires',
      'Suggest mentorship pairings',
    ],
    'sentiment-analyzer': [
      'Analyze this batch of employee survey responses',
      'Identify top engagement risks this quarter',
      'Compare sentiment by department',
      'Surface themes from exit interview notes',
    ],
  };
  return (
    map[agentSlug] ?? [
      'What can you help me with?',
      'Show me an example workflow',
      'Summarize your capabilities',
      'Suggest a starter task',
    ]
  );
}
