// Scénario 2 — apprenants connectés qui avancent dans un module : chaque
// changement de slide déclenche (après debounce) un appel au RPC
// `merge_user_progress`. C'est LE chemin d'écriture chaud de l'app, et la
// base Supabase gratuite est le goulot d'étranglement le plus probable.
//
// On tape directement l'API Supabase (comme le fait le navigateur, avec la
// clé anon + le JWT de l'utilisateur) : pas besoin de reconstruire les
// cookies @supabase/ssr.
//
// Prérequis : comptes de test créés par `node loadtest/seed-users.mjs`.
//   k6 run -e SUPABASE_URL=https://<ref-dev>.supabase.co -e SUPABASE_ANON_KEY=... \
//          -e LOADTEST_PASSWORD=... -e USERS=50 -e PROFILE=load loadtest/progress-sync.js
import http from "k6/http";
import { check, sleep } from "k6";
import { assertNotProduction, profile } from "./lib.js";

const SUPABASE_URL = assertNotProduction(__ENV.SUPABASE_URL);
const ANON = __ENV.SUPABASE_ANON_KEY;
const PASSWORD = __ENV.LOADTEST_PASSWORD;
const USERS = Number(__ENV.USERS || 20);

export const options = {
  ...profile(),
  thresholds: {
    http_req_failed: ["rate<0.01"],
    "http_req_duration{op:merge}": ["p(95)<600", "p(99)<1500"],
    "http_req_duration{op:login}": ["p(95)<1500"],
    checks: ["rate>0.99"],
  },
};

const MODULES = ["m01", "m02", "m03", "m04", "m05"];

/** Connexion des comptes de test une seule fois, avant la charge. */
export function setup() {
  if (!ANON || !PASSWORD) throw new Error("SUPABASE_ANON_KEY et LOADTEST_PASSWORD sont requis.");
  const tokens = [];
  for (let i = 1; i <= USERS; i++) {
    const res = http.post(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      JSON.stringify({ email: `loadtest+${i}@brvm-learning.test`, password: PASSWORD }),
      { headers: { apikey: ANON, "Content-Type": "application/json" }, tags: { op: "login" } },
    );
    if (res.status === 200) tokens.push(res.json("access_token"));
  }
  if (tokens.length === 0) throw new Error("Aucun compte de test n'a pu se connecter (seed-users.mjs lancé ?).");
  return { tokens };
}

export default function learner(data) {
  const token = data.tokens[(__VU - 1) % data.tokens.length];
  const mod = MODULES[__ITER % MODULES.length];
  const state = {
    onboarded: true,
    capital: 1000000 + __ITER * 1000,
    streak: 1,
    completed: {},
    unlockedResources: [],
    resume: { module: mod, slide: (__ITER % 6) + 1 },
  };

  const res = http.post(`${SUPABASE_URL}/rest/v1/rpc/merge_user_progress`, JSON.stringify({ p_state: state }), {
    headers: { apikey: ANON, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    tags: { op: "merge" },
  });
  check(res, { "merge 200": (r) => r.status === 200 });

  // Un apprenant lit une slide ~20-40 s ; on compresse à 2-5 s pour
  // simuler beaucoup plus d'apprenants avec peu d'utilisateurs virtuels.
  sleep(Math.random() * 3 + 2);
}
