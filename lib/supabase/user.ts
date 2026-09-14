import { cache } from "react";
import { createClient } from "./server";

/**
 * Session de la requête courante, mémorisée par `react.cache`.
 *
 * `app/layout.tsx` et `app/page.tsx` ont tous deux besoin de savoir si un
 * utilisateur est connecté (le layout pour charger sa progression, la page
 * pour choisir entre la landing publique et le tableau de bord).
 * `supabase.auth.getUser()` fait un aller-retour réseau pour valider le JWT :
 * sans cette mémoïsation, `/` en paierait deux par requête.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
