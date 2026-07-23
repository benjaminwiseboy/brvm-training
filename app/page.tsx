"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/store";
import { AppShell } from "@/components/nav/AppShell";
import { Dashboard } from "@/components/dashboard/Dashboard";

/**
 * Page d'accueil — tableau de bord de l'apprenant, ou redirection vers
 * `/onboarding` (Task 12) à la toute première visite.
 *
 * Gap #1 (cf. task-11-brief.md) : on ne décide qu'après hydratation
 * (`hydrated === true`, ajouté à `useProgress()` dans lib/store.tsx pour
 * cette tâche) — sinon `state.onboarded === false` de `initialState()`
 * (valeur neutre du tout premier rendu, avant la lecture `localStorage`)
 * redirigerait par erreur, le temps d'un flash, tout apprenant déjà
 * onboardé.
 *
 * La redirection est déclenchée dans un `useEffect` (navigation, pas un
 * calcul dérivé du rendu — cf. node_modules/next/dist/docs/.../use-router.md)
 * et non dans un updater `setState` : ce n'est pas le cas visé par la leçon
 * Strict Mode des Tasks 6/7/10 (callback à l'intérieur d'un updater), c'est
 * un effet de navigation ponctuel, gardé par `hydrated`/`state.onboarded`
 * dans ses dépendances — il ne se déclenche donc qu'une fois l'état neutre
 * initial remplacé par l'état réel.
 */
export default function Home() {
  const router = useRouter();
  const { state, hydrated } = useProgress();

  useEffect(() => {
    if (hydrated && !state.onboarded) {
      router.replace("/onboarding");
    }
  }, [hydrated, state.onboarded, router]);

  // Tant que l'hydratation n'est pas terminée, ou pendant la fenêtre entre
  // la détection "non onboardé" et l'exécution effective de la redirection
  // ci-dessus : ne rien rendre (évite un flash du tableau de bord ou de
  // contenu neutre).
  if (!hydrated || !state.onboarded) return null;

  return (
    <AppShell variant="dash">
      <Dashboard />
    </AppShell>
  );
}
