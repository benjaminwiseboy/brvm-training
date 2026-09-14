import Btn from "./Btn";
import Mockup from "./Mockup";
import { Award, Clock, CreditCard, Play, Smartphone, TrendUp } from "./Icons";
import { START_HREF } from "./links";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <span className="glow hero__glow-a" />
      <span className="glow hero__glow-b" />
      <span className="mesh" />

      <div className="shell">
        <div className="hero__center">
          <p className="pill pill--dark hero__badge">
            <span className="pill__dot" />
            Accès libre : testez la plateforme gratuitement et sans engagement
          </p>

          <h1 className="hero__title">
            De zéro à <span className="word">investisseur autonome</span> à la BRVM.
          </h1>

          <p className="hero__sub">
            Pendant que le coût de la vie augmente chaque année, votre épargne stagne sur votre
            compte sans rien produire. Découvrez la première méthode interactive, pas à pas et
            100&nbsp;% pratique pour faire grandir votre argent sur les géants de la Bourse
            africaine, à votre rythme et sans aucun jargon financier.
          </p>

          <div className="btn-row hero__cta">
            <Btn href={START_HREF} variant="gold" size="lg">
              Démarrer gratuitement
            </Btn>
            <Btn href="#methode" variant="ghost" size="lg" icon={<Play />}>
              Découvrir notre méthode (1 min)
            </Btn>
          </div>

          <p className="hero__micro">
            <span>
              <Clock /> 5 min / jour à votre rythme
            </span>
            <span>
              <Smartphone /> Accessible sur Web &amp; Mobile
            </span>
            <span>
              <CreditCard /> 0 FCFA requis pour commencer
            </span>
          </p>
        </div>

        <div className="hero__stage" data-inview>
          <div className="hero__chip hero__chip--a">
            <span className="hero__chip-ico hero__chip-ico--gain">
              <TrendUp />
            </span>
            <div>
              <b>Module 4 en cours</b>
              <small>Analyse d’entreprise</small>
              <span className="hero__bar">
                <i />
              </span>
            </div>
          </div>

          <div className="hero__chip hero__chip--b">
            <span className="hero__chip-ico">
              <Award />
            </span>
            <div>
              <b>Phase 2 validée</b>
              <small>Compte-titres ouvert</small>
            </div>
          </div>

          <div className="hero__frame">
            <Mockup
              caption="Capture — Tableau de bord du parcours"
              hint="Progression par quiz, déblocage des modules et badges."
              ratio="16 / 9.4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
