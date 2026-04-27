// Funnel analytics with dual-write: localStorage (always) + Supabase (optional).
// Designed so the metrics dashboard always shows real numbers even when the
// remote backend is unreachable or RLS blocks inserts.

import { supabase, supabaseConfigured } from './supabase';

export type FunnelEventName =
  | 'signup_view'
  | 'role_selected'
  | 'template_clicked'
  | 'team_invite_sent'
  | 'paywall_viewed'
  | 'upgrade_intent_clicked';

export interface FunnelEventRecord {
  id: string;
  event: FunnelEventName;
  role_selected: string | null;
  template_slug: string | null;
  invite_email: string | null;
  ab_variant: 'A' | 'B' | null;
  created_at: string;
  source?: 'local' | 'remote';
}

interface FunnelPayload {
  event: FunnelEventName;
  role_selected?: string;
  template_slug?: string;
  invite_email?: string;
  ab_variant?: 'A' | 'B';
}

export interface AnalyticsDiagnostics {
  supabaseConfigured: boolean;
  lastInsertResult: 'ok' | 'error' | 'skipped' | null;
  lastInsertError: string | null;
  lastInsertAt: string | null;
  totalLocalEvents: number;
}

const STORAGE_KEY = 'ai_gateway_funnel_events_v1';
const DIAG_KEY = 'ai_gateway_funnel_diag_v1';
const MAX_LOCAL_EVENTS = 5000;

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function safeReadLocal(): FunnelEventRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FunnelEventRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteLocal(records: FunnelEventRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = records.slice(-MAX_LOCAL_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* quota — ignore */
  }
}

export function loadLocalEvents(): FunnelEventRecord[] {
  return safeReadLocal().map((r) => ({ ...r, source: 'local' as const }));
}

export function clearLocalEvents(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DIAG_KEY);
  } catch {
    /* ignore */
  }
}

function readDiag(): AnalyticsDiagnostics {
  const fallback: AnalyticsDiagnostics = {
    supabaseConfigured,
    lastInsertResult: null,
    lastInsertError: null,
    lastInsertAt: null,
    totalLocalEvents: safeReadLocal().length,
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(DIAG_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AnalyticsDiagnostics>;
    return {
      ...fallback,
      ...parsed,
      supabaseConfigured,
      totalLocalEvents: safeReadLocal().length,
    };
  } catch {
    return fallback;
  }
}

function writeDiag(diag: AnalyticsDiagnostics): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DIAG_KEY, JSON.stringify(diag));
  } catch {
    /* ignore */
  }
}

export function getDiagnostics(): AnalyticsDiagnostics {
  return readDiag();
}

/**
 * Track a funnel event. Always persists to localStorage; opportunistically
 * syncs to Supabase. Never throws.
 */
export async function trackFunnelEvent(payload: FunnelPayload): Promise<void> {
  const record: FunnelEventRecord = {
    id: uuid(),
    event: payload.event,
    role_selected: payload.role_selected ?? null,
    template_slug: payload.template_slug ?? null,
    invite_email: payload.invite_email ?? null,
    ab_variant: payload.ab_variant ?? null,
    created_at: new Date().toISOString(),
  };

  // 1. Always persist to localStorage.
  const local = safeReadLocal();
  local.push(record);
  safeWriteLocal(local);

  const diag = readDiag();
  diag.totalLocalEvents = local.length;

  // 2. Best-effort sync to Supabase.
  if (!supabaseConfigured) {
    diag.lastInsertResult = 'skipped';
    diag.lastInsertError = null;
    diag.lastInsertAt = record.created_at;
    writeDiag(diag);
    return;
  }

  try {
    const { error } = await supabase.from('funnel_events').insert({
      id: record.id,
      event: record.event,
      role_selected: record.role_selected,
      template_slug: record.template_slug,
      invite_email: record.invite_email,
      ab_variant: record.ab_variant,
      created_at: record.created_at,
    });
    if (error) {
      diag.lastInsertResult = 'error';
      diag.lastInsertError = error.message;
      // Surface in console so devs notice during local development.
      // eslint-disable-next-line no-console
      console.warn('[analytics] Supabase insert failed:', error.message);
    } else {
      diag.lastInsertResult = 'ok';
      diag.lastInsertError = null;
    }
  } catch (err) {
    diag.lastInsertResult = 'error';
    diag.lastInsertError = err instanceof Error ? err.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.warn('[analytics] Supabase insert threw:', diag.lastInsertError);
  }

  diag.lastInsertAt = record.created_at;
  writeDiag(diag);
}

/**
 * Fetch events from Supabase. Returns empty array if not configured, or on error.
 * Errors are returned so the dashboard can show diagnostic info.
 */
