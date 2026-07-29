import type { BocTableData, ChartData, IdCardData, Module } from "@/lib/types";

function validateBocTable(tag: string, where: string, table: BocTableData, errs: string[]) {
  if (table.columns.length === 0) errs.push(`${tag}: ${where} sans colonne`);
  table.rows.forEach((row, ri) => {
    if (row.length !== table.columns.length) errs.push(`${tag}: ${where} ligne ${ri + 1} n'a pas le même nombre de cellules que de colonnes`);
  });
}

function validateIdCard(tag: string, where: string, card: IdCardData, errs: string[]) {
  if (card.fields.length === 0) errs.push(`${tag}: ${where} sans champ`);
}

function validateChart(tag: string, where: string, chart: ChartData, errs: string[]) {
  if (chart.categories.length === 0) errs.push(`${tag}: ${where} sans catégorie`);
  if (chart.series.length === 0) errs.push(`${tag}: ${where} sans série`);
  chart.series.forEach((s) => {
    if (s.values.length !== chart.categories.length) errs.push(`${tag}: ${where} série "${s.label}" n'a pas autant de valeurs que de catégories`);
  });
}

export function validateModule(m: Module): string[] {
  const errs: string[] = [];
  const tag = m.code ?? "?";
  if (!m.slides || m.slides.length === 0) errs.push(`${tag}: aucune slide`);
  m.slides?.forEach((s, i) => {
    if (!s.blocks || s.blocks.length === 0) errs.push(`${tag}: slide ${i + 1} vide`);
    s.blocks?.forEach((b) => {
      if (b.kind === "boctable") validateBocTable(tag, `tableau (slide ${i + 1})`, b, errs);
      if (b.kind === "download" && !b.href) errs.push(`${tag}: bloc de téléchargement (slide ${i + 1}) sans href`);
      if (b.kind === "link" && !b.href) errs.push(`${tag}: bloc de lien (slide ${i + 1}) sans href`);
      if (b.kind === "formula" && !b.value) errs.push(`${tag}: formule (slide ${i + 1}) sans valeur`);
      if (b.kind === "idcard") validateIdCard(tag, `carte d'identité (slide ${i + 1})`, b, errs);
      if (b.kind === "chart") validateChart(tag, `graphique (slide ${i + 1})`, b, errs);
    });
  });
  if (m.challenge.type === "quiz") {
    const sharedValues = new Set(m.challenge.options.map((o) => o.value));
    if (m.challenge.questions.length === 0) errs.push(`${tag}: quiz sans question`);
    m.challenge.questions.forEach((q) => {
      const values = q.options ? new Set(q.options.map((o) => o.value)) : sharedValues;
      if (!values.has(q.answer)) errs.push(`${tag}: réponse "${q.answer}" absente des options`);
    });
    if (m.challenge.table) validateBocTable(tag, "tableau du défi", m.challenge.table, errs);
    if (m.challenge.idcard) validateIdCard(tag, "carte d'identité du défi", m.challenge.idcard, errs);
    if (m.challenge.chartProfiles) {
      if (m.challenge.chartProfiles.length === 0) errs.push(`${tag}: profils de graphique du défi vides`);
      m.challenge.chartProfiles.forEach((p) => validateChart(tag, `graphique du défi (profil ${p.key})`, p.data, errs));
    }
    if (m.challenge.tableTabs) {
      if (m.challenge.tableTabs.length === 0) errs.push(`${tag}: scénarios de tableau du défi vides`);
      m.challenge.tableTabs.forEach((s) => validateBocTable(tag, `tableau du défi (scénario ${s.key})`, s.table, errs));
    }
  } else if (m.challenge.type === "diagnostic") {
    if (m.challenge.questions.length === 0) errs.push(`${tag}: diagnostic sans question`);
    m.challenge.questions.forEach((q) => {
      if (!q.options || q.options.length === 0) errs.push(`${tag}: diagnostic sans option de réponse`);
    });
    if (m.challenge.bands.length === 0) errs.push(`${tag}: diagnostic sans bande de résultat`);
  } else if (m.challenge.type === "planner") {
    if (m.challenge.questions.length === 0) errs.push(`${tag}: plan sans question`);
    m.challenge.questions.forEach((q) => {
      if (!q.options || q.options.length === 0) errs.push(`${tag}: plan sans option de réponse`);
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
    if (m.index < 1 || m.index > 28) errs.push(`${m.code}: index hors [1,28]`);
    errs.push(...validateModule(m));
  }
  return errs;
}
