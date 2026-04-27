// Vercel Edge Function for streaming chat responses.
// If OPENAI_API_KEY is set, streams real OpenAI completions.
// Otherwise, streams a deterministic, role-aware mocked response.
//
// API key is read server-side only and never sent to the browser.

export const config = {
  runtime: 'edge',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  agent?: string;
  role?: string;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  'seo-analyzer':
    'You are an SEO Analyzer agent. Audit pages for search performance and recommend high-impact keyword and structural improvements. Be specific, cite metrics, and prioritize fixes by ROI.',
  'content-generator':
    'You are a Content Generator agent. Draft on-brand marketing content (blogs, ad copy, social) given a topic and audience. Output is concise, scannable, and conversion-focused.',
  'campaign-optimizer':
    'You are a Campaign Optimizer agent. Analyze ad and growth metrics and surface 3 prioritized optimizations with expected impact and confidence.',
  'audience-insights':
    'You are an Audience Insights agent. Cluster audiences from analytics inputs and uncover non-obvious behavioral patterns. Output structured segments with personas.',
  'api-debugger':
    'You are an API Debugger agent. Diagnose request failures, inspect payloads, identify root causes, and propose fixes with code examples.',
  'code-reviewer':
    'You are a Code Reviewer agent. Provide rigorous, kind reviews focused on correctness, security, performance, and readability. Cite line-level issues.',
  'cicd-monitor':
    'You are a CI/CD Monitor agent. Detect flaky tests, surface regression patterns, and recommend pipeline improvements.',
  'docs-generator':
    'You are a Docs Generator agent. Produce clean Markdown API documentation from code or descriptions, with examples and edge cases.',
  'contract-analyzer':
    'You are a Contract Analyzer agent. Extract key clauses, flag risks, and explain implications in plain English. Always cite section references.',
  'compliance-checker':
    'You are a Compliance Checker agent. Map a document against regulatory frameworks (GDPR, SOC2, HIPAA, etc.) and surface gaps with severity.',
  'ip-research':
    'You are an IP Research agent. Summarize patent landscapes, identify white-space, and assess freedom-to-operate risk.',
  'regulatory-monitor':
    'You are a Regulatory Monitor agent. Track and summarize regulatory changes by jurisdiction and surface relevance to a given business.',
  'resume-screener':
    'You are a Resume Screener agent. Score candidates objectively against role requirements with explicit rubric, including bias-mitigation notes.',
  'employee-onboarder':
    'You are an Employee Onboarder agent. Generate week-by-week onboarding plans tailored to role and seniority.',
  'policy-generator':
    'You are a Policy Generator agent. Draft HR policies in clear language aligned with current labor regulations and company culture.',
  'sentiment-analyzer':
    'You are a Sentiment Analyzer agent. Quantify sentiment from employee feedback and surface drivers and engagement risks.',
};

function getSystemPrompt(agent?: string): string {
  if (agent && SYSTEM_PROMPTS[agent]) return SYSTEM_PROMPTS[agent];
  return 'You are AI Gateway, a helpful enterprise AI assistant. Be concise, structured, and grounded.';
}

