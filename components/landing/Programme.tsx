import { Trophy } from "./Icons";
import { step } from "./style";

type Phase = {
  n: string;
  title: string;
  transfo: string;
  tag?: string;
  win?: string;
};

const PHASES: Phase[] = [
  {
    n: "01",
    tag: "4 modules offerts",
    title: "Comprendre avant d’agir",
    transfo:
      "Vous démystifiez la Bourse africaine : ce qu’est réellement la BRVM (8 pays, un seul compte), comment on y gagne de l’argent — le dividende versé chaque année et la plus-value — et à quoi servent ses trois produits : action, obligation, OPCVM.",
    win: "Vous savez enfin de quoi tout le monde parle, et vous connaissez les 3 règles d’or à respecter avant de placer le moindre franc.",
  },
  {
    n: "02",
    title: "Trouver sa boussole",
    transfo:
      "Vous découvrez votre profil d’investisseur, les trois stratégies possibles — rente, croissance, trade — et le vrai moteur de l’enrichissement : la régularité et les intérêts composés.",
    win: "Vous repartez avec VOTRE plan d’investissement : objectif, horizon, stratégie et montant à placer chaque mois, enregistré dans le Coffre-fort.",
  },
  {
    n: "03",
    title: "Passage à l’action",
    transfo:
      "Vous comprenez comment fonctionnent les SGI (les intermédiaires agréés), ce que coûtent vraiment leurs frais, et comment lire une fiche OPCVM pour déléguer en connaissance de cause.",
    win: "Vous choisissez votre SGI, vous ouvrez votre compte-titres — même depuis la diaspora — et vous passez votre tout premier ordre sans tomber dans le piège du prix.",
  },
  {
    n: "04",
    title: "Devenir analyste",
    transfo:
      "Le cœur de la méthode : lire le Bulletin Officiel de la Cote sans paniquer, décoder une obligation, et juger une entreprise en quatre temps — son portrait, sa performance, ses perspectives et son juste prix.",
    win: "Vous menez seul une analyse complète, du portrait au verdict d’achat, et vous décidez d’après vos critères plutôt que d’après vos émotions.",
  },
  {
    n: "05",
    title: "Rester maître du jeu",
    transfo:
      "Vous passez des tests sur des cas d’entreprises fictives : à vous de mener l’analyse de bout en bout et de rendre votre verdict, comme vous le ferez avec une vraie action. Au programme aussi : la fiscalité en pratique, les bonnes raisons de vendre et comment garder son sang-froid en cas de krach.",
    win: "Vous validez l’évaluation finale et recevez votre badge de certification officiel.",
  },
];

const STATS = [
  { value: "28", label: "modules" },
  { value: "5", label: "phases" },
  { value: "5 min", label: "par jour" },
  { value: "Accès", label: "à vie" },
];

export default function Programme() {
  return (
    <section className="section parcours" id="programme">
      <div className="shell">
        <header className="head" data-reveal>
          <p className="eyebrow">Votre parcours de transformation</p>
          <h2 className="h2">De débutant complet à investisseur confiant.</h2>
          <p className="lead">
            Pas de cours théoriques ennuyeux. Chaque étape est pensée pour vous apporter un
            savoir-faire immédiat.
          </p>
          <div className="parcours__stats">
            {STATS.map((stat) => (
              <span className="parcours__stat" key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </span>
            ))}
          </div>
        </header>

        <div className="steps">
          <span className="steps__rail" aria-hidden="true">
            <span className="steps__fill" />
          </span>

          <ol className="steps__list">
            {PHASES.map((phase, index) => (
            <li className="step" key={phase.n} data-reveal style={step(index)}>
              <span className="step__node" aria-hidden="true">
                {phase.n}
              </span>
              <article className="card step__card">
                <div className="step__meta">
                  <span className="step__phase">Phase {phase.n}</span>
                  {phase.tag ? <span className="step__tag">{phase.tag}</span> : null}
                </div>
                <h3 className="h3">{phase.title}</h3>
                <p className="step__transfo">
                  <b>Votre transformation. </b>
                  {phase.transfo}
                </p>
                {phase.win ? (
                  <p className="step__win">
                    <Trophy />
                    <span>
                      <b>Victoire rapide. </b>
                      {phase.win}
                    </span>
                  </p>
                ) : null}
              </article>
            </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
