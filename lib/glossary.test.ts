import { describe, it, expect } from "vitest";
import { GLOSSARY } from "@/content/glossaire";
import { findEntry, findMatches, glossaryLetters, normalize, searchGlossary } from "./glossary";

const terms = (text: string, seen?: Set<string>) =>
  findMatches(text, seen)
    .filter((s) => s.kind === "term")
    .map((s) => s.value);

const rebuilt = (text: string) =>
  findMatches(text)
    .map((s) => s.value)
    .join("");

describe("glossaire", () => {
  it("contient les 61 entrées du fichier source", () => {
    expect(GLOSSARY).toHaveLength(61);
  });
  it("donne au moins une forme à repérer par entrée", () => {
    for (const e of GLOSSARY) expect(e.match.length).toBeGreaterThan(0);
  });
  it("liste les lettres dans l'ordre", () => {
    const letters = glossaryLetters();
    expect(letters[0]).toBe("A");
    expect([...letters].sort((a, b) => a.localeCompare(b, "fr"))).toEqual(letters);
  });
});

describe("normalize", () => {
  it("ignore la casse et les accents", () => {
    expect(normalize("Résultat NET")).toBe("resultat net");
  });
});

describe("findEntry", () => {
  it("retrouve par le terme comme par son synonyme court", () => {
    expect(findEntry("SGI")?.term).toBe("SGI");
    expect(findEntry("valeur comptable")?.term).toContain("Actif net");
    expect(findEntry("mot inexistant")).toBeUndefined();
  });
});

describe("searchGlossary", () => {
  it("cherche dans le terme et dans la définition", () => {
    expect(searchGlossary("courtier").map((e) => e.term)).toContain("SGI");
    expect(searchGlossary("")).toHaveLength(GLOSSARY.length);
    expect(searchGlossary("zzzz")).toHaveLength(0);
  });
});

describe("findMatches", () => {
  it("repère un terme isolé", () => {
    expect(terms("Ouvrez un compte chez une SGI.")).toEqual(["SGI"]);
  });

  it("ne coupe jamais un mot en deux", () => {
    // « actionnaires » contient « action » : le mot doit rester intact.
    expect(terms("Les actionnaires votent.")).toEqual([]);
    // « BOC » ne doit pas se déclencher au milieu d'un mot.
    expect(terms("Le mot BOCal ne compte pas.")).toEqual([]);
  });

  it("attrape les pluriels simples", () => {
    expect(terms("Les obligations rapportent un coupon.")).toContain("obligations");
  });

  it("préfère le terme le plus long quand deux se chevauchent", () => {
    expect(terms("Passez un ordre à cours limité.")).toEqual(["ordre à cours limité"]);
  });

  it("ne lie jamais deux fois le même terme dans un bloc", () => {
    const found = terms("Le dividende tombe, puis un autre dividende arrive.");
    expect(found).toEqual(["dividende"]);
  });

  it("plafonne le nombre de liens par bloc, pour ne pas souligner tout le texte", () => {
    const dense = "Le dividende, le rendement, la liquidité, la volatilité et le flottant.";
    expect(terms(dense).length).toBeLessThanOrEqual(2);
  });

  it("garde les termes les plus techniques plutôt que les premiers venus", () => {
    // « action » vient d'abord, mais c'est « coupon couru » et « marge de
    // sécurité » qu'un lecteur a besoin de voir expliqués.
    const found = terms("Une action, un coupon couru et une marge de sécurité.");
    expect(found).toContain("coupon couru");
    expect(found).toContain("marge de sécurité");
    expect(found).not.toContain("action");
  });

  it("respecte les termes déjà liés ailleurs dans la même slide", () => {
    const seen = new Set<string>();
    expect(terms("Une SGI exécute vos ordres.", seen)).toEqual(["SGI"]);
    expect(terms("Choisir sa SGI prend un jour.", seen)).toEqual([]);
  });

  it("ne perd ni n'ajoute un seul caractère du texte d'origine", () => {
    const source = "Le BOC donne le PER et le rendement des obligations d'État.";
    expect(rebuilt(source)).toBe(source);
    expect(rebuilt("Aucun terme technique ici.")).toBe("Aucun terme technique ici.");
  });

  it("rend le texte tel quel quand rien ne correspond", () => {
    const segments = findMatches("Bonjour tout le monde.");
    expect(segments).toEqual([{ kind: "text", value: "Bonjour tout le monde." }]);
  });
});
