"use client";

import { useEffect } from "react";

/**
 * Un seul point d'entrée pour les effets liés au défilement :
 * révélations, progression du rail du parcours, lien de navigation actif.
 */
export default function SiteEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal],[data-inview]")
    );

    let revealObserver: IntersectionObserver | null = null;

    if (reduce || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-in"));
    } else {
      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
      );
      targets.forEach((el) => revealObserver!.observe(el));
    }

    // Lien de navigation actif
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav__link"));
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.getAttribute("href") || ""))
      .filter((el): el is HTMLElement => Boolean(el));

    const navObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((link) =>
                  link.classList.toggle(
                    "is-active",
                    link.getAttribute("href") === `#${entry.target.id}`
                  )
                );
              });
            },
            { rootMargin: "-45% 0px -50% 0px" }
          );

    sections.forEach((section) => navObserver?.observe(section));

    // Progression du rail « parcours »
    const steps = document.querySelector<HTMLElement>(".steps");
    const fill = document.querySelector<HTMLElement>(".steps__fill");
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (!steps || !fill) return;
      const box = steps.getBoundingClientRect();
      const anchor = window.innerHeight * 0.62;
      const ratio = (anchor - box.top) / Math.max(box.height * 0.8, 1);
      const clamped = Math.min(Math.max(ratio, 0), 1);
      fill.style.setProperty("--p", clamped.toFixed(3));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    if (!reduce && steps && fill) {
      paint();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    } else if (fill) {
      fill.style.setProperty("--p", "1");
    }

    return () => {
      revealObserver?.disconnect();
      navObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
