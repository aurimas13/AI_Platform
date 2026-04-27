import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
  ChevronDown,
  Zap,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
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

export default function ChatWorkspace() {
  const [searchParams] = useSearchParams();
  const initialAgentSlug = searchParams.get('agent');
  const initialAgent =
    allAgents.find((a) => a.slug === initialAgentSlug) ?? defaultAgent();

  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadConversations(),
  );
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

  // Initialize first conversation on mount if none active.
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

  // Auto-scroll to latest message.
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
    // Start a fresh chat scoped to this agent.
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
    let working = conversations.map((c) =>
      c.id === active.id ? updatedConv : c,
    );
    persist(working);
    setInput('');
    setStreaming(true);

    abortRef.current = new AbortController();

    try {
      let buffer = '';
      await streamChat({
        messages: updatedConv.messages
          .filter((m) => m.content || m.role === 'user')
          .slice(0, -1) // drop the empty assistant placeholder
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
                i === arr.length - 1
                  ? { ...m, content: `[error: ${msg}]` }
                  : m,
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
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <TopNav variant="workspace" />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-72' : 'w-0'
          } transition-all duration-200 border-r border-stone-200/60 bg-cream-50/50 flex-shrink-0 overflow-hidden hidden md:flex md:flex-col`}
        >
          <div className="p-3 border-b border-stone-200/60">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 h-10 bg-stone-900 text-cream-50 text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 && (
              <p className="text-xs text-stone-500 p-3 text-center">No chats yet.</p>
            )}
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm group transition-colors flex items-start gap-2 ${
                  activeId === c.id
                    ? 'bg-white shadow-card border border-stone-200'
                    : 'hover:bg-white/60 text-stone-700'
                }`}
              >
                <MessageSquare
                  className="w-3.5 h-3.5 text-brass-600 mt-0.5 flex-shrink-0"
                  strokeWidth={1.75}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.title}</p>
                  <p className="truncate text-[11px] text-stone-500">
                    {c.agentName}
                  </p>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 transition-opacity flex-shrink-0"
                  aria-label="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-stone-200/60">
            <Link
              to="/agents"
              className="flex items-center justify-between text-xs text-stone-500 hover:text-stone-900 transition-colors px-2 py-1.5"
            >
              <span>Browse all agents</span>
              <Sparkles className="w-3.5 h-3.5 text-brass-600" />
            </Link>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-stone-200/60 bg-cream-100/80">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-white transition-colors flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4 text-stone-600" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-stone-600" />
                )}
              </button>

              {/* Agent picker */}
              <div className="relative min-w-0">
                <button
                  onClick={() => setAgentMenuOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 h-9 bg-white border border-stone-200 shadow-card rounded-lg hover:border-brass-300 transition-colors"
                >
                  <div className="w-5 h-5 rounded bg-brass-50 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-brass-600" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium truncate max-w-[140px] sm:max-w-none">
                    {agent.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>
                {agentMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setAgentMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-stone-200 shadow-card-lg rounded-xl p-2 z-20 max-h-96 overflow-y-auto">
                      {(Object.keys(templatesByRole) as Role[]).map((roleKey) => {
                        const roleLabel =
                          roleOptions.find((r) => r.id === roleKey)?.label ?? roleKey;
                        return (
                          <div key={roleKey}>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 px-2 pt-2 pb-1">
                              {roleLabel}
                            </p>
                            {templatesByRole[roleKey].map((t) => (
                              <button
                                key={t.slug}
                                onClick={() =>
                                  switchAgent({ ...t, role: roleKey })
                                }
                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                                  agent.slug === t.slug
                                    ? 'bg-stone-900 text-cream-50'
                                    : 'hover:bg-cream-100 text-stone-700'
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

            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              {provider === 'openai' && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                  Live OpenAI
                </span>
              )}
              {provider === 'mock' && (
                <span className="px-2 py-0.5 bg-brass-50 text-brass-700 border border-brass-200 rounded-full font-medium">
                  Demo mode
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-3xl mx-auto">
              {(!active || active.messages.length === 0) && (
                <div className="text-center py-10 sm:py-20">
                  <div className="w-14 h-14 rounded-2xl bg-brass-50 border border-brass-200 flex items-center justify-center mx-auto mb-5">
                    <Sparkles
                      className="w-7 h-7 text-brass-600"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-stone-900">
                    {agent.name}
                  </h2>
                  <p className="text-stone-600 max-w-md mx-auto mb-8 text-sm sm:text-base">
                    {agent.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="text-left px-4 py-3 bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 rounded-xl text-sm text-stone-700 transition-all"
                      >
                        {s}
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
                    streaming &&
                    i === active.messages.length - 1 &&
                    m.role === 'assistant'
                  }
                />
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-stone-200/60 bg-cream-100/80 px-4 sm:px-6 py-3 sm:py-4">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto">
              <div className="relative bg-white border border-stone-200 shadow-card rounded-2xl focus-within:border-brass-400 focus-within:ring-2 focus-within:ring-brass-200 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Ask ${agent.name} anything\u2026`}
                  rows={1}
                  className="w-full bg-transparent px-4 py-3 pr-14 text-sm text-stone-900 placeholder-stone-400 outline-none resize-none max-h-40"
                  style={{ minHeight: '44px' }}
                  disabled={streaming}
                />
                <button
                  type={streaming ? 'button' : 'submit'}
                  onClick={streaming ? stopStreaming : undefined}
                  disabled={!streaming && !input.trim()}
                  className={`absolute right-2 bottom-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                    streaming
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      : 'bg-stone-900 text-cream-50 hover:bg-stone-800'
                  }`}
                  aria-label={streaming ? 'Stop' : 'Send'}
                >
                  {streaming ? (
                    <span className="w-3 h-3 bg-red-600 rounded-sm" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 text-center">
                Press <kbd className="px-1 py-0.5 bg-white border border-stone-200 rounded">Enter</kbd> to send,{' '}
                <kbd className="px-1 py-0.5 bg-white border border-stone-200 rounded">Shift+Enter</kbd> for newline.
                {provider === 'mock' && (
                  <>
                    {' \u00b7 '}Running in <strong>demo mode</strong>. Set{' '}
                    <code className="text-brass-700">OPENAI_API_KEY</code> in Vercel for live responses.
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
      className={`flex gap-3 sm:gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-brass-50 border border-brass-200 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-brass-600" strokeWidth={1.75} />
        </div>
      )}
      <div
        className={`group relative max-w-[85%] sm:max-w-[75%] ${
          isUser ? 'order-1' : ''
        }`}
      >
        {!isUser && (
          <p className="text-[11px] font-semibold text-stone-500 mb-1 uppercase tracking-wider">
            {agentName}
          </p>
        )}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-stone-900 text-cream-50 rounded-tr-sm'
              : 'bg-white border border-stone-200 shadow-card text-stone-800 rounded-tl-sm'
          }`}
        >
          {message.content || (isStreaming && <BlinkingCursor />)}
          {isStreaming && message.content && <BlinkingCursor inline />}
        </div>
        {!isUser && message.content && (
          <button
            onClick={onCopy}
            className="absolute -bottom-7 left-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1"
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
        <div className="w-8 h-8 rounded-lg bg-stone-900 text-cream-50 flex items-center justify-center flex-shrink-0 text-xs font-bold order-2">
          A
        </div>
      )}
    </div>
  );
}

function BlinkingCursor({ inline = false }: { inline?: boolean }) {
  return (
    <span
      className={`inline-block w-1.5 h-4 bg-brass-600 animate-pulse ${
        inline ? 'ml-0.5 align-text-bottom' : ''
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
