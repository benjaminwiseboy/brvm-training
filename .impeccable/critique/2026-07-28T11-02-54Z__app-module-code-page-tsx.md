---
target: page de module (m01, quiz) — desktop et mobile
total_score: 22
p0_count: 1
p1_count: 3
timestamp: 2026-07-28T11-02-54Z
slug: app-module-code-page-tsx
---
Method: dual-agent (A: a538b4b11e7f154a4 · B: a4d765b3561075069)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Bon feedback local (dots SlideDeck, états quiz, wallet animé) mais aucun repère macro sur les 4 phases (intro→cours→défi→bilan) |
| 2 | Match System / Real World | 3/4 | Métaphores métier qui parlent (coupe-circuit ±7,5%, FCFA, copie 100% française) |
| 3 | User Control and Freedom | 1/4 | Le bouton retour sort toujours vers "/" sans tenir compte de la phase ; réponses au quiz perdues si on quitte en cours de défi |
| 4 | Consistency and Standards | 3/4 | Système de tokens réutilisé partout ; mais même glyphe "✓" sur réponse juste ET fausse (confirmé par le scan manuel) |
| 5 | Error Prevention | 1/4 | "Réinitialiser" efface tout en un clic, sans confirmation, toujours visible — y compris pendant le quiz |
| 6 | Recognition Rather Than Recall | 3/4 | Portefeuille toujours visible, états explicites |
| 7 | Flexibility and Efficiency | 2/4 | Navigation clavier ←/→ dans SlideDeck, rien d'équivalent dans QuizChallenge |
| 8 | Aesthetic and Minimalist Design | 3/4 | Colonne de lecture unique et focalisée, légèrement plombée par un motif de dégradé répété |
| 9 | Error Recovery | 2/4 | Les explications du Bilan sont un vrai bon moment pédagogique ; mais les erreurs de parsing localStorage sont avalées silencieusement |
| 10 | Help and Documentation | 2/4 | Pas de centre d'aide, mais l'enseignement contextuel compense raisonnablement |
| **Total** | | **22/40** | **Acceptable — améliorations significatives nécessaires** |

## Anti-Patterns Verdict

**Évaluation qualitative (Assessment A)** : ce n'est **pas** du remplissage générique IA. Preuves concrètes : contenu métier réel et spécifique (`content/modules/m01.ts`), micro-interactions faites main (roll-up du Wallet, ScoreRing en SVG custom), CTA non-générique ("Recevoir mon million et commencer"). Deux tics restent notables : un motif décoratif "carte dégradée + blob radial" réutilisé à l'identique sur 3 surfaces (Hero, Bilan×2), et un système d'eyebrows/kickers en majuscules très présent — le tic le plus "SaaS premium par défaut" du code. La numérotation "Section N ·" n'apparaît que sur 2 des 4 phases (Défi et Bilan) : un système à moitié câblé plutôt qu'assumé.

**Scan déterministe (Assessment B)** : `detect.mjs --json` sur `components/engine`, `components/nav`, `app/module` → sortie `[]`, exit code 0, aucun résultat. Aucun faux positif à signaler puisqu'il n'y a eu aucun résultat. À noter honnêtement : le détecteur n'a rien trouvé alors que la lecture qualitative (A) a identifié la répétition du motif décoratif et la numérotation à moitié câblée — ce sont des problèmes de jugement stylistique hors du périmètre de signatures déterministes du détecteur, pas un raté de l'outil.

**Preuves visuelles** : aucun outil d'automatisation navigateur (Playwright/Puppeteer/Chrome DevTools MCP) n'est enregistré dans cet environnement — l'overlay visuel n'a pas pu tourner. Signal de repli explicite confirmé par Assessment B ; pas de capture fabriquée.

## Overall Impression

Ce produit dépasse largement le seuil "évidemment généré par IA" — contenu métier réel, animations et micro-interactions faites main (Wallet, ScoreRing, navigation clavier du SlideDeck). Mais le refactor récent de la sidebar a généralisé le chrome "tout est toujours visible" du tableau de bord à la phase la plus concentrée du parcours (le quiz), sans réduire son périmètre. Plusieurs trous structurels (pas de confirmation sur la réinitialisation, sortie insensible à la phase, aucun repère de progression global) font qu'un utilisateur peut perdre de la progression ou son portefeuille via des interactions tout à fait ordinaires. Desktop et mobile partagent exactement ce même risque structurel : la coquille responsive (sidebar ↔ tabbar) change *comment* on atteint ces actions, pas *ce qui* est atteignable.

**Desktop (≥901px)** : sidebar fixe (250px) persistante + header sticky (retour, marque, portefeuille animé) + colonne de contenu centrée (760px) dans l'espace restant. Détail mineur : le header (max-width 1180px) et le `.stage` (760px) se centrent chacun indépendamment — sur un écran large, le bouton retour et le portefeuille se retrouvent visuellement en dehors des bords de la carte de contenu en dessous.

