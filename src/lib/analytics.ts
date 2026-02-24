import { supabase } from './supabase';

type FunnelEvent = 'signup_view' | 'role_selected' | 'template_clicked';

interface FunnelPayload {
  event: FunnelEvent;
  role_selected?: string;
  template_slug?: string;
}

export async function trackFunnelEvent(payload: FunnelPayload): Promise<void> {
  try {
    await supabase.from('funnel_events').insert({
      event: payload.event,
      role_selected: payload.role_selected ?? null,
      template_slug: payload.template_slug ?? null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Analytics should never block the UI
  }
}
