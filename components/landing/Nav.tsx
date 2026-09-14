"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Btn from "./Btn";
import BrandMark from "./BrandMark";
import { LOGIN_HREF, START_HREF } from "./links";

const LINKS = [
  { href: "#opportunites", label: "Opportunités" },
  { href: "#methode", label: "Méthode" },
  { href: "#programme", label: "Programme" },
  { href: "#outils", label: "Outils" },
  { href: "#avis", label: "Avis" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const classes = ["nav", stuck ? "is-stuck" : "", open ? "is-open" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      <div className="shell">
        <div className="nav__bar">
          <a className="nav__brand" href="#top">
            <BrandMark />
            BRVM <em>Learning</em>
          </a>

          <nav className="nav__links" aria-label="Sections de la page">
            {LINKS.map((link) => (
              <a key={link.href} className="nav__link" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <Link className="nav__login" href={LOGIN_HREF}>
            Se connecter
          </Link>

          <Btn href={START_HREF} variant="gold" className="nav__cta">
            Démarrer gratuitement
          </Btn>

          <button
            type="button"
            className="nav__burger"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="nav__panel">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link href={LOGIN_HREF} onClick={() => setOpen(false)}>
            Se connecter
          </Link>
          <Btn href={START_HREF} variant="gold">
            Démarrer gratuitement
          </Btn>
        </div>
      </div>
    </header>
  );
}
