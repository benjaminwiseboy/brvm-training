import type { Module } from "@/lib/types";

export function validateModule(m: Module): string[] {
  const errs: string[] = [];
  const tag = m.code ?? "?";
  if (!m.slides || m.slides.length === 0) errs.push(`${tag}: aucune slide`);
  m.slides?.forEach((s, i) => {
    if (!s.blocks || s.blocks.length === 0) errs.push(`${tag}: slide ${i + 1} vide`);
  });
  if (m.challenge.type === "quiz") {
    const sharedValues = new Set(m.challenge.options.map((o) => o.value));
    if (m.challenge.questions.length === 0) errs.push(`${tag}: quiz sans question`);
    m.challenge.questions.forEach((q) => {
      const values = q.options ? new Set(q.options.map((o) => o.value)) : sharedValues;
      if (!values.has(q.answer)) errs.push(`${tag}: réponse "${q.answer}" absente des options`);
    });
  } else {
    if (m.challenge.sliders.length === 0) errs.push(`${tag}: simulateur sans curseur`);
  }
  if (!m.next?.target) errs.push(`${tag}: pas de module suivant`);
  return errs;
}

export function validateAll(modules: Module[]): string[] {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const m of modules) {
    if (seen.has(m.code)) errs.push(`code dupliqué: ${m.code}`);
    seen.add(m.code);
    if (m.index < 1 || m.index > 26) errs.push(`${m.code}: index hors [1,26]`);
    errs.push(...validateModule(m));
  }
  return errs;
}
