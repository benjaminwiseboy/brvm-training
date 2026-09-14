import { delay } from "./style";

/**
 * Les objections sont la voix du visiteur : c'est la citation qui doit dominer,
 * pas une pastille d'icône. D'où des lignes pleine largeur — la phrase à gauche,
 * ce qu'elle coûte à droite — au lieu de trois cartes de plus.
 */
const PAINS = [
  {
    title: "Le flou total",
    quote: "« Je ne sais pas par où commencer »",
    pain: "Il y a tellement d’informations éparpillées que vous ne savez pas quelle première étape franchir, quelle stratégie adopter, ni comment vous lancer en toute sécurité.",
  },
  {
    title: "La peur du risque & le mur du jargon",
    quote: "« Et si je faisais le mauvais choix ? »",
    pain: "Les termes financiers bizarres vous font peur. Vous avez peur de faire un mauvais choix et de gâcher l’argent que vous avez eu tant de mal à économiser.",
  },
  {
    title: "Des formations inaccessibles ou rébarbatives",
    quote: "« Tout ça pour des cours en visio ? »",
    pain: "Les rares formations existantes coûtent souvent plusieurs mois d’épargne pour des heures de cours en visio fatigants le soir ou des livres théoriques imbuvables. Résultat : vous abandonnez, et votre argent continue de perdre sa valeur sans rien produire.",
  },
];

export default function Freins() {
  return (
    <section className="section section--dark frein">
      <span className="glow frein__glow" />

      <div className="shell">
        <div className="frein__top">
          <header className="head" data-reveal="left">
            <h2 className="h2">
              Vous voulez faire grandir votre épargne… mais les préjugés et la peur vous bloquent.
            </h2>
          </header>

          <div className="frein__story" data-reveal="right">
            <p>
              Vous travaillez dur pour économiser chaque mois. Vous avez envie d’investir cet argent
              pour préparer votre avenir, soutenir des projets ou bâtir un patrimoine solide pour
              votre famille.
            </p>
            <p>
              Mais dès qu’on parle de la Bourse africaine, les doutes apparaissent : vous pensez
              peut-être que c’est <em>trop risqué</em>, <em>trop compliqué</em>, ou réservé aux gens
              riches et très diplômés à Abidjan ou Dakar.
            </p>
            <p>
              Ce sont des idées reçues. Mais au moment de vous lancer, la réalité du marché vous
              décourage…
            </p>
          </div>
        </div>

        <div className="frein__list">
          {PAINS.map((item, index) => (
            <article
              className="frein__item"
              key={item.title}
              data-reveal
              style={delay(index * 110)}
            >
              <div className="frein__voice">
                <p className="frein__quote">{item.quote}</p>
                <p className="frein__label">{item.title}</p>
              </div>
              <p className="frein__pain">{item.pain}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
