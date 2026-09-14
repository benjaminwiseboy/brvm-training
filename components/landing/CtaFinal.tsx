import Btn from "./Btn";
import { Play } from "./Icons";
import { START_HREF } from "./links";

export default function CtaFinal() {
  return (
    <section className="section final">
      <span className="mesh" />
      <div className="shell">
        <div data-reveal>
          <h2 className="final__title">
            Ne laissez plus votre argent perdre sa valeur sans rien faire.
          </h2>
          <p className="final__sub">
            Rejoignez la plateforme aujourd’hui et passez de débutant à investisseur autonome sur la
            Bourse africaine.
          </p>
          <div className="btn-row final__cta">
            <Btn href={START_HREF} variant="gold" size="lg">
              Démarrer gratuitement
            </Btn>
            <Btn href="#methode" variant="ghost" size="lg" icon={<Play />}>
              Revoir la méthode
            </Btn>
          </div>
          <p className="final__micro">Sans carte bancaire · 4 premiers modules offerts · Accès à vie</p>
        </div>
      </div>
    </section>
  );
}
