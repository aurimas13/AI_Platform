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
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, agent }),
    signal,
  });

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
