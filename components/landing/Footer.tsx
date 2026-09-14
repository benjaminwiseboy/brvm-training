import Link from "next/link";
import BrandMark from "./BrandMark";

const PARCOURS = [
  { href: "#opportunites", label: "Opportunités" },
  { href: "#methode", label: "Méthode" },
  { href: "#programme", label: "Programme" },
  { href: "#outils", label: "Outils" },
  { href: "#certification", label: "Certification" },
];

const LEGAL = [
  { href: "/login", label: "Se connecter" },
  { href: "#", label: "Mentions légales" },
  { href: "#", label: "Politique de confidentialité" },
  { href: "#", label: "Contact" },
  { href: "#faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div className="footer__col footer__col--brand">
            <a className="footer__brand" href="#top">
              <BrandMark />
              BRVM <em>Learning</em>
            </a>
            <p className="footer__pitch">
              La méthode interactive pour passer de zéro à investisseur autonome sur la Bourse
              Régionale des Valeurs Mobilières, 5 minutes par jour.
            </p>
          </div>

          <div className="footer__col">
            <p className="footer__ct">Le parcours</p>
            <nav className="footer__nav" aria-label="Le parcours">
              {PARCOURS.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer__col">
            <p className="footer__ct">Informations</p>
            <nav className="footer__nav" aria-label="Informations">
              {LEGAL.map((link) =>
                link.href.startsWith("/") ? (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>

        <p className="footer__risk">
          <b>Avertissement sur les risques. </b>
          L’investissement en Bourse comporte des risques de perte en capital. Les performances
          passées ne préjugent pas des performances futures. Renseignez-vous toujours avant
          d’investir.
        </p>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} BRVM Learning. Tous droits réservés.</span>
          <span>Abidjan · Dakar · Diaspora</span>
        </div>
      </div>
    </footer>
  );
}
