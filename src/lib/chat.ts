// Chat client. Streams from /api/chat (Vercel Edge Function).
// Falls back to a client-side mock if the network fails entirely.

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  agent: string;
  agentName: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'ai_gateway_conversations_v1';

export function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(convs: Conversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs.slice(0, 50)));
  } catch {
    // Ignore quota errors.
  }
}

export function newConversation(agent: string, agentName: string): Conversation {
  return {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    agent,
    agentName,
    title: `New chat with ${agentName}`,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export interface StreamChatOptions {
  messages: ChatMessage[];
  agent: string;
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
  onMeta?: (meta: { provider: 'openai' | 'mock' }) => void;
}

export async function streamChat({
  messages,
  agent,
  signal,
  onChunk,
  onMeta,
}: StreamChatOptions): Promise<void> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, agent }),
      signal,
    });
  } catch {
    // Network failure (e.g. `vite dev` with no serverless runtime, or offline).
    // Don't swallow an intentional abort.
    if (signal?.aborted) return;
    await streamClientMock({ messages, agent, signal, onChunk, onMeta });
    return;
  }

  // The serverless function is unavailable (e.g. static hosting or local
  // `vite dev`). Fall back to the client-side mock so the workspace still works.
  if (res.status === 404 || res.status === 405) {
    await streamClientMock({ messages, agent, signal, onChunk, onMeta });
    return;
  }

  if (!res.ok || !res.body) {
    throw new Error(`Chat request failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let metaParsed = false;
  let metaBuf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });

    if (!metaParsed) {
      metaBuf += text;
      const newlineIdx = metaBuf.indexOf('\n');
      if (newlineIdx !== -1) {
        const metaLine = metaBuf.slice(0, newlineIdx);
        const remainder = metaBuf.slice(newlineIdx + 1);
        try {
          const meta = JSON.parse(metaLine) as { provider: 'openai' | 'mock' };
          onMeta?.(meta);
        } catch {
          // No meta; treat as content.
          onChunk(metaLine);
        }
        metaParsed = true;
        if (remainder) onChunk(remainder);
      }
    } else {
      onChunk(text);
    }
  }
}

/**
 * Client-side mock used when the serverless chat endpoint isn't reachable
 * (plain `vite dev`, static hosting, or offline). Mirrors the deterministic,
 * agent-aware behaviour of /api/chat and streams word-by-word for realism.
 */
async function streamClientMock({
  messages,
  agent,
  signal,
  onChunk,
  onMeta,
}: StreamChatOptions): Promise<void> {
  onMeta?.({ provider: 'mock' });
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const text = buildClientMock(lastUser, agent);

  const tokens = text.split(/(\s+)/);
  let buffer = '';
  for (let i = 0; i < tokens.length; i++) {
    if (signal?.aborted) return;
    buffer += tokens[i];
    if (i % 4 === 3 || i === tokens.length - 1) {
      onChunk(buffer);
      buffer = '';
      await new Promise((r) => setTimeout(r, 16 + Math.random() * 32));
    }
  }
}

function buildClientMock(userMessage: string, agent?: string): string {
  const trimmed = userMessage.slice(0, 240).trim();
  const responses: Record<string, string> = {
    'seo-analyzer': `Here's a quick read on your input.\n\n**Top findings**\n1. **Title tags** — keep primary keywords in the first 60 characters.\n2. **Meta descriptions** — write a unique 150-character summary per page.\n3. **Internal links** — connect orphan pages from your highest-authority pages.\n\n**Next step**\nWant me to draft revised meta descriptions for your key pages?`,
    'content-generator': `Here's a first draft tuned to your brief.\n\n**Hook**\n${trimmed ? `"${trimmed}"` : 'Most teams treat AI like a feature. The best treat it like a teammate.'}\n\n**Body**\nThe gap between AI experimentation and adoption isn't model quality — it's onboarding. Replace the empty chat with a role-based start and people stay.\n\n**CTA**\nWant three variants tuned for LinkedIn, X, and email?`,
    'api-debugger': `Let's narrow it down.\n\n**Hypothesis**\nAn auth header is likely being dropped between the edge and origin.\n\n**Quick check**\n\`\`\`bash\ncurl -v -H "Authorization: Bearer $TOKEN" https://api.example.com/v1/users\n\`\`\`\n\n**Fix**\n1. Confirm the header reaches the origin.\n2. If stripped, forward custom headers at the CDN.\n3. Add a test that asserts auth headers arrive. Want the test?`,
    'code-reviewer': `Reviewed your snippet — issues by severity.\n\n**High** — guard shared mutable state against concurrent access.\n**Medium** — add a timeout/abort to the unbounded loop; log swallowed errors with context.\n**Low** — prefer \`const\`; extract magic numbers into named constants.\n\nWant a suggested patch?`,
    'contract-analyzer': `Clause-by-clause summary.\n\n- **Term** — confirm auto-renewal and notice window.\n- **Liability cap** — check it against your risk tolerance.\n- **IP ownership** — watch derivative-IP language if you fine-tune models.\n- **SLA** — confirm service credits exist for breaches.\n\nWant a redline draft?`,
    'resume-screener': `Scored against the role.\n\n**Rubric** — required skills, preferred skills, domain experience, communication.\n**Strengths** — relevant, outcome-oriented experience.\n**Probe** — clarify any role gaps in the interview.\n**Bias check** — name, photo, and graduation year ignored.\n\nWant a tailored interview guide?`,
  };

  const fallback = `Got it. Here's how I'd approach **${trimmed || 'your request'}**.\n\n**Plan**\n1. Clarify the goal and constraints.\n2. Gather inputs (data, examples, prior work).\n3. Run the analysis and produce a draft.\n4. Iterate on your feedback and ship.\n\n_Note: this is a local demo response. Deploy with \`OPENAI_API_KEY\` set to enable live GPT-4o-mini answers._`;

  return responses[agent ?? ''] ?? fallback;
}
