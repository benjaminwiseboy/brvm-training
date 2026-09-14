/**
 * Référence des SGI (les courtiers agréés de la BRVM) — DONNÉES PORTÉES du
 * projet frère `brvm-tracker` (`lib/sgi.ts` + `app/sgi/page.tsx`), sans
 * retranscription à la main : le tableau et les slugs Richbourse ont été
 * extraits automatiquement de la source, pour ne pas introduire ici une
 * coquille sur un chiffre de frais.
 *
 * ⚠️ Les frais par SGI ne font l'objet d'aucune publication officielle
 * uniforme. Sources :
 *   - Frais Côte d'Ivoire : PlayInvest (playinvest-hd.com/sgi)
 *   - Frais autres pays   : Sikafinance (sikafinance.com/sgi_de_la_brvm)
 *   - Note (★/5) + téléphone : Richbourse (richbourse.com/.../liste-sgi)
 * Droits de garde et tenue de compte sont NORMALISÉS en montant ANNUEL :
 * une fourchette est ramenée à sa borne HAUTE, une valeur trimestrielle est
 * multipliée par 4. La valeur d'origine est conservée dans les champs
 * `*Raw`, et affichée dans le comparateur — sans quoi on présenterait une
 * approximation comme un chiffre exact.
 *
 * DÉPÔT MINIMUM et PLATEFORME EN LIGNE ont été REVÉRIFIÉS ligne par ligne
 * (septembre 2026), parce que la reprise de PlayInvest/Sikafinance laissait
 * les deux colonnes fausses là où elles comptent le plus pour un débutant :
 * le ticket d'entrée, et la possibilité de passer un ordre sans se déplacer.
 *   - `minDeposit` : fiche Richbourse de la SGI, qui publie le « Montant
 *     minimum pour l'ouverture d'un compte ». C'est une politique
 *     COMMERCIALE, absente des grilles tarifaires homologuées par l'AMF —
 *     d'où l'absence de source officielle et les écarts entre agrégateurs.
 *   - `online` : décisions AMF-UMOA / CREPMF « autorisation … pour
 *     l'exercice de l'activité de bourse en ligne » publiées par la BRVM —
 *     l'agrément est OBLIGATOIRE pour opérer une plateforme, donc son
 *     absence vaut présomption de « non ». Complété, quand l'agrément est
 *     récent ou non indexé, par le site de la SGI (espace client, appli
 *     mobile) ou les stores Apple/Google.
 *   - `mobileMoney` : formulaire de dépôt ou FAQ du site de la SGI, et
 *     annonces de partenariat fintech. La colonne ne porte QUE le mobile
 *     money parce que virement, chèque et versement en agence marchent
 *     partout — tout compte titres est adossé à un compte espèces logé en
 *     banque, c'est structurel au marché et non un choix de la SGI. Un
 *     champ ABSENT veut dire « personne ne le publie », JAMAIS « non » :
 *     seules 11 SGI sur 40 documentent la question, et confondre les deux
 *     ferait écarter une SGI sur une lacune documentaire.
 *
 * GARDE-FOU : aucune SGI n'est recommandée, mise en avant ni partenaire. Le
 * comparateur classe sur des critères chiffrés, et renvoie systématiquement
 * à la grille tarifaire officielle, qui seule fait foi.
 */

export type Online = "oui" | "non" | "nc"; // nc = non communiqué

export type Sgi = {
  name: string;
  country: string;                  // code pays (ci, sn…)
  minDeposit: number | null;        // dépôt minimum à l'ouverture (FCFA)
  courtagePct: number | null;       // frais de courtage par transaction (%) — borne haute si fourchette
  courtageRaw?: string;             // valeur d'origine si fourchette / "max"
  custodyPctAnnual: number | null;  // droits de garde, ANNUALISÉS (%) — borne haute si fourchette
  custodyRaw?: string;              // valeur d'origine (fourchette / par trimestre)
  tenueAnnual: number | null;       // tenue de compte annuelle (FCFA), 0 = gratuit
  tenueRaw?: string;                // valeur d'origine si fourchette / par trimestre
  online: Online;                   // plateforme / appli en ligne
  mobileMoney?: Online;             // approvisionnement par mobile money — ABSENT = non vérifié, pas « non »
  fundingRaw?: string;              // le détail qui sert : opérateurs, partenaire fintech, ou les moyens à défaut
  rating?: number;                  // note sur 5 (avis Richbourse)
  phone?: string;                   // téléphone de contact
  website?: string;                 // site officiel (sans https://)
};

