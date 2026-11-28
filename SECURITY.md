# Politique de sécurité

## Signaler une vulnérabilité

**N'ouvrez pas d'issue publique.** Ce dépôt est public, et une faille décrite en issue est exploitable par tous avant d'être corrigée.

Utilisez le signalement privé de GitHub : onglet **Security → Report a vulnerability** (ou [ce lien](https://github.com/benjaminwiseboy/brvm-training/security/advisories/new)).

Indiquez la route ou le composant concerné, les étapes pour reproduire et l'impact (données exposées, accès obtenu). Nous accusons réception sous 72 h.

## Périmètre

- L'application https://brvm-training.vercel.app et son code.
- Hors périmètre : les tests de déni de service et de charge sur la production, l'ingénierie sociale, les services tiers (Supabase, Vercel) eux-mêmes.

## Pratiques en place

Voir [docs/SECURITY-AUDIT.md](docs/SECURITY-AUDIT.md) : RLS sur toutes les tables, contrôles d'autorisation côté serveur, en-têtes de sécurité, analyse CodeQL, `npm audit` et recherche de secrets à chaque PR, Dependabot.
