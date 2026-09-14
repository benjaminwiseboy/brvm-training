import { CheckCircle, XCircle } from "./Icons";

const YES = [
  "Vous partez de zéro et voulez comprendre la Bourse simplement.",
  "Vous faites partie de la diaspora ou vous êtes un actif qui cherche une formation abordable.",
  "Vous voulez faire grandir votre épargne tout en soutenant l’économie africaine.",
];

const NO = [
  "Vous cherchez une méthode miracle pour « devenir riche en 24 heures ».",
  "Vous voulez faire du trading spéculatif agressif et dangereux.",
  "Vous n’avez pas 5 minutes par jour à accorder à votre éducation financière.",
];

export default function PourQui() {
  return (
    <section className="section fit">
      <div className="shell shell--tight">
        <header className="head head--center" data-reveal>
          <h2 className="h2">Ce parcours est‑il fait pour vous&nbsp;?</h2>
        </header>

        <div className="fit__grid">
          <div className="fit__col fit__col--yes" data-reveal="left">
            <h3 className="fit__title">
              <CheckCircle />
              C’est fait pour vous si…
            </h3>
            <ul className="fit__list">
              {YES.map((item) => (
                <li key={item}>
                  <CheckCircle />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="fit__col fit__col--no" data-reveal="right">
            <h3 className="fit__title">
              <XCircle />
              Ce n’est pas pour vous si…
            </h3>
            <ul className="fit__list">
              {NO.map((item) => (
                <li key={item}>
                  <XCircle />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
