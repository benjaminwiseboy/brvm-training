import Mockup from "./Mockup";
import { BookOpen, Check, Scale, Target } from "./Icons";
import { delay } from "./style";

const TOOLS = [
  {
    icon: <Target />,
    title: "Générateur de plan d’investissement personnel",
    text: "Vous répondez à quelques questions, la plateforme en déduit votre profil et vous repartez avec un plan écrit : objectif, horizon, stratégie et montant à placer chaque mois.",
  },
  {
    icon: <Scale />,
    title: "Comparateur de SGI",
    text: "Les sociétés de gestion et d’intermédiation agréées, côte à côte : frais d’intermédiation, droits de garde, minimum d’ouverture, accès depuis la diaspora. Aucune n’est partenaire, la comparaison reste neutre.",
  },
  {
    icon: <BookOpen />,
    title: "Glossaire interactif de la BRVM",
    text: "Plus de 60 termes expliqués en langage simple, cherchables et cliquables directement dans les leçons : plus besoin de quitter un cours parce qu’un mot vous échappe.",
  },
  {
    icon: <Check />,
    title: "Checklist de l’investisseur",
    text: "Les étapes à cocher pour vos 7 premiers jours, de la vérification de votre fonds d’urgence au passage de votre tout premier ordre.",
  },
];

export default function Outils() {
  return (
    <section className="section section--dark tools" id="outils">
      <span className="glow tools__glow" />

      <div className="shell">
        <div className="tools__layout">
          <div>
            <header className="head" data-reveal="left">
              <h2 className="h2">Tout le nécessaire pour agir facilement sans bloquer.</h2>
            </header>

            <div className="tools__list">
              {TOOLS.map((tool, index) => (
                <article className="tools__item" key={tool.title} data-reveal style={delay(index * 90)}>
                  <span className="tools__ico">{tool.icon}</span>
                  <div>
                    <h3>{tool.title}</h3>
                    <p>{tool.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div data-reveal="right">
            <Mockup
              caption="Capture — Comparateur de SGI"
              hint="Simulation des frais cumulés sur 10 ans, SGI par SGI."
              url="brvmlearning.com/coffre/sgi"
              ratio="1620 / 1129"
              src="/screenshots/comparateur-sgi.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
