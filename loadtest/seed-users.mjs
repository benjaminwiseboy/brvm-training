#!/usr/bin/env node
// Crée les comptes de test du scénario progress-sync, sur le projet
// Supabase DEV uniquement.
//
//   SUPABASE_URL=https://<ref-dev>.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
//   LOADTEST_PASSWORD=... SUPABASE_DEV_REF=<ref-dev> node loadtest/seed-users.mjs 50
//
// Comptes loadtest+N@brvm-learning.test (domaine .test réservé : aucun
// email réel n'est jamais envoyé). Nettoyage : ajouter --delete.
const url = process.env.SUPABASE_URL ?? "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.LOADTEST_PASSWORD;
const devRef = process.env.SUPABASE_DEV_REF;
const count = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 20);
const del = process.argv.includes("--delete");

if (!devRef || !url.includes(devRef)) {
  console.error("Refus : SUPABASE_DEV_REF doit être défini ET apparaître dans SUPABASE_URL (garde-fou anti-prod).");
  process.exit(1);
}
if (!key || (!password && !del)) {
  console.error("SUPABASE_SERVICE_ROLE_KEY et LOADTEST_PASSWORD sont requis.");
  process.exit(1);
}

const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

async function listTestUsers() {
  const users = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=200`, { headers });
    const { users: batch = [] } = await res.json();
    users.push(...batch.filter((u) => u.email?.endsWith("@brvm-learning.test")));
    if (batch.length < 200) return users;
  }
}

if (del) {
  const users = await listTestUsers();
  for (const u of users) await fetch(`${url}/auth/v1/admin/users/${u.id}`, { method: "DELETE", headers });
  console.log(`${users.length} compte(s) de test supprimé(s).`);
  process.exit(0);
}

let created = 0;
for (let i = 1; i <= count; i++) {
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: `loadtest+${i}@brvm-learning.test`, password, email_confirm: true }),
  });
  if (res.ok) created++;
  else if (res.status !== 422) console.warn(`#${i} : HTTP ${res.status} ${await res.text()}`);
}
console.log(`${created} compte(s) créé(s) (${count - created} existaient déjà).`);
