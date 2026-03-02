import { supabase } from './supabase';

type FunnelEvent = 'signup_view' | 'role_selected' | 'template_clicked' | 'team_invite_sent' | 'paywall_viewed' | 'upgrade_intent_clicked';

interface FunnelPayload {
  event: FunnelEvent;
  role_selected?: string;
  template_slug?: string;
  invite_email?: string;
  ab_variant?: 'A' | 'B';
}

export async function trackFunnelEvent(payload: FunnelPayload): Promise<void> {
  try {
    await supabase.from('funnel_events').insert({
      event: payload.event,
      role_selected: payload.role_selected ?? null,
      template_slug: payload.template_slug ?? null,
      invite_email: payload.invite_email ?? null,
      ab_variant: payload.ab_variant ?? null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Analytics should never block the UI
  }
}
