import { supabase } from './supabase';

type FunnelEvent = 'signup_view' | 'role_selected' | 'template_clicked' | 'team_invite_sent';

interface FunnelPayload {
  event: FunnelEvent;
  role_selected?: string;
  template_slug?: string;
  invite_email?: string;
}

export async function trackFunnelEvent(payload: FunnelPayload): Promise<void> {
  try {
    await supabase.from('funnel_events').insert({
      event: payload.event,
      role_selected: payload.role_selected ?? null,
      template_slug: payload.template_slug ?? null,
      invite_email: payload.invite_email ?? null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Analytics should never block the UI
  }
}
