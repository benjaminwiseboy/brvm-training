// Utilitaires partagés des scénarios k6 (docs/LOAD-TESTING.md).

/** Profils de charge : même scénario, intensité différente. */
export const PROFILES = {
  // Vérifie que le script tourne (à lancer avant tout le reste).
  smoke: { stages: [{ duration: "30s", target: 2 }] },
  // Trafic « jour de lancement » réaliste : montée, plateau, descente.
  load: {
    stages: [
      { duration: "1m", target: 20 },
      { duration: "3m", target: 20 },
      { duration: "1m", target: 0 },
    ],
  },
  // Cherche le point de rupture : on monte jusqu'à ce que les seuils cassent.
  stress: {
    stages: [
      { duration: "2m", target: 50 },
      { duration: "2m", target: 100 },
      { duration: "2m", target: 150 },
      { duration: "1m", target: 0 },
    ],
  },
  // Pic soudain (post Facebook/WhatsApp partagé en masse).
  spike: {
    stages: [
      { duration: "20s", target: 5 },
      { duration: "10s", target: 120 },
      { duration: "1m", target: 120 },
      { duration: "20s", target: 0 },
    ],
  },
};

export function profile() {
  const name = __ENV.PROFILE || "smoke";
  const p = PROFILES[name];
  if (!p) throw new Error(`PROFILE inconnu : ${name} (smoke|load|stress|spike)`);
  return p;
}

/** URLs de PRODUCTION : un test de charge n'y est JAMAIS lancé. */
const PROD_URLS = ["https://brvm-training.vercel.app"].concat(
  (__ENV.PROD_URLS || "").split(",").filter(Boolean),
);

export function assertNotProduction(url) {
  const clean = (url || "").replace(/\/+$/, "");
  if (!clean) throw new Error("Variable d'environnement manquante (BASE_URL / SUPABASE_URL).");
  if (PROD_URLS.some((p) => clean.startsWith(p.replace(/\/+$/, "")))) {
    throw new Error(`Refus : ${clean} est une URL de PRODUCTION. Ciblez l'environnement dev.`);
  }
  if (__ENV.SUPABASE_PROD_REF && clean.includes(__ENV.SUPABASE_PROD_REF)) {
    throw new Error("Refus : SUPABASE_URL pointe sur le projet Supabase de PRODUCTION.");
  }
  return clean;
}

/** En-tête de contournement de la Deployment Protection Vercel (previews). */
export function bypassHeaders() {
  return __ENV.VERCEL_BYPASS ? { "x-vercel-protection-bypass": __ENV.VERCEL_BYPASS } : {};
}
