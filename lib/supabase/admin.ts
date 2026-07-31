import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client service-role — contourne la RLS. `import "server-only"` fait
 * échouer le build si ce module est jamais importé depuis du code
 * client. Points d'appel : la migration de la progression locale à
 * l'inscription (lib/actions/auth.ts), où l'utilisateur n'a pas encore
 * de session (email non confirmé) ; et les helpers `last_sign_in_at`
 * ci-dessous (l'API `auth.admin.*` n'est jamais couverte par la RLS,
 * elle exige la clé service-role quel que soit l'appelant).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Dernière connexion de chaque utilisateur (`auth.users.last_sign_in_at`,
 * pas exposé dans `public.profiles`) — pour la colonne "Dernière connexion"
 * de la liste admin. Pagine jusqu'à récupérer une page incomplète plutôt
 * que de fixer une limite arbitraire.
 */
export async function getLastSignInMap(): Promise<Map<string, string | null>> {
  const admin = createAdminClient();
  const map = new Map<string, string | null>();
  const perPage = 200;
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);
    for (const u of data.users) map.set(u.id, u.last_sign_in_at ?? null);
    if (data.users.length < perPage) break;
    page += 1;
  }

  return map;
}

/** Équivalent de `getLastSignInMap()` pour un seul utilisateur (fiche détail). */
export async function getLastSignIn(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error) return null;
  return data.user?.last_sign_in_at ?? null;
}
