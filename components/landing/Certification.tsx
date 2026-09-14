import Mockup from "./Mockup";
import { Award, Check } from "./Icons";

const POINTS = [
  "Délivrée après l’évaluation finale de la phase 5, pas à l’inscription.",
  "À votre nom, avec la date d’obtention et le détail des compétences validées.",
  "Partageable en un clic sur LinkedIn, WhatsApp ou Facebook.",
];

export default function Certification() {
  return (
    <section className="section cert" id="certification">
      <div className="shell">
        <div className="cert__layout">
          <div data-reveal="left">
            <p className="eyebrow">Ce que vous repartez avec</p>
            <h2 className="h2">Une certification à afficher, pas un simple écran de fin.</h2>
            <p className="lead cert__lead">
              Au bout du parcours, vous recevez votre attestation et votre badge officiel BRVM
              Learning. C’est la preuve, datée et nominative, que vous savez analyser une entreprise
              et passer un ordre en toute autonomie.
            </p>

            <ul className="cert__list">
              {POINTS.map((point) => (
                <li key={point}>
                  <Check />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="cert__share">
              <Award />
              <span>
                Montrez-la à votre réseau : chaque partage explique en une image ce que vous venez
                d’apprendre.
              </span>
            </p>
          </div>

          <div data-reveal="right">
            <Mockup
              caption="Image — Certification de fin de parcours"
              hint="Attestation nominative + badge 💎, au format partageable sur les réseaux."
              tone="light"
              chrome={false}
              ratio="297 / 210"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
