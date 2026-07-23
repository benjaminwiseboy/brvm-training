import { notFound } from "next/navigation";
import { getModule, orderedCodes } from "@/content/registry";
import { ModulePlayer } from "@/components/engine/ModulePlayer";
import { AppShell } from "@/components/nav/AppShell";

export function generateStaticParams() {
  return orderedCodes().map((code) => ({ code: code.toLowerCase() }));
}

export default async function ModulePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  // Nommé `mod`, pas `module` : eslint-plugin-next (no-assign-module-variable)
  // interdit de réassigner l'identifiant `module` dans ce scope.
  const mod = getModule(code);
  if (!mod) notFound();
  return (
    <AppShell>
      <ModulePlayer module={mod} />
    </AppShell>
  );
}
