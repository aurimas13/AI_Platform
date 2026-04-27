import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Loader2,
  ArrowRight,
  Users,
  MousePointerClick,
  LayoutGrid,
  Send,
  Activity,
  RefreshCw,
  Download,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Database,
  HardDrive,
  Wifi,
  WifiOff,
  Copy,
  Check,
} from 'lucide-react';
import TopNav from './TopNav';
import { supabase, supabaseConfigured } from '../lib/supabase';
import {
  loadLocalEvents,
  fetchRemoteEvents,
  mergeEvents,
  seedDemoEvents,
  clearLocalEvents,
  getDiagnostics,
  type FunnelEventRecord,
  type AnalyticsDiagnostics,
} from '../lib/analytics';

type DateRange = '24h' | '7d' | '30d' | 'all';
type ABFilter = 'all' | 'A' | 'B';

const SQL_SCHEMA = `-- Run this in your Supabase SQL editor.
create table if not exists funnel_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  role_selected text,
  template_slug text,
  invite_email text,
  ab_variant text check (ab_variant in ('A', 'B')),
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_created_at_idx
  on funnel_events (created_at desc);
create index if not exists funnel_events_event_idx
  on funnel_events (event);

-- RLS: allow anonymous inserts (web SDK uses the anon key) and reads.
alter table funnel_events enable row level security;

create policy "anon can insert events"
  on funnel_events for insert to anon
  with check (true);

create policy "anon can read events"
  on funnel_events for select to anon
  using (true);`;

