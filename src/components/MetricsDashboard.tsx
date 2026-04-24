import { useState, useEffect } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { Hexagon, Loader2, ArrowRight, ArrowLeft, Users, MousePointerClick, LayoutGrid, AlertTriangle, Send } from 'lucide-react';

interface FunnelEvent {
  id: string;
  event: string;
  role_selected: string | null;
  template_slug: string | null;
  invite_email: string | null;
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
  const teamInvitesSent = events.filter((e) => e.event === 'team_invite_sent').length;

  const conversionRate =
    signupViews > 0 ? ((templatesClicked / signupViews) * 100).toFixed(1) : '0.0';

  const viralRate =
    templatesClicked > 0 ? ((teamInvitesSent / templatesClicked) * 100).toFixed(1) : '0.0';

  const stages: FunnelStage[] = [
    { label: 'Signup Views', count: signupViews, icon: Users },
    { label: 'Roles Selected', count: rolesSelected, icon: MousePointerClick },
    { label: 'Templates Clicked', count: templatesClicked, icon: LayoutGrid },
    { label: 'Team Invites Sent', count: teamInvitesSent, icon: Send },
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
    <div className="min-h-screen bg-cream-100 text-stone-900 flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5 border-b border-stone-200/60 bg-cream-100/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <a
            href="https://aurimas.io"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">aurimas.io</span>
            <span className="sm:hidden">Back</span>
          </a>
          <div className="w-px h-4 bg-stone-300" />
          <div className="flex items-center gap-2 min-w-0">
            <Hexagon className="w-6 h-6 sm:w-7 sm:h-7 text-brass-600 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-base sm:text-lg font-semibold tracking-tight truncate">AI Gateway</span>
            <span className="hidden sm:inline-block ml-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brass-600 bg-brass-50 border border-brass-200 rounded-full">
              Metrics
            </span>
          </div>
        </div>
        <a
          href="/case-study"
          className="text-xs sm:text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
        >
          Case study &rarr;
        </a>
      </header>

      <main className="flex-1 px-4 sm:px-10 py-8 sm:py-16 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 text-stone-900">
          Funnel metrics
        </h1>
        <p className="text-stone-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl">
          Live acquisition funnel tracked in Supabase. Every interaction &mdash; from signup view to upgrade intent &mdash; is instrumented.
        </p>

        {loading && (
          <div className="flex items-center gap-3 text-stone-500 py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading events&hellip;
          </div>
        )}

        {error === 'not_configured' && (
          <div className="bg-white border border-stone-200 shadow-card rounded-xl px-6 py-8 mb-8 text-center">
            <AlertTriangle className="w-8 h-8 text-brass-600 mx-auto mb-4" strokeWidth={1.75} />
            <h3 className="text-lg font-semibold mb-2 text-stone-900">Supabase not connected</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-4 leading-relaxed">
              Set <code className="text-stone-900 bg-cream-200 px-1.5 py-0.5 rounded text-xs font-mono">VITE_SUPABASE_URL</code> and{' '}
              <code className="text-stone-900 bg-cream-200 px-1.5 py-0.5 rounded text-xs font-mono">VITE_SUPABASE_ANON_KEY</code> in your{' '}
              <code className="text-stone-900 bg-cream-200 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code> file,
              then create a <code className="text-stone-900 bg-cream-200 px-1.5 py-0.5 rounded text-xs font-mono">funnel_events</code> table.
            </p>
            <p className="text-xs text-stone-500">Restart the dev server after updating .env.local.</p>
          </div>
        )}

        {error && error !== 'not_configured' && (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-8">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Funnel stages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {stages.map((stage, i) => {
                const Icon = stage.icon;
                const dropoff =
                  i > 0 && stages[i - 1].count > 0
                    ? ((stage.count / stages[i - 1].count) * 100).toFixed(1)
                    : null;

                return (
                  <div
                    key={stage.label}
                    className="relative bg-white border border-stone-200 shadow-card hover:shadow-card-hover transition-shadow rounded-xl p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-brass-50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brass-600" strokeWidth={1.75} />
                      </div>
                      {dropoff && (
                        <span className="text-xs text-stone-500 font-medium">
                          {dropoff}% from prev
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-bold tracking-tight mb-1 text-stone-900">{stage.count}</p>
                    <p className="text-sm text-stone-600">{stage.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Conversion & Viral Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                  <span className="text-xs sm:text-sm text-stone-500">Signup views</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                  <span className="text-xs sm:text-sm text-stone-500">Templates clicked</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-brass-600">{conversionRate}%</span>
                  <span className="text-sm text-stone-500">conversion rate</span>
                </div>
              </div>

              <div className="bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                  <span className="text-xs sm:text-sm text-stone-500">Templates clicked</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                  <span className="text-xs sm:text-sm text-stone-500">Invites sent</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-brass-600">{viralRate}%</span>
                  <span className="text-sm text-stone-500">viral rate (K)</span>
                </div>
              </div>
            </div>

            {/* Breakdown tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Roles breakdown */}
              <div className="bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6">
                <h3 className="text-base font-semibold mb-4 text-stone-900">Roles breakdown</h3>
                {Object.keys(roleCounts).length === 0 ? (
                  <p className="text-sm text-stone-500">No role events yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(roleCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([role, count]) => {
                        const max = Math.max(...Object.values(roleCounts));
                        const pct = max > 0 ? (count / max) * 100 : 0;
                        return (
                          <div key={role}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-stone-700 capitalize font-medium">{role}</span>
                              <span className="text-stone-500">{count}</span>
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

              {/* Templates breakdown */}
              <div className="bg-white border border-stone-200 shadow-card rounded-xl p-5 sm:p-6">
                <h3 className="text-base font-semibold mb-4 text-stone-900">Templates breakdown</h3>
                {Object.keys(templateCounts).length === 0 ? (
                  <p className="text-sm text-stone-500">No template events yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(templateCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([slug, count]) => {
                        const max = Math.max(...Object.values(templateCounts));
                        const pct = max > 0 ? (count / max) * 100 : 0;
                        return (
                          <div key={slug}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-stone-700 font-medium truncate mr-2">{slug}</span>
                              <span className="text-stone-500 flex-shrink-0">{count}</span>
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
            </div>

            {/* Total events */}
            <p className="text-xs text-stone-500 mt-8 text-center">
              {events.length} total events tracked
            </p>
          </>
        )}
      </main>
    </div>
  );
}
