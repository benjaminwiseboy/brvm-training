"use client";

import { useProgress, deriveStatus, progressPct } from "@/lib/store";
import { ResumeCard } from "./ResumeCard";
import { ProgressCard } from "./ProgressCard";
import { VaultCard } from "./VaultCard";
import { PhasePreview } from "./PhasePreview";

// 28 = Module["totalModules"] (lib/types.ts) — nombre total de modules du parcours.
const TOTAL_MODULES = 28;

/**
 * Tableau de bord de l'apprenant — assemble, dans l'ordre de
 * POC-Module-1/dashboard.js (boot()) : reprise, progression, coffre-fort,
 * aperçu du parcours (détail complet module par module sur /parcours,
 * cf. ModuleMap). Pas de `.module.css` propre : ce composant ne fait que
 * composer les 4 cartes ci-dessous ; leur mise en page en grille verticale
 * (`.dash`) est déjà portée dans `AppShell.module.css` (`.dashMain`,
 * variante "dash", Task 11).
 *
 * "use client" : seul point de lecture de `useProgress()` pour tout le
 * tableau de bord — `doneCount` (dérivé de `state.completed`, Task 9 n'a pas
 * de helper dédié) et les valeurs dérivées sont calculés une fois ici puis
 * passés en props aux cartes, qui restent de simples composants de rendu.
 */
export function Dashboard() {
  const { state } = useProgress();
  const doneCount = Object.keys(state.completed).length;
  const pct = progressPct(doneCount, TOTAL_MODULES);
  const status = deriveStatus(doneCount);

  return (
    <>
      <ResumeCard resume={state.resume} pct={pct} />
      <ProgressCard
        doneCount={doneCount}
        total={TOTAL_MODULES}
        capital={state.capital}
        streak={state.streak}
        status={status}
      />
      <VaultCard />
      <PhasePreview completed={state.completed} />
    </>
  );
}
