/**
 * Portes d'entrée de la landing vers l'app.
 *
 * `START_HREF` est la cible de tous les CTA « Démarrer gratuitement ». Elle
 * pointe sur la création de compte : c'est l'action que la page promet, et
 * `/login` renvoie de toute façon vers `/signup` pour un nouveau visiteur.
 * Passez-la à "/login" si vous préférez l'entrée par la connexion.
 */
export const START_HREF = "/signup";
export const LOGIN_HREF = "/login";