**Mobile (<901px)** : la sidebar disparaît au profit d'une barre d'onglets flottante en bas ; le header sticky (retour + marque + portefeuille) reste affiché en une seule ligne — serré sur les petits écrans (≤375px), atténué par la compression mobile déjà prévue dans `Wallet.module.css`. Cibles tactiles à surveiller : bouton retour 40×40px (sous la recommandation 44×44, mais au-dessus du plancher WCAG 2.2 de 24×24) ; `.resetBtn` ≈19px de haut (très en dessous, mais desktop-only donc risque mobile limité).

## What's Working

1. **`Wallet.tsx`** (roll-up animé easeOutCubic, repli instantané sous `prefers-reduced-motion`, `aria-live="polite"`) — un vrai travail de micro-interaction soigné et accessible, pas un défaut de template.
2. **`SlideDeck`** (stepper à points + navigation clavier ←/→) — le seul endroit du parcours où la progression ET une vraie affordance power-user sont bien traitées ensemble.
3. **`Bilan`** (cartes d'explication par question) — transforme un simple score en un vrai debrief pédagogique, adapté à un public débutant.
4. Bonus détecté par le scan manuel : couverture cohérente des `aria-label` sur les landmarks de nav (sidebar, tabbar, bouton retour, wallet) et anneaux `:focus-visible` posés sur la plupart des boutons — une vraie base d'accessibilité déjà en place.

## Priority Issues

**[P0] Réinitialisation en un clic, sans confirmation, toujours active**
- Quoi : `AppShell.tsx` (bouton "Réinitialiser" dans le pied de la sidebar) → `store.tsx` (`reset: () => setState(initialState())`). Aucun `confirm()`, aucune modale, aucun undo.
- Pourquoi ça compte : ce bouton reste visible en permanence dans la sidebar desktop, y compris pendant un quiz — un clic malheureux efface tout le portefeuille et l'historique de progression.
- Fix : exiger une confirmation explicite (au minimum un `confirm()` natif, idéalement une modale à traitement "destructif"), ou déplacer ce contrôle derrière un écran "Profil" plutôt que dans la nav persistante.
- Commande suggérée : `/impeccable harden`

**[P1] Sortie insensible à la phase — perte silencieuse des réponses en cours de défi**
- Quoi : le lien retour de `AppShell.tsx` route toujours vers "/" quel que soit la phase. Le suivi de reprise (`ModulePlayer.tsx`) ne couvre que `SlideDeck` ; les réponses du `QuizChallenge` ne sont jamais persistées.
- Pourquoi ça compte : un apprenant qui a répondu à 3 questions sur 4 et clique sur retour (habitude, clic accidentel, ou via un item de la sidebar) revient au tableau de bord ; en rouvrant le module, il reprend à la dernière slide de cours — pas au quiz — sans aucun avertissement que ça allait se passer ainsi.
- Fix : suivre la reprise au niveau de la phase (pas seulement de la slide), et/ou afficher une confirmation ("Quitter le défi ? Vos réponses seront perdues.") en cas de sortie pendant `défi` avec des réponses non validées.
- Commande suggérée : `/impeccable harden`

**[P1] Différenciation juste/faux uniquement par la couleur, contrastes sous le seuil AA**
- Quoi : `QuizChallenge` affiche le même glyphe "✓" sur la réponse correcte ET sur la réponse fausse sélectionnée par l'utilisateur — seule la couleur (vert `--pos` vs orange-argile `--clay`) diffère. Constat croisé et confirmé indépendamment par la lecture design (A) et l'audit manuel (B). En parallèle, le token `--or-deep` utilisé pour les eyebrows/kickers/labels dorés (Hero, Bilan, QuizChallenge, SlideDeck) tombe à ≈2,4–2,7:1 de contraste sur fond blanc/carte — bien sous le seuil AA de 4,5:1, sans exemption "grand texte" possible (ce sont des labels 11–12px).
- Pourquoi ça compte : au moment précis où la justesse de la réponse compte le plus, l'information "juste" vs "faux" est portée uniquement par une nuance de couleur — un vrai problème pour un utilisateur qui ne perçoit pas fiablement cette différence (WCAG 1.4.1). Le contraste insuffisant du doré touche presque tous les écrans du parcours.
- Fix : une icône distincte par état (✓ vs ✕) en plus de la couleur ; foncer le token doré ou le réserver à du texte large/gras.
- Commande suggérée : `/impeccable colorize` (contraste), puis `/impeccable audit`

**[P1] Aucune progression visible sur les 4 phases ; numérotation "Section N ·" à moitié câblée**
- Quoi : `QuizChallenge` s'affiche "Section 2 · Le Défi", `Bilan` "Section 3 · Le Bilan" — mais `Hero` et `SlideDeck` ne portent jamais de numéro de section, et aucune liste de phases n'est montrée nulle part.
- Pourquoi ça compte : cette numérotation partielle laisse croire qu'une séquence comptable existe, ce qui pousse l'utilisateur à chercher "combien de sections au total" — information jamais livrée. Un débutant qui atteint le quiz n'a aucun moyen de savoir qu'une phase (bilan) reste encore.
- Fix : soit un vrai indicateur à 4 étapes dans le header sticky (Intro • Cours • Défi • Bilan, étape courante mise en évidence), soit supprimer entièrement les labels "Section N" plutôt que les laisser à moitié câblés.
- Commande suggérée : `/impeccable clarify`

**[P2] Le chrome de nav persistant concurrence la tâche la plus concentrée du parcours**
- Quoi : `Sidebar`/`Tabbar` restent pleinement rendus et interactifs pendant `défi` — 5 destinations cliquables (dont 2 routes réelles qui abandonnent une réponse en cours) juste à côté de la carte de quiz. En parallèle, `QuizChallenge` affiche les 4 questions d'un coup dans un seul scroll, à rebours du principe "une slide à la fois" déjà établi par `SlideDeck` une phase plus tôt (qui, lui, se démonte entièrement — impossible de revoir le cours pendant le quiz).
- Pourquoi ça compte : échec direct du critère "focus unique" de la charge cognitive, et incohérence interne dans le propre langage d'interaction du produit (cours paginé, défi non paginé) qui augmente la charge de mémoire de travail.
- Fix : à défaut d'un chrome plus sobre pendant `défi`, au minimum verrouiller les actions destructives (voir P0) ; paginer les questions du quiz pour matcher le langage du SlideDeck.
- Commande suggérée : `/impeccable distill`

## Persona Red Flags

**Riley (testeur méthodique)** : clique sur "Réinitialiser" en cours de session juste pour voir — rien ne s'interpose entre ce clic et l'effacement complet du portefeuille et de la progression (P0). Teste aussi le bouton retour en plein quiz et atterrit sur la mauvaise slide avec des réponses perdues, sans aucune explication (P1) — de son point de vue, ça se lit comme un bug, pas comme un choix de design.

**Sam (dépendant de l'accessibilité)** : rencontre le problème de différenciation par la seule couleur dans `QuizChallenge` — le même "✓" sur bonne et mauvaise réponse, uniquement distingué par une teinte de bordure/fond. Pour quelqu'un qui ne perçoit pas fiablement cette nuance, "vous avez juste" et "vous avez faux" sont visuellement quasi identiques — au moment précis où la justesse compte le plus.

**Jordan (premier utilisateur, perdu)** : le mécanisme de "correction" n'est expliqué qu'une seule fois, sur l'écran Hero, puis doit être rappelé plusieurs slides plus tard quand le portefeuille "tremble" après une mauvaise réponse — sans aucun repère de progression pour le rassurer sur ce qu'il reste à faire, et avec une barre de nav juste à côté du quiz qui pourrait se lire comme de la navigation "suivant" (elle ne l'est pas : `Parcours`/`Progrès`/`Profil` sont des ancres mortes `#`, `Accueil` abandonne le défi en cours). Jordan est le persona le plus susceptible de mal lire la sidebar comme faisant partie du parcours et de perdre sa progression par accident.

**Casey (mobile, distrait)** : hérite de tous les mêmes problèmes structurels (P0/P1/P1) — le mobile ne les aggrave pas mais ne les corrige pas non plus. Spécifique au mobile : le header (retour + marque + portefeuille) est serré sur les écrans ≤375px, et le bouton retour (40×40px) reste sous la recommandation tactile de 44×44px — une friction réelle bien que mineure pour un usage au pouce.

## Minor Observations

- Header (`max-width: 1180px`) et `.stage` (`max-width: 760px`) se centrent indépendamment l'un de l'autre : sur desktop large, le bouton retour et le portefeuille débordent visuellement des bords de la carte de contenu en dessous.
- `Parcours` / `Progrès` / `Profil` sont des liens à l'apparence bien réelle mais routent vers `#` — une "promesse cassée" juste à côté de vraies destinations (`Accueil`, `Coffre-fort`).
- Les erreurs de parsing localStorage sont silencieusement avalées (`catch {}` vide dans `store.tsx`) — un store corrompu ou indisponible (navigation privée, quota) réinitialise la progression sans aucun message à l'utilisateur.
- `<main class="stage">` est totalement vide avant hydratation (le contenu du module part en payload RSC sérialisé et ne se monte que côté client) — sans impact réel pour un utilisateur avec JS activé (cas d'usage principal ici), mais à garder en tête pour la résilience no-JS/crawlers si jamais ça devient pertinent.
- Artefact DOM mineur : classe avec espace en fin de chaîne sur certains éléments (`class="...navitem "`) — sous-produit inoffensif d'un template literal conditionnel.

## Questions to Consider

- Le chrome de nav persistant à côté du quiz en cours — "toujours tout visible partout" était-il le bon choix en généralisant le pattern du tableau de bord, ou est-ce que `défi` a besoin d'un contrat de chrome plus strict ?
- Si les pertes doivent se ressentir comme des "corrections" pédagogiques et non des échecs, le vocabulaire de feedback de perte (animation shake, couleur proche de l'alerte) ne devrait-il pas être adouci pour matcher cette intention ?
- Les réponses au quiz ne sont pas reprises comme le sont les slides de cours — coupe de scope v0 volontaire, ou trou à combler avant d'aller plus loin ?
