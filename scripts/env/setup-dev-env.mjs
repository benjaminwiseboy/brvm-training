#!/usr/bin/env node
/**
 * Câble l'environnement DEV (docs/ENVIRONMENTS.md §3) :
 *   - Vercel : les variables de portée Preview pointent sur le projet Supabase dev
 *     (les valeurs Production ne sont JAMAIS modifiées) ;
 *   - GitHub : environnement `dev` (secrets) + variables de dépôt DEV_*.
 *
 * À lancer par le propriétaire, depuis la racine du dépôt :
 *   node scripts/env/setup-dev-env.mjs <ref-projet-dev>             # applique
 *   node scripts/env/setup-dev-env.mjs <ref-projet-dev> --dry-run   # montre le plan, n'écrit rien
 *
 * Aucune valeur secrète n'est affichée : elles transitent uniquement par
 * l'entrée standard des CLI (supabase → vercel / gh).
 *
 * Prérequis : `npx supabase login`, `vercel login`, `gh auth login` faits.
 */
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import webpush from "web-push";

const PROD_REF = "arokxyrimpyoiandwfpe";
const VERCEL_PROJECT = "brvm-training";
const VERCEL_SCOPE = "wiseboy-s-projects";
const REPO = "benjaminwiseboy/brvm-training";
const DEV_URL = "https://brvm-training-git-develop-wiseboy-s-projects.vercel.app";

const ref = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!/^[a-z]{20}$/.test(ref ?? "")) fail("Usage : node scripts/env/setup-dev-env.mjs <ref-projet-dev> [--dry-run]");
if (ref === PROD_REF) fail("Refus : cette référence est celle du projet de PRODUCTION.");

// ── utilitaires ────────────────────────────────────────────────────────────
function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

/**
 * Lance une CLI ; `input` (secret éventuel) passe par stdin, jamais en argument.
 * `shell` est requis sous Windows pour résoudre npx/vercel/gh (.cmd) : Node
 * émet alors l'avertissement DEP0190, sans risque ici car aucun argument ne
 * vient d'une saisie libre (constantes + référence validée par regex).
 */
function run(cmd, args, { input, allowFail = false } = {}) {
  const res = spawnSync(cmd, args, { input, encoding: "utf8", shell: process.platform === "win32" });
  if (res.status !== 0 && !allowFail) {
    // stderr peut contenir du contexte utile, jamais nos valeurs (passées par stdin).
    fail(`${cmd} ${args.slice(0, 3).join(" ")} … a échoué :\n${(res.stderr || res.stdout || "").slice(0, 600)}`);
  }
  return res;
}