// Deterministic mocked response generator. Streams a realistic-looking,
// agent-specific response token-by-token over Server-Sent-Events-style chunks.
function buildMockResponse(userMessage: string, agent?: string): string {
  const trimmed = userMessage.slice(0, 240).trim();

  const responses: Record<string, string> = {
    'seo-analyzer': `Here's a quick audit based on your input.\n\n**Top findings**\n1. **Title tag length** — currently optimal at 56 chars (target: 50–60). \u2705\n2. **Meta description** — missing on 12 of 38 pages. Add unique 150-char summaries with primary keyword.\n3. **H1 hierarchy** — 4 pages have multiple H1s. Consolidate to one per page.\n4. **Internal linking** — orphan pages detected: /pricing, /changelog. Add inbound links from /home and /agents.\n\n**Recommended next actions**\n- Run a Lighthouse SEO audit and fix any score under 90.\n- Add structured data (Organization, BreadcrumbList) to the homepage.\n- Backlink-worthy content: publish the case study on Indie Hackers and Hacker News.\n\nWant me to draft revised meta descriptions for the missing pages?`,

    'content-generator': `Here's a first draft tuned to your brief.\n\n**Hook**\n${trimmed ? `"${trimmed}"` : 'Most teams treat AI like a feature. The smartest treat it like a teammate.'}\n\n**Body** (3 paragraphs, ~180 words)\nThe gap between AI experimentation and AI adoption isn't model quality — it's onboarding. When new users hit a blank chat window, they bounce. When they hit a curated agent library matched to their role, they stay.\n\nThis is the cold-start problem in AI platforms, and it's the single biggest activation killer. Most products treat it as a technical issue. The best ones reframe it as a growth problem.\n\nThe fix is structural: replace the empty chat with role-based onboarding, embed virality at the Aha! moment, and instrument the funnel end-to-end.\n\n**CTA**\nReady to see it in action? Try the live demo at gateway.aurimas.io.\n\nWant me to generate three variants tuned for LinkedIn, Twitter, and email?`,

    'api-debugger': `Looks like a 401 cascade. Here's my diagnosis.\n\n**Root cause hypothesis**\nThe \`Authorization\` header is being stripped by an upstream proxy when the request crosses the CDN edge. Common cause: case-sensitive header matching in older nginx configs.\n\n**Quick check**\n\`\`\`bash\ncurl -v -H "Authorization: Bearer $TOKEN" https://api.example.com/v1/users\n\`\`\`\nLook for \`> Authorization:\` in the request trace and \`< 401\` in the response.\n\n**Fix**\n1. Confirm the header is present at the origin (add temporary \`X-Debug-Auth\` echo).\n2. If stripped, update CDN config to forward custom headers.\n3. Add an integration test that asserts auth headers reach the origin.\n\nWant me to write the integration test?`,

    'code-reviewer': `Reviewed your snippet. Here are the issues, ordered by severity.\n\n**\ud83d\udfe5 High**\n- **Race condition** on shared state \`cache\` — concurrent reads can return stale data. Use \`Map\` with a per-key mutex or switch to \`AsyncLocalStorage\`.\n\n**\ud83d\udfe7 Medium**\n- Unbounded \`for await\` loop can hang if the iterator never completes. Add a timeout or signal.\n- Error swallowed in catch block on line 42 — log with context.\n\n**\ud83d\udfe6 Low / style**\n- Prefer \`const\` over \`let\` where reassignment doesn't happen.\n- Extract magic number \`60_000\` into a named constant.\n\n**Suggested patch** is in the diff view. Apply?`,

    'contract-analyzer': `Here's a clause-by-clause summary.\n\n**Key terms**\n- **Term**: 36 months, auto-renewing for 12-month periods unless terminated 90 days prior.\n- **Liability cap**: 12 months of fees. \u26a0\ufe0f Below industry standard (24 months) — flag for renegotiation.\n- **IP ownership**: Vendor retains all derivative IP — watch this one if you plan to fine-tune models.\n- **SLA**: 99.5% uptime, 4-hour response. No service credit clause. \u26a0\ufe0f\n\n**Risk score**: 6.2 / 10 (medium-high)\n\n**Recommended redlines**\n1. Lift liability cap to 24 months of fees.\n2. Add service credits at 99.0% / 95.0% breach tiers.\n3. Carve out customer-specific IP from derivative IP clause.\n\nWant me to generate the redline draft?`,

    'resume-screener': `Scored this candidate against the JD.\n\n**Overall fit**: 8.4 / 10 \u2014 strong signal\n\n**Rubric breakdown**\n- Required skills (40%): 9.0 — meets all hard requirements\n- Preferred skills (25%): 7.5 — 3 of 4 nice-to-haves\n- Domain experience (20%): 8.0 — 4y in adjacent industry\n- Communication signals (15%): 8.5 — strong writing in cover letter\n\n**Strengths**\n- Direct experience scaling PLG funnels at two prior startups\n- Quantitative bias (cites metrics throughout)\n\n**Concerns to probe**\n- Gap between most recent roles \u2014 ask context\n- Limited B2C exposure if this role mixes B2B/B2C\n\n**Bias check**: I deliberately ignored name, photo, and graduation year. Score is based on stated experience and outcomes only.\n\nWant a tailored interview guide?`,
  };

  const fallback = `Got it. Here's how I'd approach **${trimmed || 'your request'}**.\n\n**Plan**\n1. Clarify the goal and constraints (what does success look like, by when?).\n2. Gather inputs (data, examples, prior work).\n3. Run the analysis with the relevant agent and produce a draft.\n4. Iterate based on your feedback and ship.\n\n**Next step**\nWant me to start on step 2? Drop any links, files, or context and I'll take it from there.\n\n_Note: this is a mocked response. Set \`OPENAI_API_KEY\` in your Vercel project to enable real GPT-4o-mini responses._`;

  return responses[agent ?? ''] ?? fallback;
}

async function* streamMock(text: string): AsyncGenerator<string> {
  // Stream in word-chunks for realism (avg ~3 words per chunk).
  const tokens = text.split(/(\s+)/);
  let buffer = '';
  for (let i = 0; i < tokens.length; i++) {
    buffer += tokens[i];
    if (i % 4 === 3 || i === tokens.length - 1) {
      yield buffer;
      buffer = '';
      // Simulate realistic streaming latency (16–48ms per chunk).
      await new Promise((r) => setTimeout(r, 16 + Math.random() * 32));
    }
  }
}

async function* streamOpenAI(
  apiKey: string,
  messages: ChatMessage[],
  systemPrompt: string,
): AsyncGenerator<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      stream: true,
      temperature: 0.7,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '');
    throw new Error(`OpenAI error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    const lines = buf.split('\n');
    buf = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // Ignore malformed chunks.
      }
    }
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { messages = [], agent } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('messages array required', { status: 400 });
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const systemPrompt = getSystemPrompt(agent);
  const apiKey = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env
    ?.OPENAI_API_KEY;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Indicate provider in a leading metadata frame (newline-delimited JSON).
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ provider: apiKey ? 'openai' : 'mock' }) + '\n',
          ),
        );

        if (apiKey) {
          for await (const chunk of streamOpenAI(apiKey, messages, systemPrompt)) {
            controller.enqueue(encoder.encode(chunk));
          }
        } else {
          const text = buildMockResponse(lastUserMsg, agent);
          for await (const chunk of streamMock(text)) {
            controller.enqueue(encoder.encode(chunk));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(encoder.encode(`\n\n[error: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
