import { useState, useEffect } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { Hexagon, Loader2, ArrowRight, Users, MousePointerClick, LayoutGrid, AlertTriangle } from 'lucide-react';

interface FunnelEvent {
  id: string;
  event: string;
  role_selected: string | null;
  template_slug: string | null;
  created_at: string;
}

interface FunnelStage {
  label: string;
  count: number;
  icon: React.ElementType;
}

export default function MetricsDashboard() {
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabaseConfigured) {
      setError('not_configured');
      setLoading(false);
      return;
    }

    async function fetchEvents() {
      try {
        const { data, error: fetchError } = await supabase
          .from('funnel_events')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setEvents(data ?? []);
      } catch {
        setError('Failed to load funnel data. Check Supabase connection.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const signupViews = events.filter((e) => e.event === 'signup_view').length;
  const rolesSelected = events.filter((e) => e.event === 'role_selected').length;
  const templatesClicked = events.filter((e) => e.event === 'template_clicked').length;

  const conversionRate =
    signupViews > 0 ? ((templatesClicked / signupViews) * 100).toFixed(1) : '0.0';

  const stages: FunnelStage[] = [
    { label: 'Signup Views', count: signupViews, icon: Users },
    { label: 'Roles Selected', count: rolesSelected, icon: MousePointerClick },
    { label: 'Templates Clicked', count: templatesClicked, icon: LayoutGrid },
  ];

  const roleCounts: Record<string, number> = {};
  events
    .filter((e) => e.event === 'role_selected' && e.role_selected)
    .forEach((e) => {
      const r = e.role_selected!;
      roleCounts[r] = (roleCounts[r] || 0) + 1;
    });

  const templateCounts: Record<string, number> = {};
  events
    .filter((e) => e.event === 'template_clicked' && e.template_slug)
    .forEach((e) => {
      const t = e.template_slug!;
      templateCounts[t] = (templateCounts[t] || 0) + 1;
    });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Hexagon className="w-7 h-7 text-white" strokeWidth={1.5} />
          <span className="text-lg font-semibold tracking-tight">nexos.ai</span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-neutral-500 border border-neutral-800 rounded-full">
            Metrics
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 sm:px-10 sm:py-16 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Funnel Metrics
        </h1>
        <p className="text-neutral-500 mb-10">
          Real-time onboarding funnel from Supabase.
        </p>

        {loading && (
          <div className="flex items-center gap-3 text-neutral-400 py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading events...
          </div>
        )}

        {error === 'not_configured' && (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl px-6 py-8 mb-8 text-center">
            <AlertTriangle className="w-8 h-8 text-neutral-500 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold mb-2">Supabase Not Connected</h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mb-4">
              Set <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">VITE_SUPABASE_URL</code> and{' '}
              <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">VITE_SUPABASE_ANON_KEY</code> in your{' '}
              <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">.env.local</code> file,
              then create a <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">funnel_events</code> table
              with columns: <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">id</code>,{' '}
              <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">event</code>,{' '}
              <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">role_selected</code>,{' '}
              <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">template_slug</code>,{' '}
              <code className="text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">created_at</code>.
            </p>
            <p className="text-xs text-neutral-600">Restart the dev server after updating .env.local.</p>
          </div>
        )}

        {error && error !== 'not_configured' && (
          <div className="text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-5 py-4 mb-8">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Funnel stages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {stages.map((stage, i) => {
                const Icon = stage.icon;
                const dropoff =
                  i > 0 && stages[i - 1].count > 0
                    ? ((stage.count / stages[i - 1].count) * 100).toFixed(1)
                    : null;

                return (
                  <div
                    key={stage.label}
                    className="relative bg-neutral-900/50 border border-neutral-800 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
                      </div>
                      {dropoff && (
                        <span className="text-xs text-neutral-600">
                          {dropoff}% from prev
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-bold tracking-tight mb-1">{stage.count}</p>
                    <p className="text-sm text-neutral-500">{stage.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Conversion highlight */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500">Signup Views</span>
                  <ArrowRight className="w-4 h-4 text-neutral-700" />
                  <span className="text-sm text-neutral-500">Templates Clicked</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">{conversionRate}%</span>
                  <span className="text-sm text-neutral-500">conversion rate</span>
                </div>
              </div>
            </div>

            {/* Breakdown tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Roles breakdown */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-base font-semibold mb-4">Roles Breakdown</h3>
                {Object.keys(roleCounts).length === 0 ? (
                  <p className="text-sm text-neutral-600">No role events yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(roleCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([role, count]) => {
                        const max = Math.max(...Object.values(roleCounts));
                        const pct = max > 0 ? (count / max) * 100 : 0;
                        return (
                          <div key={role}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-neutral-300 capitalize">{role}</span>
                              <span className="text-neutral-500">{count}</span>
                            </div>
                            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-white/80 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Templates breakdown */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-base font-semibold mb-4">Templates Breakdown</h3>
                {Object.keys(templateCounts).length === 0 ? (
                  <p className="text-sm text-neutral-600">No template events yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(templateCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([slug, count]) => {
                        const max = Math.max(...Object.values(templateCounts));
                        const pct = max > 0 ? (count / max) * 100 : 0;
                        return (
                          <div key={slug}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-neutral-300">{slug}</span>
                              <span className="text-neutral-500">{count}</span>
                            </div>
                            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-white/80 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Total events */}
            <p className="text-xs text-neutral-600 mt-8 text-center">
              {events.length} total events tracked
            </p>
          </>
        )}
      </main>
    </div>
  );
}
