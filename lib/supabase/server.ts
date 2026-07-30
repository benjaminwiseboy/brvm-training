import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase pour Server Components / Route Handlers / Server
 * Actions. `setAll` peut échouer dans un Server Component pur (lecture
 * seule) — sans conséquence : `proxy.ts` rafraîchit déjà le cookie de
 * session sur chaque requête, donc on peut ignorer l'erreur ici.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component (lecture seule) : sans effet,
            // proxy.ts se charge du rafraîchissement de session.
          }
        },
      },
    }
  );
}
