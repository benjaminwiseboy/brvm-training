import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client service-role — contourne la RLS. `import "server-only"` fait
 * échouer le build si ce module est jamais importé depuis du code
 * client. Un SEUL point d'appel dans tout le projet : la migration de
 * la progression locale à l'inscription (lib/actions/auth.ts), où
 * l'utilisateur n'a pas encore de session (email non confirmé).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
