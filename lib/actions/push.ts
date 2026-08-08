"use server";

import { createClient } from "@/lib/supabase/server";

export type PushSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

/**
 * `onConflict: "endpoint"` — un même navigateur qui se réabonne (ex. après
 * avoir révoqué puis réaccepté la permission) renvoie souvent le même
 * endpoint : upsert plutôt qu'insert pour ne pas violer la contrainte unique.
 */
export async function subscribeToPush(subscription: PushSubscriptionInput): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) return { error: error.message };
  return {};
}

export async function unsubscribeFromPush(endpoint: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) return { error: error.message };
  return {};
}
