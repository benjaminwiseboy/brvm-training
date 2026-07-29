export type IdCardData = {
  icon?: string;
  title: string;
  fields: { label: string; value: string }[];
};

export type ChartSeries = {
  label: string;
  kind: "bar" | "line";
  color: "blue" | "gold" | "pos" | "clay" | "violet" | "teal";
  values: number[]; // même longueur que ChartData.categories
};

export type ChartData = {
  categories: string[];
  series: ChartSeries[];
  unit?: string;
};

export type BocTableData = {
  /** Ex. "Extrait du BOC (données fictives, structure réelle)". */
  caption?: string;
  columns: string[];
  rows: string[][];
  /** Index (0-based) des colonnes à mettre en valeur (fond doré) — ex. la colonne qu'une question interroge. */
  highlightCols?: number[];
};

export type Block =
  | { kind: "text"; value: string }
  | { kind: "lead"; value: string }
  | { kind: "callout"; tone: "info" | "highlight" | "warn"; value: string }
  | { kind: "duo"; items: { side: string; value: string }[] }
  | { kind: "list"; items: string[] }
  | { kind: "countries"; items: string[] }
  | ({ kind: "boctable" } & BocTableData)
  | { kind: "download"; label: string; sublabel?: string; href: string }
  | { kind: "link"; label: string; sublabel?: string; href: string }
  | { kind: "formula"; label?: string; value: string }
  | ({ kind: "idcard" } & IdCardData)
  | ({ kind: "chart"; caption?: string } & ChartData);

export type Slide = { title: string; blocks: Block[] };

export type QuizChallenge = {
  type: "quiz";
  kicker: string; title: string; instruction: string;
  /** Mise en scène d'un cas concret (M03 : « le scénario de Koffi »), affichée à part de `instruction` dans un encart dédié — pas mélangée au texte d'instruction générique. */
  scenario?: string;
  /** Extrait de BOC affiché en tableau réel, bien mis en valeur au-dessus de `instruction` (Phase 3, M11+) — remplace le repli "valeurs recopiées verbatim dans instruction" des premiers modules Phase 3. */
  table?: BocTableData;
  /** Carte d'identité (M17+) : alternative à `table` quand l'exemple est un profil à embrasser d'un coup d'œil plutôt qu'une grille de données. */
  idcard?: IdCardData;
  /** Graphiques interactifs par profil (M18+) : alternative à `table`/`idcard` — l'apprenant bascule d'un profil à l'autre avant de répondre. */
  chartProfiles?: { key: string; label: string; data: ChartData }[];
  /** Tableaux interactifs par scénario (M19+) : alternative à `table` quand il faut comparer 2 exemples distincts sans tout empiler à l'écran. */
  tableTabs?: { key: string; label: string; table: BocTableData }[];
  penaltyPerError: number; perfectReward: number;
  options: { value: string; label: string }[];   // ex. Mythe/Réalité, Feu vert/rouge
  questions: { prompt: string; answer: string; options?: { value: string; label: string }[] }[]; // answer ∈ (options ?? challenge.options).value — per-question override for questions whose correct-answer set differs from the challenge-level shared options (e.g. numeric-amount questions in the same challenge as a percentage question)
};

export type SimulatorChallenge = {
  type: "simulator";
  kicker: string; title: string; instruction: string; note?: string;
  sliders: { key: string; label: string; min: number; max: number;
             step: number; value: number; kind: "money" | "pct" | "years" }[];
};

export type DiagnosticChallenge = {
  type: "diagnostic";
  kicker: string; title: string; instruction: string;
  /** Regroupe les questions en parties thématiques (M05) — `startIndex` = index (0-based) de la 1ère question de la partie dans `questions`. Optionnel : sans ce champ, comportement inchangé (aucun séparateur). */
  sections?: { title: string; startIndex: number }[];
  questions: { prompt: string; options: { label: string; points: number }[] }[];
  bands: {
    min: number; max: number; emoji: string; label: string;
    body: string;
    /** Répartition cible, une puce par ligne (remplace l'ancienne prose inline). */
    allocation: string[];
    /** Astuce affichée sous la répartition (ex. « la structure ne change pas selon le montant »). */
    tip: string;
  }[];
};

export type PlanBuilderChallenge = {
  type: "planner";
  kicker: string; title: string; instruction: string;
  /** Un « pilier » du plan d'investissement par question (M09) — pas de bonne/mauvaise
   * réponse : chaque option est une réponse personnelle possible, et le libellé choisi
   * est réutilisé tel quel dans le récap final (Bilan.tsx, branche `plan`). */
  questions: {
    icon: string;
    pillarLabel: string; // ex. "Votre objectif"
    prompt: string;
    options: { label: string }[];
  }[];
};

export type Challenge = QuizChallenge | SimulatorChallenge | DiagnosticChallenge | PlanBuilderChallenge;

export type Feedback = {
  // quiz
  perfect?: { icon: string; title: string; body: string };
  imperfect?: { icon: string; title: string; body: string };
  explanations?: { verdict: string; title: string; body: string; note?: string }[];
  // simulateur
  headline?: { icon: string; title: string; body: string };
  golden?: string;
  plan?: { title: string; items: string[] };
};

export type Module = {
  code: string;            // "M01"
  index: number;           // 1..26
  totalModules: 28;
  title: string;
  phase: string;           // "Phase 1 · Fondations"
  status: { emoji: string; label: string };
  startingCapital?: number;
  reward?: number;         // récompense de complétion (barème harmonisé)
  hero: {
    eyebrow: string; headline: string; lead: string;
    rules?: string[];      // module « cadeau » (M01)
    card?: { label: string; title: string; hint: string; rules: string[] }; // carte thématique
    /** M02 (revue) : "ce que vous saurez faire à la fin du module", affiché sur l'écran d'accueil, sur TOUS les modules. */
    objectives?: string[];
    cta: string;
  };
  slides: Slide[];
  challenge: Challenge;
  feedback: Feedback;
  next: { label: string; target: string };
};
