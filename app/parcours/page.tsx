"use client";

import { useProgress } from "@/lib/store";
import { AppShell } from "@/components/nav/AppShell";
import { ModuleMap } from "@/components/dashboard/ModuleMap";

/**
 * `/parcours` — liste complète des phases/modules, déplacée hors du
 * tableau de bord (qui n'affiche plus qu'un aperçu, cf. PhasePreview) pour
 * s'aligner sur la maquette : dashboard = aperçu, page Parcours dédiée =
 * détail. `ModuleMap` ne change pas, seul son point de montage change.
 */
export default function ParcoursPage() {
  const { state } = useProgress();

  return (
    <AppShell variant="dash">
      <ModuleMap completed={state.completed} />
    </AppShell>
  );
}
