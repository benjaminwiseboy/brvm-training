/**
 * Glossaire de l'investisseur BRVM — porté depuis
 * `BRVM Learning/Glossaire.txt` (règle de fidélité du contenu : les
 * définitions ne sont pas reformulées ici, elles sont transcrites).
 *
 * Le fichier source annonçait lui-même la cible : « Dans l'application, il
 * est consultable à tout moment (recherche + termes cliquables dans les
 * cours). » C'est ce que branchent `app/coffre/glossaire` et `lib/glossary.ts`.
 *
 * Fichier GÉNÉRÉ à partir du .txt : pour corriger une définition, corrigez
 * le .txt et régénérez, sinon les deux versions divergeront.
 */

export type GlossaryEntry = {
  /** Libellé affiché, parenthèses comprises (« Actif net (ou valeur comptable) »). */
  term: string;
  /** Lettre de section, pour l'index A-Z. */
  letter: string;
  /** Définition, en markup léger (**gras** et `code`). */
  definition: string;
  /** Précisions en puces, quand le .txt en donne (modes d'amortissement…). */
  extra?: string[];
  /**
   * Formes à repérer dans le texte des cours — le terme sans sa parenthèse,
   * plus ses synonymes courts (« CMP », « fourchette », « ex-dividende »).
   * Les parenthèses purement descriptives n'en sont pas.
   */
  match: string[];
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Action",
    letter: "A",
    definition: "Une petite part de propriété d'une entreprise. En détenir, c'est être copropriétaire : vous touchez une part des bénéfices (dividende) et profitez de la hausse de sa valeur (plus-value).",
    match: ["Action"],
  },
  {
    term: "Actif net (ou valeur comptable)",
    letter: "A",
    definition: "Ce que vaut une entreprise \"sur le papier\" : tout ce qu'elle possède, moins ses dettes.",
    match: ["Actif net", "valeur comptable"],
  },
  {
    term: "Amortissement (modes de remboursement d'une obligation)",
    letter: "A",
    definition: "La façon dont l'émetteur vous rend votre capital :",
    extra: [
      "**IF — In Fine** : tout le capital d'un coup, à la fin.",
      "**AC — Amortissement Constant** : le capital par tranches égales à chaque période.",
      "**ACD — Amortissement Constant Différé** : comme AC, mais après quelques années où l'on ne touche que les intérêts (le plus fréquent pour les États BRVM).",
      "**AD — Amortissement Dégressif** : des remboursements de capital plus gros au début, puis décroissants.",
    ],
    match: ["Amortissement"],
  },
  {
    term: "BCEAO",
    letter: "B",
    definition: "Banque Centrale des États de l'Afrique de l'Ouest. Elle pilote la monnaie et les taux d'intérêt de la zone UEMOA.",
    match: ["BCEAO"],
  },
  {
    term: "BNPA",
    letter: "B",
    definition: "Bénéfice Net Par Action : le bénéfice de l'entreprise divisé par le nombre d'actions. Sert à calculer le PER.",
    match: ["BNPA"],
  },
  {
    term: "BOC",
    letter: "B",
    definition: "Bulletin Officiel de la Cote. Le document publié chaque jour de bourse par la BRVM, qui récapitule tous les prix, indices et opérations.",
    match: ["BOC"],
  },
  {
    term: "Bottom-up",
    letter: "B",
    definition: "Une analyse qui part de l'entreprise elle-même (son avantage concurrentiel, sa solidité), indépendamment du contexte global. Voir aussi Top-down.",
    match: ["Bottom-up"],
  },
  {
    term: "BRVM",
    letter: "B",
    definition: "Bourse Régionale des Valeurs Mobilières. La bourse commune aux 8 pays de l'UEMOA.",
    match: ["BRVM"],
  },
  {
    term: "Capitalisation boursière",
    letter: "C",
    definition: "La valeur totale d'une entreprise en bourse : `cours × nombre d'actions`. Elle indique sa taille.",
    match: ["Capitalisation boursière"],
  },
  {
    term: "Carnet d'ordres",
    letter: "C",
    definition: "Le tableau qui confronte, en temps réel, les propositions des acheteurs et des vendeurs pour une action.",
    match: ["Carnet d'ordres"],
  },
  {
    term: "Compartiment",
    letter: "C",
    definition: "Le \"classement\" des sociétés cotées selon leur taille et leurs exigences : **Prestige** (les plus grandes), **Principal**, **Croissance** (les plus jeunes).",
    match: ["Compartiment"],
  },
  {
    term: "Coupe-circuit (limites de fluctuation)",
    letter: "C",
    definition: "Un mécanisme de sécurité : une action ne peut ni monter ni baisser de plus de **±7,5 %** au cours d'une seule séance.",
    match: ["Coupe-circuit", "limites de fluctuation"],
  },
  {
    term: "Coupon",
    letter: "C",
    definition: "L'intérêt versé par une obligation (ex. 6,5 % du nominal par an). Sa fréquence est Annuelle (A), Semestrielle (S) ou Trimestrielle (T).",
    match: ["Coupon"],
  },
  {
    term: "Coupon couru",
    letter: "C",
    definition: "Les intérêts déjà accumulés depuis le dernier versement. Si vous achetez une obligation en cours de période, vous les remboursez au vendeur.",
    match: ["Coupon couru"],
  },
  {
    term: "Cours moyen pondéré (CMP)",
    letter: "C",
    definition: "Votre prix d'achat moyen pour une action, une fois toutes vos acquisitions additionnées : `total investi ÷ nombre d'actions détenues`. C'est votre point d'équilibre : au-dessus, vous êtes en gain ; en dessous, en perte. Le DCA construit ce CMP achat après achat.",
    match: ["Cours moyen pondéré", "CMP"],
  },
  {
    term: "Cours de clôture",
    letter: "C",
    definition: "Le dernier prix d'une action à la fin de la journée de bourse.",
    match: ["Cours de clôture"],
  },
  {
    term: "Cours de référence",
    letter: "C",
    definition: "Le prix \"pivot\" qui sert de base pour calculer les limites de fluctuation (±7,5 %) de la séance suivante.",
    match: ["Cours de référence"],
  },
  {
    term: "DCA (Dollar Cost Averaging)",
    letter: "D",
    definition: "Investir le même montant, à intervalle régulier (chaque mois), quoi qu'il arrive sur le marché. Cela lisse le prix d'achat et supprime le stress du \"bon moment\".",
    match: ["DCA", "Dollar Cost Averaging"],
  },
  {
    term: "DC/BR",
    letter: "D",
    definition: "Dépositaire Central / Banque de Règlement. L'institution qui conserve vos titres et règle les transactions en coulisses.",
    match: ["DC/BR"],
  },
  {
    term: "Date de détachement (ex-dividende)",
    letter: "D",
    definition: "La date limite pour détenir une action et avoir droit à son dividende. Acheter après cette date = pas de dividende cette année-là.",
    match: ["Date de détachement", "ex-dividende"],
  },
  {
    term: "Diversification",
    letter: "D",
    definition: "Répartir son argent sur plusieurs valeurs et secteurs pour ne pas tout risquer sur une seule.",
    match: ["Diversification"],
  },
  {
    term: "Dividende",
    letter: "D",
    definition: "La part des bénéfices qu'une entreprise verse en cash à ses actionnaires (souvent une fois par an).",
    match: ["Dividende"],
  },
  {
    term: "DNPA",
    letter: "D",
    definition: "Dividende Net Par Action. Sert à calculer le rendement (DNPA ÷ Cours).",
    match: ["DNPA"],
  },
  {
    term: "FCP (Fonds Commun de Placement)",
    letter: "F",
    definition: "Un type d'OPCVM : un panier de titres géré par des professionnels, dont vous achetez une part.",
    match: ["FCP"],
  },
  {
    term: "Flottant",
    letter: "F",
    definition: "La proportion des actions réellement disponibles à l'achat sur le marché (le reste étant détenu durablement par les gros actionnaires).",
    match: ["Flottant"],
  },
  {
    term: "Fonds d'urgence",
    letter: "F",
    definition: "3 à 6 mois de dépenses mis de côté dans un endroit sûr et accessible, AVANT d'investir. Votre bouclier en cas d'imprévu.",
    match: ["Fonds d'urgence"],
  },
  {
    term: "Fossé (avantage concurrentiel)",
    letter: "F",
    definition: "Ce qui protège durablement une entreprise de ses concurrents : marque forte, réseau difficile à copier, position dominante, coûts bas.",
    match: ["Fossé", "avantage concurrentiel"],
  },
  {
    term: "HAO (Résultat Hors Activités Ordinaires)",
    letter: "H",
    definition: "Un gain (ou une perte) exceptionnel, non récurrent (ex. la vente d'un bâtiment). À surveiller : un beau résultat net porté par du HAO cache parfois un cœur de métier faible.",
    match: ["HAO"],
  },
  {
    term: "Horizon de placement",
    letter: "H",
    definition: "La durée pendant laquelle vous pouvez laisser votre argent investi sans y toucher. Plus il est long, plus vous pouvez viser la croissance.",
    match: ["Horizon de placement"],
  },
  {
    term: "Indice",
    letter: "I",
    definition: "Une moyenne qui résume la performance d'un groupe de valeurs. Principaux : **BRVM Composite** (toutes les sociétés), **BRVM 30** (les 30 plus liquides), **BRVM Prestige**.",
    match: ["Indice"],
  },
  {
    term: "Intérêts composés",
    letter: "I",
    definition: "Les intérêts qui génèrent à leur tour des intérêts. Réinvestis dans la durée, ils font \"exploser\" la courbe de richesse.",
    match: ["Intérêts composés"],
  },
  {
    term: "IRVM",
    letter: "I",
    definition: "Impôt sur le Revenu des Valeurs Mobilières : l'impôt sur les dividendes (≈ 12 % pour les particuliers), prélevé automatiquement à la source.",
    match: ["IRVM"],
  },
  {
    term: "Liquidité",
    letter: "L",
    definition: "La facilité à acheter ou revendre une action rapidement, sans faire bouger son prix. Se lit dans le Volume échangé.",
    match: ["Liquidité"],
  },
  {
    term: "Marge de sécurité",
    letter: "M",
    definition: "Le principe de Graham : acheter une action nettement en dessous de sa valeur réelle, pour se garder un coussin en cas d'imprévu.",
    match: ["Marge de sécurité"],
  },
  {
    term: "Nominal (valeur nominale)",
    letter: "N",
    definition: "Le montant d'une part d'obligation (souvent 10 000 FCFA), et le capital qui vous sera remboursé à l'échéance.",
    match: ["Nominal", "valeur nominale"],
  },
  {
    term: "Obligation",
    letter: "O",
    definition: "Un prêt : vous prêtez de l'argent (souvent à un État), qui vous verse des intérêts (coupon) puis vous rend votre capital. Placement plus sûr et prévisible qu'une action.",
    match: ["Obligation"],
  },
  {
    term: "OPCVM",
    letter: "O",
    definition: "Organisme de Placement Collectif en Valeurs Mobilières. Un panier de titres géré par des pros (FCP ou SICAV). Catégories : **A** (actions), **OMLT/OCT** (obligations), **D** (diversifié), **M** (monétaire), **C** (contractuel).",
    match: ["OPCVM"],
  },
  {
    term: "Ordre à cours limité",
    letter: "O",
    definition: "Un ordre d'achat/vente avec un prix maximum (ou minimum) fixé. Vous maîtrisez le prix, au risque de ne pas être exécuté. **Recommandé à la BRVM.**",
    match: ["Ordre à cours limité"],
  },
  {
    term: "Ordre au marché",
    letter: "O",
    definition: "Un ordre exécuté immédiatement au prix disponible, quel qu'il soit. Rapide, mais risqué sur un marché peu liquide.",
    match: ["Ordre au marché"],
  },
  {
    term: "PBR (Price to Book Ratio)",
    letter: "P",
    definition: "`Cours ÷ Actif net par action`. Combien de fois vous payez le patrimoine de l'entreprise. Repère : bon en dessous de 1,5.",
    match: ["PBR"],
  },
  {
    term: "PER (Price Earning Ratio)",
    letter: "P",
    definition: "`Cours ÷ BNPA`. Le nombre d'années de bénéfices pour \"rembourser\" le prix de l'action. Repère BRVM : moyenne du marché ≈ 14 ; un chiffre bas est attractif.",
    match: ["PER", "Price Earning Ratio"],
  },
  {
    term: "Plus-value",
    letter: "P",
    definition: "Le gain réalisé en revendant une action plus cher qu'à l'achat. À la BRVM, généralement exonérée d'impôt pour les particuliers.",
    match: ["Plus-value"],
  },
  {
    term: "PNB (Produit Net Bancaire)",
    letter: "P",
    definition: "L'équivalent du \"chiffre d'affaires\" pour une banque : ce qu'elle garde vraiment de son activité (marge d'intérêt + commissions + gains de marché).",
    match: ["PNB", "Produit Net Bancaire"],
  },
  {
    term: "Profil de risque",
    letter: "P",
    definition: "Votre tolérance aux pertes, définie par votre horizon, votre capacité et votre psychologie : Prudent, Équilibré, Croissance ou Audacieux.",
    match: ["Profil de risque"],
  },
  {
    term: "Rééquilibrage",
    letter: "R",
    definition: "Vendre/acheter pour ramener votre portefeuille à son allocation cible (ex. revenir à 70 % actions / 30 % obligations).",
    match: ["Rééquilibrage"],
  },
  {
    term: "Rendement (net)",
    letter: "R",
    definition: "`Dividende net ÷ Cours × 100`. Ce que l'action rapporte en cash chaque année, en pourcentage du prix.",
    match: ["Rendement", "net"],
  },
  {
    term: "Résultat d'exploitation",
    letter: "R",
    definition: "Le bénéfice tiré du cœur de métier de l'entreprise. C'est le \"juge de paix\" de sa vraie performance.",
    match: ["Résultat d'exploitation"],
  },
  {
    term: "Résultat financier",
    letter: "R",
    definition: "Le résultat lié aux placements et à la trésorerie de l'entreprise (annexe à son métier principal).",
    match: ["Résultat financier"],
  },
  {
    term: "Résultat net",
    letter: "R",
    definition: "La toute dernière ligne du compte de résultat : le bénéfice final, une fois tout payé.",
    match: ["Résultat net"],
  },
  {
    term: "SGI",
    letter: "S",
    definition: "Société de Gestion et d'Intermédiation. Votre courtier : c'est chez elle que vous ouvrez un compte pour acheter/vendre à la BRVM.",
    match: ["SGI"],
  },
  {
    term: "SGO",
    letter: "S",
    definition: "Société de Gestion d'OPCVM. Les professionnels qui gèrent les FCP et SICAV.",
    match: ["SGO"],
  },
  {
    term: "SICAV",
    letter: "S",
    definition: "Société d'Investissement à Capital Variable. Une autre forme d'OPCVM (comme le FCP, vous en achetez une part).",
    match: ["SICAV"],
  },
  {
    term: "Spread (fourchette)",
    letter: "S",
    definition: "L'écart entre le meilleur prix d'achat et le meilleur prix de vente dans le carnet d'ordres. Plus il est large, moins l'action est liquide.",
    match: ["Spread", "fourchette"],
  },
  {
    term: "Top-down",
    letter: "T",
    definition: "Une analyse qui part du grand tableau (économie, secteur) pour descendre vers l'entreprise. Voir aussi Bottom-up.",
    match: ["Top-down"],
  },
  {
    term: "Total Return",
    letter: "T",
    definition: "Un indice qui inclut les dividendes réinvestis (et pas seulement la hausse des cours). Il est donc supérieur à l'indice de prix classique.",
    match: ["Total Return"],
  },
  {
    term: "Type Amort",
    letter: "T",
    definition: "La colonne du BOC qui indique le mode de remboursement d'une obligation (IF / AC / ACD / AD). Voir Amortissement.",
    match: ["Type Amort"],
  },
  {
    term: "UEMOA",
    letter: "U",
    definition: "Union Économique et Monétaire Ouest-Africaine : les 8 pays partageant le FCFA et la BRVM (Bénin, Burkina Faso, Côte d'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo).",
    match: ["UEMOA"],
  },
  {
    term: "Value trap (piège de la valeur)",
    letter: "V",
    definition: "Une action qui semble bon marché… parce que l'entreprise se dégrade réellement. Un prix bas ne suffit jamais : il faut aussi la qualité.",
    match: ["Value trap"],
  },
  {
    term: "Valeur Liquidative (VL)",
    letter: "V",
    definition: "Le prix d'une part d'OPCVM. Vous achetez et vendez à ce prix, recalculé régulièrement.",
    match: ["Valeur Liquidative", "VL"],
  },
  {
    term: "Volatilité",
    letter: "V",
    definition: "L'ampleur des variations de prix d'une action. Élevée = fortes secousses à la hausse comme à la baisse.",
    match: ["Volatilité"],
  },
  {
    term: "Volume",
    letter: "V",
    definition: "Le nombre de titres échangés dans la journée. Un bon indicateur de la liquidité d'une action.",
    match: ["Volume"],
  },
];

/** Note de bas de glossaire du .txt — les sigles d'émetteurs obligataires. */
export const GLOSSARY_FOOTER = "Sigles d'émetteurs obligataires fréquents : **TPCI** (Trésor Public Côte d'Ivoire), **TPBF** (Burkina), **TPBJ** (Bénin), **TPNE** (Niger), **TPTG** (Togo), **EOM / EOS** (États du Mali / Sénégal), **CRRH-UEMOA** (refinancement de l'habitat), **BIDC** (Banque d'Investissement de la CEDEAO).";
