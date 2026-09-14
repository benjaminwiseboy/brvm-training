import { ArrowRight, Banknote, Smartphone, Target } from "./Icons";
import { delay } from "./style";

const ROWS = [
  {
    from: "« Je ne sais pas par où commencer »",
    title: "Un parcours progressif guidé",
    to: "Une feuille de route étape par étape, de l’initiation jusqu’à votre premier placement.",
  },
  {
    from: "« Les formations sur le sujet sont hors de prix »",
    title: "Accessible à tous",
    to: "Un tarif pensé pour rester accessible, même à un étudiant, et les 4 premiers modules offerts pour juger sur pièces.",
  },
  {
    from: "« C’est trop technique et j’ai peur de perdre mon argent »",
    title: "Zéro jargon, 100 % clarté",
    to: "Des explications simples avec des quiz de validation pour apprendre en toute confiance.",
  },
  {
    from: "« Je n’ai pas le temps pour des cours de 2 h le soir »",
    title: "5 minutes par jour sur smartphone",
    to: "Des leçons courtes à suivre où et quand vous voulez.",
  },
];

const MECANIQUES = [
  {
    icon: <Banknote />,
    title: "Un capital d’entraînement qui monte et qui descend",
    text: "Vous démarrez avec 1 000 000 FCFA fictifs. Chaque bonne réponse les fait grimper, chaque erreur les fait fondre. On retient bien mieux une notion quand on a quelque chose à perdre — et le statut suit, d’Apprenti investisseur à la certification.",
  },
  {
    icon: <Target />,
    title: "Des défis, pas des chapitres",
    text: "Chaque module se termine par une mise en situation : quiz, simulateur d’intérêts composés, diagnostic de profil, construction de plan. Vous ne validez pas une leçon en la lisant, mais en décidant — puis le bilan vous explique chaque réponse.",
  },
  {
    icon: <Smartphone />,
    title: "Sur votre téléphone, avec des rappels",
    text: "Installez BRVM Learning sur votre écran d’accueil comme une vraie application, et laissez la notification vous rappeler vos 5 minutes du jour. C’est ce qui transforme une bonne intention en série qui ne se casse pas.",
  },
];

export default function Solution() {
  return (
    <section className="section section--alt sol" id="methode">
      <div className="shell">
        <header className="head" data-reveal>
          <h2 className="h2">
            Et si apprendre la Bourse devenait aussi simple, accessible et motivant qu’un jeu&nbsp;?
          </h2>
          <p className="sol__story">
            Nous avons créé le parcours que nous aurions aimé avoir à nos débuts : une méthode
            progressive qui vous prend par la main du niveau 0 jusqu’à vos premiers placements. Vous
            avancez pas à pas, à votre rythme, sans théorie inutile et sans débourser une fortune.
          </p>
        </header>

        <div className="trans">
          <div className="trans__head" data-reveal="fade">
            <span>La frustration habituelle</span>
            <span />
            <span>Avec la plateforme</span>
          </div>

          {ROWS.map((row, index) => (
            <div className="trans__row" key={row.title} data-reveal style={delay(index * 90)}>
              <p className="trans__from">{row.from}</p>
              <span className="trans__arrow">
                <ArrowRight />
              </span>
              <p className="trans__to">
                <b>{row.title}</b>
                {row.to}
              </p>
            </div>
          ))}
        </div>

        <div className="mecas">
          <h3 className="mecas__title" data-reveal>
            Ce qui fait que vous tenez jusqu’au bout
          </h3>
          <div className="grid grid--3 mecas__grid">
            {MECANIQUES.map((item, index) => (
              <article
                className="card card--hover"
                key={item.title}
                data-reveal
                style={delay(index * 110)}
              >
                <span className="card__ico">{item.icon}</span>
                <h4 className="h3">{item.title}</h4>
                <p className="card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
