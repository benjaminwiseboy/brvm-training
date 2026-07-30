import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNextPath } from "@/lib/safeRedirect";

/**
 * Point d'entrée commun aux liens "confirmer l'inscription" et
 * "réinitialiser le mot de passe". @supabase/ssr force le flow PKCE
 * (lib/supabase/server.ts) : même le template email PAR DÉFAUT, non
 * édité, redirige vers `emailRedirectTo`/`redirectTo` (lib/actions/
 * auth.ts) avec un `?code=...` — cette route l'échange contre une
 * session dans nos propres cookies. Pas besoin d'éditer les templates
 * Supabase (ce qui nécessite un SMTP custom sur ce projet).
 *
 * Limite connue du flow PKCE : le code n'est échangeable que par le
 * même navigateur qui a initié l'inscription/le reset (le "code
 * verifier" vit dans un cookie posé à ce moment-là) — ouvrir le lien
 * depuis un autre appareil/navigateur tombe sur /auth/auth-code-error.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    }
  }

  redirect("/auth/auth-code-error");
}