export default function MetricsDashboard() {
  const [localEvents, setLocalEvents] = useState<FunnelEventRecord[]>([]);
  const [remoteEvents, setRemoteEvents] = useState<FunnelEventRecord[]>([]);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [diag, setDiag] = useState<AnalyticsDiagnostics>(() => getDiagnostics());
  const [diagOpen, setDiagOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [abFilter, setAbFilter] = useState<ABFilter>('all');
  const [seeding, setSeeding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setLocalEvents(loadLocalEvents());
    const { events, error } = await fetchRemoteEvents();
    setRemoteEvents(events);
    setRemoteError(error);
    setDiag(getDiagnostics());
    setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Real-time subscription to live updates from Supabase.
  useEffect(() => {
    if (!supabaseConfigured) return;
    const channel = supabase
      .channel('funnel_events_live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'funnel_events' },
        () => {
          void refresh();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  // Merged + deduped event list (local takes precedence on id collision via mergeEvents order).
  const allEvents = useMemo(
    () => mergeEvents(localEvents, remoteEvents),
    [localEvents, remoteEvents],
  );

  // Filter by date range.
  const dateFiltered = useMemo(() => {
    if (dateRange === 'all') return allEvents;
    const cutoffMs: Record<Exclude<DateRange, 'all'>, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    const cutoff = Date.now() - cutoffMs[dateRange];
    return allEvents.filter((e) => new Date(e.created_at).getTime() >= cutoff);
  }, [allEvents, dateRange]);

  // Filter by A/B variant.
  const events = useMemo(() => {
    if (abFilter === 'all') return dateFiltered;
    return dateFiltered.filter((e) => e.ab_variant === abFilter);
  }, [dateFiltered, abFilter]);

  // Compute funnel counts.
  const funnel = useMemo(() => buildFunnel(events), [events]);
  const variantA = useMemo(
    () => buildFunnel(dateFiltered.filter((e) => e.ab_variant === 'A')),
    [dateFiltered],
  );
  const variantB = useMemo(
    () => buildFunnel(dateFiltered.filter((e) => e.ab_variant === 'B')),
    [dateFiltered],
  );

  // Time series.
  const timeSeries = useMemo(
    () => buildTimeSeries(dateFiltered, dateRange),
    [dateFiltered, dateRange],
  );

  const handleSeed = async () => {
    setSeeding(true);
    seedDemoEvents(120);
    setLocalEvents(loadLocalEvents());
    setDiag(getDiagnostics());
    setSeeding(false);
  };

  const handleClear = () => {
    if (!confirm('Clear all locally-tracked events? Remote Supabase data is untouched.')) return;
    clearLocalEvents();
    setLocalEvents([]);
    setDiag(getDiagnostics());
  };

  const handleExport = () => {
    const rows = [
      ['id', 'event', 'role_selected', 'template_slug', 'invite_email', 'ab_variant', 'created_at', 'source'],
      ...events.map((e) => [
        e.id,
        e.event,
        e.role_selected ?? '',
        e.template_slug ?? '',
        e.invite_email ?? '',
        e.ab_variant ?? '',
        e.created_at,
        e.source ?? 'local',
      ]),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(','),
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funnel-events-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <TopNav />

      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-6xl mx-auto w-full">
        {/* Hero */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full">
              Live funnel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 text-stone-900">
            Funnel metrics
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl">
            Every interaction in this app is instrumented end-to-end. Events are stored locally in your browser and, when configured, mirrored to Supabase in real time.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <SegmentedControl
            value={dateRange}
            onChange={(v) => setDateRange(v as DateRange)}
            options={[
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
              { value: 'all', label: 'All' },
            ]}
          />
          <SegmentedControl
            value={abFilter}
            onChange={(v) => setAbFilter(v as ABFilter)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'A', label: 'Variant A' },
              { value: 'B', label: 'Variant B' },
            ]}
          />
          <div className="flex-1" />
          <button
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 rounded-lg text-sm font-medium text-stone-700 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExport}
            disabled={events.length === 0}
            className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 rounded-lg text-sm font-medium text-stone-700 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        {/* Diagnostics panel */}
        <DiagnosticsPanel
          diag={diag}
          remoteError={remoteError}
          localCount={localEvents.length}
          remoteCount={remoteEvents.length}
          open={diagOpen}
          onToggle={() => setDiagOpen((o) => !o)}
        />

        {loading ? (
          <div className="flex items-center gap-3 text-stone-500 py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading events&hellip;
          </div>
        ) : events.length === 0 ? (
          <EmptyState onSeed={handleSeed} seeding={seeding} />
        ) : (
          <>
            {/* Funnel stages */}
            <FunnelStages funnel={funnel} />

            {/* Conversion + viral rate */}
            <ConversionStrip funnel={funnel} />

            {/* A/B comparison */}
            {abFilter === 'all' && (variantA.signupViews > 0 || variantB.signupViews > 0) && (
              <ABCompareSection a={variantA} b={variantB} />
            )}

            {/* Time series */}
            <TimeSeriesChart series={timeSeries} dateRange={dateRange} />

            {/* Breakdowns */}
            <BreakdownGrid events={events} />

            {/* Footer actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-10 pt-6 border-t border-stone-200/60">
              <p className="text-xs text-stone-500">
                <strong className="text-stone-900">{events.length}</strong> events in view{' '}
                &middot; <strong className="text-stone-900">{allEvents.length}</strong> total tracked
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 rounded-lg text-xs font-medium text-stone-700 transition-all disabled:opacity-60"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brass-600" />
                  Seed demo data
                </button>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:border-red-300 hover:text-red-700 rounded-lg text-xs font-medium text-stone-700 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear local events
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function SegmentedControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-flex bg-white border border-stone-200 shadow-card rounded-lg p-0.5 overflow-x-auto">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 h-8 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            value === o.value
              ? 'bg-stone-900 text-cream-50'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DiagnosticsPanel({
  diag,
  remoteError,
  localCount,
  remoteCount,
  open,
  onToggle,
}: {
  diag: AnalyticsDiagnostics;
  remoteError: string | null;
  localCount: number;
  remoteCount: number;
  open: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const remoteHealthy =
    diag.supabaseConfigured &&
    diag.lastInsertResult !== 'error' &&
    !remoteError;

  const StatusIcon = !diag.supabaseConfigured
    ? WifiOff
    : remoteHealthy
      ? Wifi
      : AlertTriangle;
  const statusColor = !diag.supabaseConfigured
    ? 'text-stone-500'
    : remoteHealthy
      ? 'text-emerald-600'
      : 'text-amber-600';
  const statusLabel = !diag.supabaseConfigured
    ? 'Local-only mode'
    : remoteHealthy
      ? 'Live (local + Supabase)'
      : 'Local-only \u2014 Supabase write failing';

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCHEMA);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-white border border-stone-200 shadow-card rounded-xl mb-6 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-cream-50/50 transition-colors text-left"
      >
        <StatusIcon className={`w-4 h-4 ${statusColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900">{statusLabel}</p>
          <p className="text-xs text-stone-500 truncate">
            {localCount} local &middot; {remoteCount} remote events
            {diag.lastInsertAt && (
              <>
                {' '}
                &middot; last write {timeAgo(diag.lastInsertAt)}
              </>
            )}
          </p>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-stone-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-stone-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-stone-200 p-4 sm:p-5 space-y-4 bg-cream-50/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DiagRow
              icon={HardDrive}
              label="LocalStorage"
              status="ok"
              detail={`${localCount} events buffered in this browser`}
            />
            <DiagRow
              icon={Database}
              label="Supabase"
              status={
                !diag.supabaseConfigured
                  ? 'idle'
                  : remoteError || diag.lastInsertResult === 'error'
                    ? 'error'
                    : 'ok'
              }
              detail={
                !diag.supabaseConfigured
                  ? 'Not configured \u2014 set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY'
                  : remoteError
                    ? `Read failed: ${remoteError}`
                    : diag.lastInsertResult === 'error'
                      ? `Last insert failed: ${diag.lastInsertError ?? 'unknown'}`
                      : `${remoteCount} events synced`
              }
            />
          </div>

          {diag.supabaseConfigured &&
            (remoteError || diag.lastInsertResult === 'error') && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Supabase is configured but writes are failing.
                    </p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Likely causes: the <code className="font-mono bg-amber-100 px-1 rounded">funnel_events</code> table
                      doesn&apos;t exist, RLS blocks anonymous inserts, or the schema is missing the{' '}
                      <code className="font-mono bg-amber-100 px-1 rounded">ab_variant</code> column. Run the SQL below in your Supabase project.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <pre className="bg-stone-900 text-cream-100 text-[11px] font-mono p-4 rounded-lg overflow-x-auto leading-relaxed">
                    {SQL_SCHEMA}
                  </pre>
                  <button
                    onClick={copySql}
                    className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 bg-stone-700 hover:bg-stone-600 text-cream-50 text-[11px] font-medium rounded transition-colors"
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
                </div>
              </div>
            )}

          {!diag.supabaseConfigured && (
            <div className="bg-cream-50 border border-stone-200 rounded-lg p-4 text-xs text-stone-600 leading-relaxed">
              <p className="mb-1 font-semibold text-stone-900">Running in local-only mode.</p>
              The dashboard works fully from <code className="font-mono bg-stone-100 px-1 rounded">localStorage</code>.
              To enable team-wide tracking, add{' '}
              <code className="font-mono bg-stone-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
              <code className="font-mono bg-stone-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your Vercel project.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiagRow({
  icon: Icon,
  label,
  status,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  status: 'ok' | 'error' | 'idle';
  detail: string;
}) {
  const StatusBadge =
    status === 'ok' ? CheckCircle2 : status === 'error' ? AlertTriangle : WifiOff;
  const color =
    status === 'ok'
      ? 'text-emerald-600'
      : status === 'error'
        ? 'text-amber-600'
        : 'text-stone-400';
  return (
    <div className="flex items-start gap-3 bg-white border border-stone-200 rounded-lg p-3">
      <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-stone-600" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-stone-900">{label}</p>
          <StatusBadge className={`w-3.5 h-3.5 ${color}`} />
        </div>
        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed break-words">
          {detail}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onSeed, seeding }: { onSeed: () => void; seeding: boolean }) {
  return (
    <div className="bg-white border border-stone-200 shadow-card rounded-2xl p-8 sm:p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-brass-50 border border-brass-200 flex items-center justify-center mx-auto mb-5">
        <Activity className="w-7 h-7 text-brass-600" strokeWidth={1.75} />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-stone-900">
        No events tracked yet
      </h2>
      <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mb-6">
        Go through the onboarding flow on the home page — every click instruments an event. Or seed the dashboard with realistic demo data to see it in action.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
        <button
          onClick={onSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-5 h-11 bg-stone-900 text-cream-50 text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-60"
        >
          {seeding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Seed 120 demo events
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 h-11 bg-white border border-stone-200 shadow-card hover:shadow-card-hover hover:border-brass-300 rounded-xl text-sm font-medium text-stone-700 transition-all"
        >
          Try onboarding
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

interface FunnelCounts {
  signupViews: number;
  rolesSelected: number;
  templatesClicked: number;
  teamInvitesSent: number;
  paywallViews: number;
  upgradeClicks: number;
}

function buildFunnel(events: FunnelEventRecord[]): FunnelCounts {
  const c: FunnelCounts = {
    signupViews: 0,
    rolesSelected: 0,
    templatesClicked: 0,
    teamInvitesSent: 0,
    paywallViews: 0,
    upgradeClicks: 0,
  };
  for (const e of events) {
    if (e.event === 'signup_view') c.signupViews++;
    else if (e.event === 'role_selected') c.rolesSelected++;
    else if (e.event === 'template_clicked') c.templatesClicked++;
    else if (e.event === 'team_invite_sent') c.teamInvitesSent++;
    else if (e.event === 'paywall_viewed') c.paywallViews++;
    else if (e.event === 'upgrade_intent_clicked') c.upgradeClicks++;
  }
  return c;
}

function FunnelStages({ funnel }: { funnel: FunnelCounts }) {
  const stages = [
    { label: 'Signup Views', count: funnel.signupViews, icon: Users },
    { label: 'Roles Selected', count: funnel.rolesSelected, icon: MousePointerClick },
    { label: 'Templates Clicked', count: funnel.templatesClicked, icon: LayoutGrid },
    { label: 'Team Invites Sent', count: funnel.teamInvitesSent, icon: Send },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stages.map((s, i) => {
        const prev = i > 0 ? stages[i - 1].count : 0;
        const dropoff = prev > 0 ? ((s.count / prev) * 100).toFixed(1) : null;
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white border border-stone-200 shadow-card hover:shadow-card-hover transition-shadow rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brass-50 flex items-center justify-center">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brass-600" strokeWidth={1.75} />
              </div>
              {dropoff && (
                <span className="text-[10px] sm:text-xs text-stone-500 font-medium">
                  {dropoff}%
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-0.5 text-stone-900">
              {s.count}
            </p>
            <p className="text-xs sm:text-sm text-stone-600">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function ConversionStrip({ funnel }: { funnel: FunnelCounts }) {
  const conversion =
    funnel.signupViews > 0
      ? ((funnel.templatesClicked / funnel.signupViews) * 100).toFixed(1)
      : '0.0';
  const viral =
    funnel.templatesClicked > 0
      ? ((funnel.teamInvitesSent / funnel.templatesClicked) * 100).toFixed(1)
      : '0.0';
  const upgradeRate =
    funnel.paywallViews > 0
      ? ((funnel.upgradeClicks / funnel.paywallViews) * 100).toFixed(1)
      : '0.0';

  const cards = [
    {
      from: 'Signup views',
      to: 'Templates clicked',
      pct: conversion,
      label: 'conversion',
    },
    {
      from: 'Templates clicked',
      to: 'Invites sent',
      pct: viral,
      label: 'viral rate (K)',
    },
    {
      from: 'Paywall views',
      to: 'Upgrade clicks',
      pct: upgradeRate,
      label: 'upgrade intent',
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white border border-stone-200 shadow-card rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-3 flex-wrap text-xs sm:text-sm text-stone-500">
            <span>{c.from}</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            <span>{c.to}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-brass-600">
              {c.pct}%
            </span>
            <span className="text-xs sm:text-sm text-stone-500">{c.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ABCompareSection({ a, b }: { a: FunnelCounts; b: FunnelCounts }) {
  const conv = (f: FunnelCounts) =>
    f.signupViews > 0 ? ((f.templatesClicked / f.signupViews) * 100).toFixed(1) : '0.0';
  const lift =
    Number(conv(a)) > 0
      ? (((Number(conv(b)) - Number(conv(a))) / Number(conv(a))) * 100).toFixed(0)
      : null;

  const rows = [
    ['Signup views', a.signupViews, b.signupViews],
    ['Roles selected', a.rolesSelected, b.rolesSelected],
    ['Templates clicked', a.templatesClicked, b.templatesClicked],
    ['Invites sent', a.teamInvitesSent, b.teamInvitesSent],
  ];

  return (
    <section className="bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-stone-900 mb-0.5">
            A/B comparison
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Variant A (blank chat / control) vs. Variant B (guided / role-based).
          </p>
        </div>
        {lift !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="text-emerald-700 font-bold text-sm">
              {Number(lift) > 0 ? '+' : ''}
              {lift}%
            </span>
            <span className="text-xs text-emerald-700">B vs A conversion lift</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-stone-500 border-b border-stone-200">
              <th className="text-left font-semibold py-2 pr-3">Stage</th>
              <th className="text-right font-semibold py-2 px-3">Variant A</th>
              <th className="text-right font-semibold py-2 px-3">Variant B</th>
              <th className="text-right font-semibold py-2 pl-3">Delta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, av, bv]) => {
              const delta = (bv as number) - (av as number);
              return (
                <tr key={label as string} className="border-b border-stone-100 last:border-0">
                  <td className="py-2.5 pr-3 text-stone-700 font-medium">{label}</td>
                  <td className="py-2.5 px-3 text-right text-stone-900 font-mono tabular-nums">
                    {av}
                  </td>
                  <td className="py-2.5 px-3 text-right text-stone-900 font-mono tabular-nums">
                    {bv}
                  </td>
                  <td
                    className={`py-2.5 pl-3 text-right font-mono tabular-nums ${
                      delta > 0
                        ? 'text-emerald-700'
                        : delta < 0
                          ? 'text-red-700'
                          : 'text-stone-500'
                    }`}
                  >
                    {delta > 0 ? '+' : ''}
                    {delta}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="py-2.5 pr-3 text-stone-700 font-semibold">
                Conversion (signup → template)
              </td>
              <td className="py-2.5 px-3 text-right text-stone-900 font-mono tabular-nums">
                {conv(a)}%
              </td>
              <td className="py-2.5 px-3 text-right text-stone-900 font-mono tabular-nums font-bold">
                {conv(b)}%
              </td>
              <td className="py-2.5 pl-3 text-right text-emerald-700 font-mono tabular-nums font-bold">
                {lift !== null ? `${Number(lift) > 0 ? '+' : ''}${lift}%` : '\u2014'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface DayBucket {
  date: string;
  signup_view: number;
  role_selected: number;
  template_clicked: number;
  team_invite_sent: number;
  total: number;
}

function buildTimeSeries(events: FunnelEventRecord[], range: DateRange): DayBucket[] {
  const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 14;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const buckets: Record<string, DayBucket> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * dayMs);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = {
      date: key,
      signup_view: 0,
      role_selected: 0,
      template_clicked: 0,
      team_invite_sent: 0,
      total: 0,
    };
  }
  for (const e of events) {
    const key = e.created_at.slice(0, 10);
    const b = buckets[key];
    if (!b) continue;
    if (e.event === 'signup_view') b.signup_view++;
    else if (e.event === 'role_selected') b.role_selected++;
    else if (e.event === 'template_clicked') b.template_clicked++;
    else if (e.event === 'team_invite_sent') b.team_invite_sent++;
    b.total++;
  }
  return Object.values(buckets);
}

function TimeSeriesChart({
  series,
  dateRange,
}: {
  series: DayBucket[];
  dateRange: DateRange;
}) {
  const max = Math.max(1, ...series.map((s) => s.total));
  const w = 100; // viewBox units
  const h = 40;
  const stepX = series.length > 1 ? w / (series.length - 1) : 0;

  const buildPath = (key: keyof Omit<DayBucket, 'date'>): string =>
    series
      .map((s, i) => {
        const x = i * stepX;
        const y = h - (s[key] / max) * h;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');

  const lines = [
    { key: 'signup_view' as const, color: '#845B1E', label: 'Signups', dash: undefined },
    { key: 'role_selected' as const, color: '#B27D2A', label: 'Roles', dash: undefined },
    { key: 'template_clicked' as const, color: '#C8943B', label: 'Templates', dash: undefined },
    { key: 'team_invite_sent' as const, color: '#10B981', label: 'Invites', dash: undefined },
  ];

  return (
    <section className="bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-stone-900 mb-0.5">
            Events over time
          </h3>
          <p className="text-xs text-stone-500">
            {series.length} days &middot; max {max} events/day
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px]">
          {lines.map((l) => (
            <span key={l.key} className="flex items-center gap-1.5 text-stone-600">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: l.color }}
              />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-32 sm:h-40"
        preserveAspectRatio="none"
      >
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={0}
            x2={w}
            y1={h * t}
            y2={h * t}
            stroke="#E7E5E4"
            strokeWidth={0.2}
          />
        ))}
        {lines.map((l) => (
          <path
            key={l.key}
            d={buildPath(l.key)}
            fill="none"
            stroke={l.color}
            strokeWidth={0.7}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* x-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-stone-500 font-mono">
        <span>{formatDay(series[0]?.date)}</span>
        {series.length > 4 && (
          <span>{formatDay(series[Math.floor(series.length / 2)]?.date)}</span>
        )}
        <span>{formatDay(series[series.length - 1]?.date)}</span>
      </div>

      {dateRange === '24h' && (
        <p className="text-[11px] text-stone-500 mt-2">
          Note: with 24h range, this shows just today’s bucket.
        </p>
      )}
    </section>
  );
}

function BreakdownGrid({ events }: { events: FunnelEventRecord[] }) {
  const roleCounts: Record<string, number> = {};
  const templateCounts: Record<string, number> = {};
  for (const e of events) {
    if (e.event === 'role_selected' && e.role_selected) {
      roleCounts[e.role_selected] = (roleCounts[e.role_selected] || 0) + 1;
    }
    if (e.event === 'template_clicked' && e.template_slug) {
      templateCounts[e.template_slug] = (templateCounts[e.template_slug] || 0) + 1;
    }
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <BreakdownCard title="Roles breakdown" counts={roleCounts} emptyMsg="No role events yet." />
      <BreakdownCard
        title="Templates breakdown"
        counts={templateCounts}
        emptyMsg="No template events yet."
      />
    </div>
  );
}

function BreakdownCard({
  title,
  counts,
  emptyMsg,
}: {
  title: string;
  counts: Record<string, number>;
  emptyMsg: string;
}) {
  const max = Math.max(0, ...Object.values(counts));
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <div className="bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6">
      <h3 className="text-base font-semibold mb-4 text-stone-900">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-stone-500">{emptyMsg}</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([k, v]) => {
            const pct = max > 0 ? (v / max) * 100 : 0;
            return (
              <div key={k}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-stone-700 capitalize font-medium truncate mr-2">
                    {k}
                  </span>
                  <span className="text-stone-500 flex-shrink-0 font-mono tabular-nums">
                    {v}
                  </span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brass-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function formatDay(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
