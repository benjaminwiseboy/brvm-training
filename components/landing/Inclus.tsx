import Btn from "./Btn";
import { Check, Play } from "./Icons";
import { START_HREF } from "./links";

const INCLUDED = [
  "L’intégralité du parcours : 28 modules répartis en 5 phases",
  "Exercices pratiques & quiz d’ancrage à chaque leçon",
  "Diagnostic automatique de profil & plan d’investissement",
  "Comparateur neutre de SGI (analyse des frais & services)",
  "Glossaire interactif et checklist de l’investisseur",
  "Application installable sur mobile, avec rappels pour tenir votre série",
  "Attestation & badge de certification officielle",
  "Mises à jour futures de la plateforme incluses",
];

export default function Inclus() {
  return (
    <section className="section incl" id="inclus">
      <div className="shell">
        <header className="head head--center" data-reveal>
          <h2 className="h2">Testez gratuitement, décidez ensuite.</h2>
          <p className="lead">
            Les 4 premiers modules sont offerts, sans carte bancaire. Vous jugez la méthode sur
            pièces avant de débloquer la suite.
          </p>
        </header>

        <div className="incl__card" data-reveal="zoom">
          <div className="incl__left">
            <p className="incl__name">Ce que contient le parcours complet</p>
            <ul className="incl__list">
              {INCLUDED.map((item) => (
                <li key={item}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="incl__right">
            <p className="incl__free">Phase 1 offerte</p>
            <p className="incl__lead">
              Créez votre compte et faites les 4 premiers modules : vous comprendrez ce qu’est
              réellement la BRVM, comment on y gagne de l’argent et les règles à respecter avant
              d’y placer le moindre franc. Aucun paiement n’est demandé pour commencer.
            </p>

            <div className="incl__actions">
              <Btn href={START_HREF} variant="gold" size="lg">
                Démarrer gratuitement
              </Btn>
              <Btn href="#methode" variant="ghost" icon={<Play />}>
                Revoir la méthode
              </Btn>
            </div>

            <p className="incl__note">
              L’accès complet se débloque en une fois, sans abonnement, à un tarif pensé pour rester
              <b> accessible</b>. Nous vous le présentons à la fin de la phase 1, quand vous saurez
              exactement ce que vaut le parcours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
