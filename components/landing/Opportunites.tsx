import { Banknote, Globe, TrendUp } from "./Icons";
import { delay } from "./style";

const CARDS = [
  {
    icon: <TrendUp />,
    kpi: "+100 %",
    kpiLabel: "en une année · ex. ETI Ecobank",
    title: "Des croissances spectaculaires",
    text: "Concrètement : 100 000 FCFA placés au début de cette hausse en valaient 200 000 un an plus tard, soit 100 000 FCFA de gain. Encore fallait-il savoir repérer l’occasion — c’est ce que le parcours vous apprend.",
  },
  {
    icon: <Banknote />,
    kpi: "7 à 12 %",
    kpiLabel: "de dividendes par an",
    title: "Des revenus versés chaque année",
    text: "Des entreprises qui vous versent directement une partie de leurs bénéfices chaque année, bien plus que ce que vous rapporte un compte bancaire ordinaire.",
  },
  {
    icon: <Globe />,
    kpi: "Économie réelle",
    kpiLabel: "télécoms · banque · énergie",
    title: "Un investissement utile & concret",
    text: "Devenez copropriétaire des géants que vous utilisez au quotidien. Vous faites grandir votre patrimoine tout en injectant de l’argent dans l’économie réelle.",
  },
];

export default function Opportunites() {
  return (
    <section className="section opp" id="opportunites">
      <div className="shell">
        <header className="head" data-reveal>
          <p className="eyebrow">Le potentiel méconnu</p>
          <h2 className="h2">
            Faire fructifier son argent tout en soutenant la croissance du continent.
          </h2>
          <p className="lead">
            Beaucoup l’ignorent, mais la Bourse Régionale (BRVM) permet à n’importe qui de placer
            son épargne dans des entreprises solides d’Afrique de l’Ouest et de récolter les fruits
            de leur succès.
          </p>
        </header>

        <div className="grid grid--3 opp__grid">
          {CARDS.map((card, index) => (
            <article
              className="card card--hover"
              key={card.title}
              data-reveal
              style={delay(index * 110)}
            >
              <span className="card__ico">{card.icon}</span>
              <p className="opp__kpi">
                {card.kpi}
                <small>{card.kpiLabel}</small>
              </p>
              <h3 className="h3 opp__name">{card.title}</h3>
              <p className="card__text">{card.text}</p>
            </article>
          ))}
        </div>

        <div className="opp__quote" data-reveal="zoom">
          <p>
            Ces opportunités ne sont pas réservées aux banquiers ou aux experts en finance. Pourtant,
            la plupart des gens n’en profitent jamais. <strong>Pourquoi ?</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
