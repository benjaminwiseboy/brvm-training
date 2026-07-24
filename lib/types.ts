export type Block =
  | { kind: "text"; value: string }
  | { kind: "lead"; value: string }
  | { kind: "callout"; tone: "info" | "highlight" | "warn"; value: string }
  | { kind: "duo"; items: { side: string; value: string }[] }
  | { kind: "list"; items: string[] }
  | { kind: "countries"; items: string[] };

export type Slide = { title: string; blocks: Block[] };

export type QuizChallenge = {
  type: "quiz";
  kicker: string; title: string; instruction: string;
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
  questions: { prompt: string; options: { label: string; points: number }[] }[];
  bands: { min: number; max: number; emoji: string; label: string; body: string }[];
};

export type Challenge = QuizChallenge | SimulatorChallenge | DiagnosticChallenge;

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
  totalModules: 26;
  title: string;
  phase: string;           // "Phase 1 · Fondations"
  status: { emoji: string; label: string };
  startingCapital?: number;
  reward?: number;         // récompense de complétion (barème harmonisé)
  hero: {
    eyebrow: string; headline: string; lead: string;
    rules?: string[];      // module « cadeau » (M01)
    card?: { label: string; title: string; hint: string; rules: string[] }; // carte thématique
    cta: string;
  };
  slides: Slide[];
  challenge: Challenge;
  feedback: Feedback;
  next: { label: string; target: string };
};
