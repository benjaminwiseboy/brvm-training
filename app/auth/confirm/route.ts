import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNextPath } from "@/lib/safeRedirect";

/**
 * Point d'entrée commun aux liens "confirmer l'inscription" et
 * "réinitialiser le mot de passe" (cf. Étape 0.5 des templates email
 * Supabase) — sans cette route, `verifyOtp` se ferait sur le domaine
 * hébergé par Supabase et la session n'atterrirait jamais dans nos
 * propres cookies (@supabase/ssr).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = sanitizeNextPath(searchParams.get("next"));

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirect(next);
    }
  }

  redirect("/auth/auth-code-error");
}