function json(text) {
  const start = text.search(/[[{]/);
  if (start === -1) throw new Error("Réponse non JSON");
  return JSON.parse(text.slice(start));
}

/** Parcourt un JSON quelconque et renvoie tous les objets qui satisfont `pred`. */
function collect(node, pred, out = []) {
  if (Array.isArray(node)) node.forEach((n) => collect(n, pred, out));
  else if (node && typeof node === "object") {
    if (pred(node)) out.push(node);
    Object.values(node).forEach((n) => collect(n, pred, out));
  }
  return out;
}

const vercelApi = (method, path, body) =>
  run("vercel", ["api", path, "-X", method, "--scope", VERCEL_SCOPE, "--raw", ...(body ? ["--input", "-"] : [])], {
    input: body ? JSON.stringify(body) : undefined,
    allowFail: true,
  });

// ── 1. Clés du projet dev ──────────────────────────────────────────────────
console.log(`→ Lecture des clés du projet dev ${ref}…`);
const keysRes = run("npx", ["supabase", "projects", "api-keys", `--remote=${ref}`, "--reveal", "--output-format", "json"]);
const keyObjs = collect(json(keysRes.stdout), (o) => typeof o.api_key === "string" && (o.name || o.type));
const pick = (...names) =>
  keyObjs.find((k) => names.includes(String(k.name ?? "").toLowerCase()) || names.includes(String(k.type ?? "").toLowerCase()))?.api_key;

const anonKey = pick("anon", "publishable");
const serviceKey = pick("service_role", "secret");
if (!anonKey || !serviceKey) fail("Clés anon / service_role introuvables dans la réponse de la CLI Supabase.");

const vapid = webpush.generateVAPIDKeys();

/** Valeurs Preview (dev). VAPID_SUBJECT reste partagé : ce n'est pas un secret. */
const previewValues = {
  NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  SUPABASE_SERVICE_ROLE_KEY: serviceKey,
  NEXT_PUBLIC_SITE_URL: DEV_URL,
  CRON_SECRET: randomBytes(32).toString("hex"),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: vapid.publicKey,
  VAPID_PRIVATE_KEY: vapid.privateKey,
};

// ── 2. Vercel : séparer Preview de Production ──────────────────────────────
console.log("→ Variables Vercel…");
const listRes = vercelApi("GET", `/v9/projects/${VERCEL_PROJECT}/env?decrypt=false`);
if (listRes.status !== 0) fail("Impossible de lister les variables Vercel (vercel login ?).");
const envs = json(listRes.stdout).envs ?? [];

for (const [key, value] of Object.entries(previewValues)) {
  const records = envs.filter((e) => e.key === key);
  const shared = records.find((e) => e.target?.includes("preview") && e.target?.includes("production"));
  const previewOnly = records.find((e) => e.target?.length === 1 && e.target[0] === "preview");
  const type = shared?.type ?? previewOnly?.type ?? "encrypted";

  if (dryRun) {
    console.log(
      `  [dry-run] ${key.padEnd(30)} ${shared ? "partagée → restreinte à Production, " : ""}${previewOnly ? "Preview mise à jour" : "Preview créée"}`,
    );
    continue;
  }

  // a) Restreindre l'enregistrement partagé à la Production. S'il échoue, on
  //    s'arrête AVANT de créer quoi que ce soit : la prod reste intacte.
  if (shared) {
    const r = vercelApi("PATCH", `/v9/projects/${VERCEL_PROJECT}/env/${shared.id}`, { target: ["production"] });
    if (r.status !== 0) fail(`${key} : impossible de restreindre la valeur partagée à Production (rien n'a été modifié pour cette variable).`);
  }

  // b) Créer ou mettre à jour la valeur Preview (dev).
  const r = previewOnly
    ? vercelApi("PATCH", `/v9/projects/${VERCEL_PROJECT}/env/${previewOnly.id}`, { value, type })
    : vercelApi("POST", `/v10/projects/${VERCEL_PROJECT}/env`, { key, value, type, target: ["preview"] });
  if (r.status !== 0) fail(`${key} : échec de l'écriture de la valeur Preview. La valeur Production est intacte ; relancez le script.`);
  console.log(`  ✓ ${key}`);
}

// ── 3. GitHub : environnement `dev` + variables de dépôt ───────────────────
console.log("→ GitHub…");
const ghSecrets = {
  SUPABASE_PROJECT_REF: ref,
  DEV_SUPABASE_ANON_KEY: anonKey,
  LOADTEST_PASSWORD: randomBytes(18).toString("base64url"),
};
const ghVars = { DEV_BASE_URL: DEV_URL, DEV_SUPABASE_URL: `https://${ref}.supabase.co` };

if (dryRun) {
  console.log(`  [dry-run] environnement dev ; secrets : ${Object.keys(ghSecrets).join(", ")} ; variables : ${Object.keys(ghVars).join(", ")}`);
} else {
  run("gh", ["api", "-X", "PUT", `repos/${REPO}/environments/dev`]);
  for (const [name, value] of Object.entries(ghSecrets)) {
    run("gh", ["secret", "set", name, "--env", "dev", "--repo", REPO], { input: value });
    console.log(`  ✓ secret dev/${name}`);
  }
  for (const [name, value] of Object.entries(ghVars)) {
    run("gh", ["variable", "set", name, "--repo", REPO, "--body", value]);
    console.log(`  ✓ variable ${name}`);
  }
}

// ── 4. Reste à faire à la main ─────────────────────────────────────────────
console.log(`
${dryRun ? "Dry-run terminé : rien n'a été écrit." : "✓ Câblage terminé."}

Reste à faire (secrets que vous seul connaissez) :
  1. gh secret set SUPABASE_DB_PASSWORD --env dev --repo ${REPO}
       (mot de passe de la base DEV choisi à la création)
  2. Dashboard Supabase du projet dev → Authentication → URL Configuration :
       Site URL       : ${DEV_URL}
       Redirect URLs  : ${DEV_URL}/**
                        https://brvm-training-*-wiseboy-s-projects.vercel.app/**
                        http://localhost:3000/**
  3. Redéployer une preview pour prendre en compte les nouvelles variables.
`);
