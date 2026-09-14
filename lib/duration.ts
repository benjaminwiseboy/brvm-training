/**
 * Estimation de la durée d'un module — « à quoi dois-je m'attendre avant de
 * cliquer ? ».
 *
 * Pourquoi CALCULER plutôt que saisir une durée à la main dans chaque
 * `content/modules/mXX.ts` : 28 durées écrites en dur, ce sont 28 chiffres qui
 * mentent dès la première réécriture de slide. Ici la durée est dérivée du
 * contenu réel — elle suit automatiquement l'ajout d'une slide ou d'une
 * question.
 *
 * Modèle (volontairement simple, assumé comme une estimation) :
 * - LECTURE : la formation se lit SANS narration (cf. la règle de rédaction du
 *   projet), donc tout le texte est lu — slides, énoncés du défi ET écran de
 *   bilan, qui explique chaque réponse et pèse autant qu'une slide. 130
 *   mots/minute = un rythme de lecture de compréhension en français, sur un
 *   vocabulaire nouveau — pas les 200-250 mots/min d'une lecture de loisir.
 * - OBSERVATION : un graphique, un extrait de BOC ou une formule ne se
 *   « lisent » pas au même rythme qu'une phrase — ils se déchiffrent. D'où un
 *   forfait en secondes par bloc de ce type, en plus de leurs mots.
 * - DÉCISION : chaque question de défi coûte un temps de réflexion, en plus de
 *   la lecture de son énoncé. Le simulateur, lui, se manipule : forfait fixe.
 *
 * Le résultat est arrondi à la minute et affiché avec un « ~ » : c'est un ordre
 * de grandeur honnête, jamais une promesse.
 */
import type { Block, Challenge, Feedback, Module, Slide } from "@/lib/types";

/** Mots par minute — lecture de compréhension en français, vocabulaire nouveau. */
const WORDS_PER_MINUTE = 130;

/** Secondes de « déchiffrage » en plus des mots, par type de bloc visuel. */
const BLOCK_STUDY_SECONDS: Partial<Record<Block["kind"], number>> = {
  chart: 35,
  boctable: 30,
  idcard: 20,
  formula: 20,
};

/** Secondes de réflexion par question, selon le type de défi. */
const QUESTION_SECONDS = { quiz: 35, diagnostic: 20, planner: 30 } as const;

/** Le simulateur n'a pas de questions : on manipule les curseurs. Forfait. */
const SIMULATOR_SECONDS = 150;

/** Écran d'accueil (hero) puis ossature du bilan — son texte est compté à part. */
const HERO_SECONDS = 30;
const BILAN_SECONDS = 30;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Tout le texte lisible d'un bloc, balises `**gras**` comprises (négligeable). */
function blockText(b: Block): string {
  switch (b.kind) {
    case "text":
    case "lead":
    case "callout":
      return b.value;
    case "formula":
      return `${b.label ?? ""} ${b.value}`;
    case "duo":
      return b.items.map((i) => `${i.side} ${i.value}`).join(" ");
    case "list":
    case "countries":
      return b.items.join(" ");
    case "boctable":
      return [b.caption ?? "", ...b.columns, ...b.rows.flat()].join(" ");
    case "download":
    case "link":
      return `${b.label} ${b.sublabel ?? ""}`;
    case "idcard":
      return `${b.title} ${b.fields.map((f) => `${f.label} ${f.value}`).join(" ")}`;
    case "chart":
      return `${b.caption ?? ""} ${b.categories.join(" ")} ${b.series.map((s) => s.label).join(" ")}`;
  }
}

function slidesSeconds(slides: Slide[]): number {
  let words = 0;
  let study = 0;
  for (const slide of slides) {
    words += countWords(slide.title);
    for (const block of slide.blocks) {
      words += countWords(blockText(block));
      study += BLOCK_STUDY_SECONDS[block.kind] ?? 0;
    }
  }
  return (words / WORDS_PER_MINUTE) * 60 + study;
}

function challengeSeconds(challenge: Challenge): number {
  const intro = countWords(`${challenge.title} ${challenge.instruction}`) / WORDS_PER_MINUTE * 60;

  if (challenge.type === "simulator") return intro + SIMULATOR_SECONDS;

  if (challenge.type === "quiz") {
    const prompts = challenge.questions.map((q) => q.prompt).join(" ");
    const visuals =
      (challenge.table ? BLOCK_STUDY_SECONDS.boctable! : 0) +
      (challenge.idcard ? BLOCK_STUDY_SECONDS.idcard! : 0) +
      (challenge.chart ? BLOCK_STUDY_SECONDS.chart! : 0) +
      (challenge.chartProfiles?.length ?? 0) * BLOCK_STUDY_SECONDS.chart! +
      (challenge.tableTabs?.length ?? 0) * BLOCK_STUDY_SECONDS.boctable! +
      countWords(challenge.scenario ?? "") / WORDS_PER_MINUTE * 60;
    return (
      intro +
      visuals +
      (countWords(prompts) / WORDS_PER_MINUTE) * 60 +
      challenge.questions.length * QUESTION_SECONDS.quiz
    );
  }

  const prompts = challenge.questions.map((q) => q.prompt).join(" ");
  const perQuestion = challenge.type === "diagnostic" ? QUESTION_SECONDS.diagnostic : QUESTION_SECONDS.planner;
  const options = challenge.questions
    .flatMap((q) => q.options.map((o) => o.label))
    .join(" ");
  return (
    intro +
    ((countWords(prompts) + countWords(options)) / WORDS_PER_MINUTE) * 60 +
    challenge.questions.length * perQuestion
  );
}

/**
 * L'écran de bilan n'est pas un simple score : il explique chaque réponse
 * (`explanations`), commente la leçon (`headline`, `golden`, `plan`). C'est du
 * texte à lire, souvent autant qu'une slide — l'oublier sous-estimait
 * systématiquement les modules à quiz long.
 */
function feedbackSeconds(feedback: Feedback): number {
  const parts = [
    feedback.perfect,
    feedback.imperfect,
    feedback.headline,
  ].map((b) => (b ? `${b.title} ${b.body}` : ""));

  const explanations = (feedback.explanations ?? [])
    .map((e) => `${e.title} ${e.body} ${e.note ?? ""}`)
    .join(" ");

  const plan = feedback.plan ? `${feedback.plan.title} ${feedback.plan.items.join(" ")}` : "";

  const words = countWords([...parts, explanations, plan, feedback.golden ?? ""].join(" "));
  return (words / WORDS_PER_MINUTE) * 60;
}

/**
 * Durée estimée d'un module, en minutes entières. Plancher à 4 min : même le
 * module le plus court se joue en quatre écrans, annoncer « 2 min » ferait
 * passer la formation pour un quiz.
 */
export function moduleMinutes(module: Module): number {
  const seconds =
    HERO_SECONDS +
    slidesSeconds(module.slides) +
    challengeSeconds(module.challenge) +
    BILAN_SECONDS +
    feedbackSeconds(module.feedback);
  return Math.max(4, Math.round(seconds / 60));
}

/** Total d'une liste de codes (une phase, ou tout le parcours). */
export function totalMinutes(modules: Module[]): number {
  return modules.reduce((sum, m) => sum + moduleMinutes(m), 0);
}

/**
 * « 12 min » en dessous d'une heure, « 1 h 45 » au-delà — un total de phase en
 * minutes (« 168 min ») ne veut rien dire pour personne.
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

/** Libellé prêt à afficher, « ~ » compris : c'est une estimation, on le dit. */
export function durationLabel(minutes: number): string {
  return `~${formatMinutes(minutes)}`;
}