export async function fetchRemoteEvents(): Promise<{
  events: FunnelEventRecord[];
  error: string | null;
}> {
  if (!supabaseConfigured) {
    return { events: [], error: null };
  }
  try {
    const { data, error } = await supabase
      .from('funnel_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5000);
    if (error) {
      return { events: [], error: error.message };
    }
    const remote = (data ?? []).map(
      (e: Record<string, unknown>): FunnelEventRecord => ({
        id: String(e.id ?? uuid()),
        event: e.event as FunnelEventName,
        role_selected: (e.role_selected as string | null) ?? null,
        template_slug: (e.template_slug as string | null) ?? null,
        invite_email: (e.invite_email as string | null) ?? null,
        ab_variant: (e.ab_variant as 'A' | 'B' | null) ?? null,
        created_at: String(e.created_at ?? new Date().toISOString()),
        source: 'remote',
      }),
    );
    return { events: remote, error: null };
  } catch (err) {
    return {
      events: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Merge two event lists, deduplicating by id. Local events keep the 'local'
 * source; events present in both keep 'remote'.
 */
export function mergeEvents(
  local: FunnelEventRecord[],
  remote: FunnelEventRecord[],
): FunnelEventRecord[] {
  const byId = new Map<string, FunnelEventRecord>();
  for (const e of local) byId.set(e.id, e);
  for (const e of remote) byId.set(e.id, e);
  return Array.from(byId.values()).sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

/**
 * Seed deterministic-but-realistic demo events into localStorage. Useful for
 * portfolio reviewers who won't manually go through onboarding 50 times.
 */
export function seedDemoEvents(count = 120): FunnelEventRecord[] {
  const roles = ['marketing', 'developers', 'legal', 'hr'] as const;
  const roleWeights = [0.4, 0.3, 0.15, 0.15];
  const templates: Record<string, string[]> = {
    marketing: ['seo-analyzer', 'content-generator', 'campaign-optimizer', 'audience-insights'],
    developers: ['api-debugger', 'code-reviewer', 'cicd-monitor', 'docs-generator'],
    legal: ['contract-analyzer', 'compliance-checker', 'ip-research', 'regulatory-monitor'],
    hr: ['resume-screener', 'employee-onboarder', 'policy-generator', 'sentiment-analyzer'],
  };
  const proTemplates = new Set([
    'audience-insights',
    'docs-generator',
    'regulatory-monitor',
    'sentiment-analyzer',
  ]);

  const pickWeighted = <T,>(items: readonly T[], weights: number[]): T => {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
      acc += weights[i];
      if (r <= acc) return items[i];
    }
    return items[items.length - 1];
  };

  const out: FunnelEventRecord[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    // Spread across the last 14 days, weighted toward recent.
    const dayOffset = Math.floor(Math.pow(Math.random(), 1.6) * 14);
    const ts = new Date(now - dayOffset * dayMs - Math.random() * dayMs).toISOString();
    const variant: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';

    // Always emit a signup_view.
    out.push(makeEvent('signup_view', { ab_variant: variant, created_at: ts }));

    // Variant A (control / blank chat) drops most users.
    const continueP = variant === 'B' ? 0.78 : 0.32;
    if (Math.random() > continueP) continue;

    // Role selected.
    const role = pickWeighted(roles, roleWeights);
    out.push(
      makeEvent('role_selected', {
        ab_variant: variant,
        role_selected: role,
        created_at: stepTime(ts, 0.5),
      }),
    );

    // Template clicked (1–3 in variant B, 0–1 in A).
    const tmplCount = variant === 'B' ? 1 + Math.floor(Math.random() * 3) : Math.random() < 0.4 ? 1 : 0;
    for (let t = 0; t < tmplCount; t++) {
      const slug = templates[role][Math.floor(Math.random() * templates[role].length)];
      out.push(
        makeEvent('template_clicked', {
          ab_variant: variant,
          role_selected: role,
          template_slug: slug,
          created_at: stepTime(ts, 1 + t * 0.3),
        }),
      );
      // Sometimes hits a paywall on a Pro template.
      if (proTemplates.has(slug) && Math.random() < 0.55) {
        out.push(
          makeEvent('paywall_viewed', {
            ab_variant: variant,
            template_slug: slug,
            created_at: stepTime(ts, 1.2 + t * 0.3),
          }),
        );
        if (Math.random() < 0.32) {
          out.push(
            makeEvent('upgrade_intent_clicked', {
              ab_variant: variant,
              template_slug: slug,
              created_at: stepTime(ts, 1.4 + t * 0.3),
            }),
          );
        }
      }
    }

    // Team invite (only some users, more in B).
    const inviteP = variant === 'B' ? 0.42 : 0.08;
    if (Math.random() < inviteP) {
      out.push(
        makeEvent('team_invite_sent', {
          ab_variant: variant,
          invite_email: `teammate${Math.floor(Math.random() * 999)}@example.com`,
          created_at: stepTime(ts, 2.5),
        }),
      );
    }
  }

  // Append to existing local events (don't wipe).
  const existing = safeReadLocal();
  const next = [...existing, ...out];
  safeWriteLocal(next);
  return out;
}

function makeEvent(
  event: FunnelEventName,
  fields: Partial<Omit<FunnelEventRecord, 'id' | 'event'>>,
): FunnelEventRecord {
  return {
    id: uuid(),
    event,
    role_selected: fields.role_selected ?? null,
    template_slug: fields.template_slug ?? null,
    invite_email: fields.invite_email ?? null,
    ab_variant: fields.ab_variant ?? null,
    created_at: fields.created_at ?? new Date().toISOString(),
  };
}

function stepTime(baseISO: string, hoursLater: number): string {
  return new Date(new Date(baseISO).getTime() + hoursLater * 60 * 60 * 1000).toISOString();
}