export const SGIS: Sgi[] = [
  // --- Côte d'Ivoire (frais : PlayInvest) ---
  { name: "MATHA Securities", country: "ci", minDeposit: 0, courtagePct: 1.0, custodyPctAnnual: 0.5, custodyRaw: "0,5 %/an — grille CREPMF", tenueAnnual: 10_000, tenueRaw: "10 000/an — grille CREPMF", online: "oui", mobileMoney: "non", fundingRaw: "chèque ou virement bancaire", rating: 4.0, phone: "+225 27 20 32 14 50" },
  { name: "SGI BICI Bourse", country: "ci", minDeposit: 0, courtagePct: 1.0, courtageRaw: "0,4–1 %", custodyPctAnnual: 0.5, custodyRaw: "0,1–0,5 %/an — grille officielle", tenueAnnual: 5_000, tenueRaw: "5 000/an (pers. physique)", online: "oui", rating: 3.2, phone: "+225 20 20 16 68" },
  { name: "SG Capital Securities WA", country: "ci", minDeposit: 0, courtagePct: 0.8, custodyPctAnnual: 0.50, tenueAnnual: null, online: "oui", rating: 2.9, phone: "+225 27 20 20 10 10" },
  { name: "SGI MAC African", country: "ci", minDeposit: 0, courtagePct: 0.85, courtageRaw: "max 0,85 %", custodyPctAnnual: 0.50, custodyRaw: "0,5 %/an (≤3 Md) — grille officielle", tenueAnnual: 10_000, tenueRaw: "10 000/an", online: "oui", mobileMoney: "non", fundingRaw: "espèces aux guichets BDU CI / BSIC CI, chèque ou virement", rating: 3.5, phone: "+225 22 44 53 29" },
  { name: "Oragroup Securities", country: "ci", minDeposit: 0, courtagePct: 1.0, custodyPctAnnual: 0.50, custodyRaw: "0,125 %/trim.", tenueAnnual: null, online: "oui", rating: 4.0, phone: "+225 27 20 25 55 55" },
  { name: "GEK Capital", country: "ci", minDeposit: 200_000, courtagePct: 1.0, custodyPctAnnual: 0.50, tenueAnnual: null, online: "oui", rating: 4.5, phone: "+225 27 22 22 43 60" },
  { name: "NSIA Finance", country: "ci", minDeposit: 200_000, courtagePct: 1.0, custodyPctAnnual: 0.5, custodyRaw: "0,125 %/trim. = 0,5 %/an — grille officielle", tenueAnnual: 10_000, tenueRaw: "2 500/trim = 10 000/an", online: "oui", mobileMoney: "oui", fundingRaw: "APaym — mobile money tous opérateurs + carte Visa/Mastercard", rating: 4.1, phone: "+225 20 20 06 53" },
  { name: "Bridge Securities", country: "ci", minDeposit: 250_000, courtagePct: 1.0, custodyPctAnnual: 0.50, custodyRaw: "0,5 %/an — grille officielle", tenueAnnual: 10_000, tenueRaw: "2 500/trim = 10 000/an", online: "oui", rating: 3.6, phone: "+225 05 85 74 98 98" },
  { name: "BSIC Capital", country: "ci", minDeposit: 500_000, courtagePct: 0.8, custodyPctAnnual: 0.50, custodyRaw: "0,125 %/trim.", tenueAnnual: 10_000, online: "oui", rating: 4.9, phone: "+225 20 31 71 11" },
  { name: "SGI BNI Finances", country: "ci", minDeposit: 1_000_000, courtagePct: 1.0, custodyPctAnnual: 0.50, custodyRaw: "0,125 %/trim.", tenueAnnual: 0, online: "oui", rating: 2.5, phone: "+225 20 31 07 77" },
  { name: "BOA Capital Securities", country: "ci", minDeposit: 1_000_000, courtagePct: 1.0, custodyPctAnnual: 0.27, tenueAnnual: 0, online: "oui", mobileMoney: "non", rating: 3.5, phone: "+225 20 30 21 22" },
  { name: "Attijari Securities WA", country: "ci", minDeposit: 1_000_000, courtagePct: 1.0, courtageRaw: "max 1 %", custodyPctAnnual: 0.50, custodyRaw: "max 0,5 %/an — grille officielle", tenueAnnual: 2_000, tenueRaw: "2 000/an", online: "oui", rating: 2.8, phone: "+225 20 21 98 26" },
  { name: "SGI EDC Investment", country: "ci", minDeposit: 1_000_000, courtagePct: 1.0, courtageRaw: "0,4–1 %", custodyPctAnnual: 0.50, custodyRaw: "0–0,5 %/an (max 0,5 %)", tenueAnnual: 5_000, tenueRaw: "5 000/an (pers. physique)", online: "oui", rating: 3.7, phone: "+225 20 21 10 44" },
  { name: "Sirius Capital", country: "ci", minDeposit: 1_000_000, courtagePct: 1.0, custodyPctAnnual: 0.50, custodyRaw: "max 0,5 %/an — grille officielle", tenueAnnual: 10_000, tenueRaw: "2 500/trim = 10 000/an", online: "oui", mobileMoney: "oui", fundingRaw: "Julaya — appli « Sirius Invest », dépôts et retraits sur mobile money", rating: 4.3, phone: "+225 20 24 24 65" },
  { name: "Atlantique Finance", country: "ci", minDeposit: 2_000_000, courtagePct: 0.65, courtageRaw: "0,65 % (max 1 %)", custodyPctAnnual: 0.3, custodyRaw: "0,3 %/an <100M (max 0,5 %) — grille CREPMF", tenueAnnual: 0, tenueRaw: "Néant (max 15 625)", online: "oui", rating: 4.2, phone: "+225 20 31 21 21" },
  { name: "Phoenix Capital Management", country: "ci", minDeposit: 2_000_000, courtagePct: 1.0, custodyPctAnnual: 0.40, custodyRaw: "0,4 %/an — grille officielle", tenueAnnual: 25_000, tenueRaw: "0 à 25 000/an", online: "oui", rating: 4.6, phone: "+225 27 22 59 85 80" },
  { name: "SGI Hudson & Cie", country: "ci", minDeposit: 50_000_000, courtagePct: 1.0, custodyPctAnnual: 0.50, custodyRaw: "max 0,5 %/an", tenueAnnual: 15_625, tenueRaw: "15 625 (sikafinance, non lue sur grille)", online: "oui", rating: 4.3, phone: "+225 20 31 55 00" },

  // Dernières agréées (2025-2026). Les agrégateurs ne les couvrent pas encore :
  // frais lus DIRECTEMENT sur la grille homologuée par l'AMF-UMOA, seule source
  // existante. Leur `online: "oui"` est le plus solide du tableau — la grille
  // facture une ligne « Frais de bourse en ligne », donc le service existe.
  // Dépôt minimum et note restent inconnus : aucune fiche ne les publie.
  { name: "Kerales Finance", country: "ci", minDeposit: null, courtagePct: 1.0, courtageRaw: "max 1 %", custodyPctAnnual: 0.50, custodyRaw: "max 0,5 %/an — grille AMF 2026", tenueAnnual: 15_625, tenueRaw: "max 15 625/an", online: "oui" },
  { name: "Mansa Capital", country: "ci", minDeposit: null, courtagePct: 1.0, courtageRaw: "max 1 % HT", custodyPctAnnual: 0.50, custodyRaw: "max 0,5 %/an HT — grille AMF 2026", tenueAnnual: 10_000, tenueRaw: "2 500 HT/trim. (pers. physique) = 10 000/an", online: "oui" },
  { name: "One Africa Markets (OAM CI)", country: "ci", minDeposit: null, courtagePct: 0.8, courtageRaw: "max 0,80 % HT", custodyPctAnnual: 0.50, custodyRaw: "max 0,5 %/an HT — grille AMF 2026", tenueAnnual: 15_625, tenueRaw: "max 15 625/an", online: "oui", website: "oamarkets.ci" },

  // --- Autres pays UEMOA (frais : Sikafinance ; note + tél : Richbourse) ---
  // Sénégal
  { name: "ABCO Bourse", country: "sn", minDeposit: 0, courtagePct: 1.0, custodyPctAnnual: 0.25, custodyRaw: "0,25 %/an (prélevé au trimestre) — grille officielle", tenueAnnual: 0, online: "oui", mobileMoney: "oui", fundingRaw: "Wave Sénégal, Orange Money Sénégal + carte bancaire", rating: 4.3, phone: "+221 33 822 68 00", website: "abcobourse.com" },
  { name: "Finance Gestion Intermédiation (FGI)", country: "sn", minDeposit: 0, courtagePct: 1.0, custodyPctAnnual: 0.25, tenueAnnual: 0, online: "oui", mobileMoney: "oui", fundingRaw: "moyens de paiement mobile via la plateforme JOKKO-FI", rating: 4.6, phone: "+221 33 867 60 42", website: "fgi-bourse.com" },
  { name: "Invictus Capital & Finance", country: "sn", minDeposit: 0, courtagePct: 0.9, custodyPctAnnual: 0.2, custodyRaw: "0,2 %/an (prélèv. trim.) — grille CREPMF", tenueAnnual: 0, online: "oui", mobileMoney: "oui", fundingRaw: "InTouch — Orange Money, Wave, Free Money, Wizall + carte bancaire", rating: 4.3, phone: "+221 33 864 58 58", website: "invictuscapfin.com" },
  { name: "CGF Bourse", country: "sn", minDeposit: 100_000, courtagePct: 1.0, courtageRaw: "max 1 %", custodyPctAnnual: 0.25, custodyRaw: "max 0,25 %/an — grille CREPMF", tenueAnnual: 0, tenueRaw: "Néant (grille officielle)", online: "oui", mobileMoney: "oui", fundingRaw: "Orange Money via CGF ACCESS", rating: 4.6, phone: "+221 33 864 97 97" },
  { name: "Impaxis Securities", country: "sn", minDeposit: 250_000, courtagePct: 0.8, courtageRaw: "max 0,80 %", custodyPctAnnual: 0.2, custodyRaw: "0,05 %/trimestre", tenueAnnual: 2_000, online: "oui", rating: 4.0, phone: "+221 33 869 31 40" },
  { name: "Everest Finance", country: "sn", minDeposit: null, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "oui", rating: 4.0, phone: "+221 33 822 87 00", website: "everestfin.com" },
  // Burkina Faso
  { name: "Coris Bourse", country: "bf", minDeposit: 50_000, courtagePct: 1.0, courtageRaw: "max 1 %", custodyPctAnnual: 0.5, custodyRaw: "max 0,5 %/an — grille CREPMF 2018", tenueAnnual: 10_000, tenueRaw: "max 10 000/an", online: "oui", rating: 4.1, phone: "+226 25 33 14 85", website: "corisbourse.com" },
  { name: "SA2IF — Ingénierie & Intermédiation Financières", country: "bf", minDeposit: 68_000, courtagePct: 1.0, courtageRaw: "0,2–1 %", custodyPctAnnual: 0.2, custodyRaw: "0,1–0,2 %/an — grille CREPMF", tenueAnnual: 8_000, tenueRaw: "2 000/trim = 8 000/an", online: "oui", mobileMoney: "oui", fundingRaw: "Orange Money Burkina Faso et Orange Money Côte d'Ivoire", rating: 4.7, phone: "+226 75 20 01 01", website: "sa2if.com" },
  { name: "SBIF — Société Burkinabè d'Intermédiation Financière", country: "bf", minDeposit: 300_000, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "oui", rating: 4.5, phone: "+226 25 33 04 91" },
  { name: "IMAGE Finances Internationales", country: "bf", minDeposit: null, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "nc", website: "image-finance.com" },
  // Bénin
  { name: "Africaine de Gestion et d'Intermédiation (AGI)", country: "bj", minDeposit: 0, courtagePct: 1.0, custodyPctAnnual: 0.3, tenueAnnual: 0, online: "oui", rating: 4.4, phone: "+229 21 31 87 33" },
  { name: "SGI Africabourse", country: "bj", minDeposit: 100_000, courtagePct: 1.0, custodyPctAnnual: 0.35, custodyRaw: "0,25–0,35 %/an", tenueAnnual: 1_000, online: "oui", rating: 3.2, phone: "+229 21 31 88 35" },
  { name: "SGI Bénin", country: "bj", minDeposit: 0, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "oui", mobileMoney: "non", fundingRaw: "chèque, virement ou bordereau de dépôt", rating: 3.4, phone: "+229 21 31 15 41" },
  { name: "BIIC Financial Services (BFS)", country: "bj", minDeposit: 50_000, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "oui", rating: 3.5, phone: "+229 21 32 48 75" },
  { name: "United Capital for Africa", country: "bj", minDeposit: null, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "nc" },
  // Mali
  { name: "SGI Mali", country: "ml", minDeposit: 50_000, courtagePct: 1.0, courtageRaw: "max 1 %", custodyPctAnnual: 0.5, custodyRaw: "max 0,5 %/an — grille CREPMF", tenueAnnual: 12_500, tenueRaw: "12 500 (max 15 625)", online: "non", rating: 1.0, phone: "+223 20 29 41 19" },
  { name: "Global Capital", country: "ml", minDeposit: 0, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "non", rating: 4.0, phone: "+223 44 90 59 74" },
  { name: "Compagnie d'Ingénierie Financière et d'Assistance en Bourse", country: "ml", minDeposit: null, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "nc" },
  // Niger
  { name: "SGI Niger", country: "ne", minDeposit: 0, courtagePct: 1.0, custodyPctAnnual: 0.25, tenueAnnual: 6_000, tenueRaw: "1 500/trimestre", online: "oui", rating: 4.3, phone: "+227 20 73 78 18" },
  // Togo
  { name: "SGI Togo", country: "tg", minDeposit: null, courtagePct: null, custodyPctAnnual: null, tenueAnnual: null, online: "oui", rating: 2.6, phone: "+228 22 22 31 45" },
];

