/**
 * Moteur du glossaire : recherche, et surtout repérage des termes dans le
 * texte des cours.
 *
 * Le repérage est automatique — aucun balisage à poser dans les 28 modules,
 * qui resteraient sinon à annoter à la main (et à réannoter à chaque
 * réécriture). En contrepartie, il est délibérément AVARE : sans garde-fou,
 * une slide qui parle d'actions, de dividendes et de rendement se
 * transformerait en champ de liens, et un texte tout souligné ne se lit plus.
 * D'où les règles de `findMatches` : un terme n'est lié qu'une fois par bloc,
 * deux liens par bloc au maximum, jamais un mot de moins de 3 lettres — et,
 * quand un bloc dépasse le quota, ce sont les termes les plus SPÉCIFIQUES
 * qui l'emportent, pas les premiers venus.
 */
import { GLOSSARY, type GlossaryEntry } from "@/content/glossaire";

/** Minuscules sans accents — pour comparer « Résultat net » et « resultat net ». */
export function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function findEntry(term: string): GlossaryEntry | undefined {
  const wanted = normalize(term);
  return GLOSSARY.find((e) => e.match.some((m) => normalize(m) === wanted));
}

/** Recherche de la page glossaire : sur le terme ET sur la définition. */
export function searchGlossary(query: string): GlossaryEntry[] {
  const q = normalize(query);
  if (!q) return GLOSSARY;
  return GLOSSARY.filter(
    (e) =>
      normalize(e.term).includes(q) ||
      e.match.some((m) => normalize(m).includes(q)) ||
      normalize(e.definition).includes(q)
  );
}

/** Les lettres réellement représentées, dans l'ordre — pour l'index A-Z. */
export function glossaryLetters(entries: GlossaryEntry[] = GLOSSARY): string[] {
  return [...new Set(entries.map((e) => e.letter))].sort((a, b) => a.localeCompare(b, "fr"));
}

const MIN_TERM_LENGTH = 3;
const MAX_LINKS_PER_BLOCK = 2;

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Une seule expression pour tous les termes, les plus longs d'abord : sans
 * ce tri, « Ordre à cours limité » serait mangé par « Ordre au marché »…
 * ou pire, par « Action ». Le `s?` final attrape les pluriels simples.
 */
const TERM_PATTERN: RegExp = (() => {
  const forms = GLOSSARY.flatMap((e) => e.match)
    .filter((m) => m.length >= MIN_TERM_LENGTH)
    .sort((a, b) => b.length - a.length);
  return new RegExp(`(${forms.map(escapeRegExp).join("|")})(s?)`, "giu");
})();

/** Un caractère qui, collé au terme, signifie qu'on est au milieu d'un mot. */
function isWordChar(char: string | undefined): boolean {
  return char !== undefined && /[\p{L}\p{N}]/u.test(char);
}

export type TextSegment =
  | { kind: "text"; value: string }
  | { kind: "term"; value: string; entry: GlossaryEntry };

/**
 * Découpe un texte en segments, en isolant les termes du glossaire.
 *
 * Les bornes sont vérifiées à la main plutôt qu'avec `\b` (qui ignore les
 * lettres accentuées, donc couperait « Résultat » en deux) et sans
 * lookbehind (absent des Safari encore en circulation en Afrique de
 * l'Ouest) : on regarde simplement le caractère de gauche et celui de
 * droite.
 */
export function findMatches(text: string, alreadyLinked?: Set<string>): TextSegment[] {
  // Passe 1 — tous les candidats valides, dans l'ordre du texte.
  const candidates: { start: number; end: number; value: string; entry: GlossaryEntry }[] = [];
  const seenHere = new Set<string>();

  TERM_PATTERN.lastIndex = 0;
  for (const match of text.matchAll(TERM_PATTERN)) {
    const start = match.index ?? 0;
    const whole = match[0];
    const end = start + whole.length;

    if (isWordChar(text[start - 1]) || isWordChar(text[end])) continue;

    const entry = findEntry(match[1]);
    if (!entry) continue;

    const key = normalize(entry.term);
    if (seenHere.has(key) || alreadyLinked?.has(key)) continue;

    seenHere.add(key);
    candidates.push({ start, end, value: whole, entry });
  }

  // Passe 2 — on ne garde que les plus SPÉCIFIQUES. Sans ce tri, le premier
  // arrivé gagnait : un bloc qui dit « action » avant « coupon couru » aurait
  // dépensé son quota sur le mot que tout le monde connaît déjà, et laissé
  // sans explication celui sur lequel on bute vraiment. La longueur du terme
  // est un proxy simple et suffisant de sa technicité.
  const kept = new Set(
    [...candidates]
      .sort((a, b) => b.entry.term.length - a.entry.term.length)
      .slice(0, MAX_LINKS_PER_BLOCK)
  );

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const candidate of candidates) {
    if (!kept.has(candidate)) continue;
    if (candidate.start > cursor) {
      segments.push({ kind: "text", value: text.slice(cursor, candidate.start) });
    }
    segments.push({ kind: "term", value: candidate.value, entry: candidate.entry });
    alreadyLinked?.add(normalize(candidate.entry.term));
    cursor = candidate.end;
  }
  if (cursor < text.length) segments.push({ kind: "text", value: text.slice(cursor) });
  return segments;
}
