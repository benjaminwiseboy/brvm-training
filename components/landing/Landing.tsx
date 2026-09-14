import Certification from "./Certification";
import CtaFinal from "./CtaFinal";
import Faq from "./Faq";
import Footer from "./Footer";
import Freins from "./Freins";
import Hero from "./Hero";
import Inclus from "./Inclus";
import Nav from "./Nav";
import Opportunites from "./Opportunites";
import Outils from "./Outils";
import PourQui from "./PourQui";
import Programme from "./Programme";
import SiteEffects from "./SiteEffects";
import Solution from "./Solution";
import Temoignages from "./Temoignages";
import Ticker from "./Ticker";
import "../../app/landing.css";

// Les polices ne sont plus chargées ici : tout le produit tourne sur la même
// typographie (Poppins/Nunito/JetBrains Mono — lib/fonts.ts, posée sur <html>
// par app/layout.tsx). `--font-display`/`--font-body`/`--font-mono` sont
// donc hérités.

export function Landing() {
  return (
    <div className="lp">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Opportunites />
        <Freins />
        <Solution />
        <Programme />
        <Outils />
        <Certification />
        <Temoignages />
        <PourQui />
        <Inclus />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <SiteEffects />
    </div>
  );
}