/** Fiches Richbourse — elles portent le lien vers la grille tarifaire officielle (PDF). */
const RB_SLUG: Record<string, string> = {
  "MATHA Securities": "matha-capital",
  "SGI BICI Bourse": "sgi-bici-bourse",
  "SG Capital Securities WA": "sogebourse",
  "SGI MAC African": "mac-african",
  "Oragroup Securities": "oragroup-securities",
  "GEK Capital": "gek-capital",
  "NSIA Finance": "sgi-nsia-finances",
  "Bridge Securities": "bridge-securities",
  "BSIC Capital": "bsic-capital-sa",
  "SGI BNI Finances": "sgi-bni-finance",
  "BOA Capital Securities": "sgi-boa-capital-securities",
  "Attijari Securities WA": "sgi-africaine-de-bourse",
  "SGI EDC Investment": "sgi-edc-investment-corporation",
  "Sirius Capital": "sirius-capital",
  "Atlantique Finance": "sgi-atlantique-finance",
  "Phoenix Capital Management": "sgi-phoenix-capital-management",
  "SGI Hudson & Cie": "sgi-hudson-cie",
  "ABCO Bourse": "abco-bourse",
  "Finance Gestion Intermédiation (FGI)": "finance-gestion-intermediation",
  "Invictus Capital & Finance": "invictus-capital-finance",
  "CGF Bourse": "sgi-cgf-bourse",
  "Impaxis Securities": "sgi-impaxis-securities",
  "Everest Finance": "sgi-everest-finance",
  "Coris Bourse": "coris-bourse",
  "SA2IF — Ingénierie & Intermédiation Financières": "societe-africaine-dingenierie-et-dintermediation-financiere-sa2if",
  "SBIF — Société Burkinabè d'Intermédiation Financière": "sgi-sbif",
  "Africaine de Gestion et d'Intermédiation (AGI)": "africaine-gestion-intermediation",
  "SGI Africabourse": "africabourse",
  "SGI Bénin": "sgi-benin",
  "BIIC Financial Services (BFS)": "sgi-bibe-finance",
  "SGI Mali": "sgi-mali",
  "Global Capital": "global-capital",
  "SGI Niger": "sgi-niger",
  "SGI Togo": "sgi-togo",
  // Trois dernières agréées + trois qui n'avaient jamais eu de slug : sans lui,
  // leur ligne n'offrait aucun lien vers la grille tarifaire officielle — le
  // seul document qui fasse foi, et le renvoi que promet le garde-fou ci-dessus.
  "Kerales Finance": "kerales-finance",
  "Mansa Capital": "mansa-capital",
  "One Africa Markets (OAM CI)": "one-africa-markets",
  "United Capital for Africa": "united-capital-for-africa",
  "IMAGE Finances Internationales": "images-finances-internationales",
  "Compagnie d'Ingénierie Financière et d'Assistance en Bourse": "cifa-bourse",
};

export function richbourseUrl(name: string): string | undefined {
  return RB_SLUG[name]
    ? `https://www.richbourse.com/common/apprendre/details-sgi/${RB_SLUG[name]}`
    : undefined;
}

/** Liste officielle et complète, toutes SGI et tous pays — la référence. */
export const BRVM_SGI_LIST_URL = "https://www.brvm.org/fr/intervenants/sgi/tous";

const COUNTRY_NAMES: Record<string, string> = {
  ci: "Côte d'Ivoire",
  sn: "Sénégal",
  bf: "Burkina Faso",
  bj: "Bénin",
  ml: "Mali",
  ne: "Niger",
  tg: "Togo",
  gw: "Guinée-Bissau",
};

export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code.toUpperCase();
}

/** Les pays réellement représentés, par nombre de SGI décroissant. */
export function sgiCountries(): { code: string; name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const s of SGIS) counts.set(s.country, (counts.get(s.country) ?? 0) + 1);
  return [...counts.entries()]
    .map(([code, count]) => ({ code, name: countryName(code), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"));
}
