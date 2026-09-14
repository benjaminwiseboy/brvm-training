"use client";

import { useState } from "react";
import { delay } from "./style";

const QUESTIONS = [
  {
    q: "Faut-il être bon en maths ou s’y connaître en finance ?",
    a: "Pas du tout. Tout est expliqué en langage simple, avec des exemples clairs et des quiz faciles pour apprendre sans se prendre la tête.",
  },
  {
    q: "Puis-je suivre la formation depuis la diaspora (France, Canada, USA…) ?",
    a: "Oui. La plateforme est accessible 24h/24 et 7j/7 depuis votre téléphone ou votre ordinateur, et le parcours traite le cas de la diaspora — notamment l’ouverture d’un compte-titres à distance.",
  },
  {
    q: "Puis-je vraiment tester sans payer ni entrer de carte bancaire ?",
    a: "Absolument. Les 4 modules de la phase 1 sont accessibles immédiatement dès la création de votre compte, sans aucune carte bancaire demandée. Même si vous vous arrêtez là, vous en ressortez en sachant ce qu’est la BRVM, comment on y gagne de l’argent — dividende et plus-value — et quelles règles de sécurité respecter avant d’investir.",
  },
  {
    q: "Comment se débloque l’accès complet ?",
    a: "Les 4 modules de la phase 1 sont offerts. La suite se débloque en une fois, sans abonnement, à un tarif pensé pour rester accessible — y compris à un étudiant. Nous vous le présentons à la fin de la phase 1, quand vous aurez une idée précise de ce que vaut le parcours plutôt qu’un chiffre à juger avant d’avoir rien vu.",
  },
  {
    q: "Combien de temps faut-il pour terminer le parcours ?",
    a: "Chaque module se boucle en quelques minutes. À 5 minutes par jour vous avancez d’une leçon à la fois ; en y consacrant un quart d’heure, vous terminez en quelques semaines. Rien ne vous presse : vous avancez à votre rythme.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section faq" id="faq">
      <div className="shell shell--tight">
        <header className="head head--center" data-reveal>
          <h2 className="h2">Ce que l’on nous demande le plus souvent.</h2>
        </header>

        <div className="faq__list">
          {QUESTIONS.map((item, index) => {
            const isOpen = open === index;
            return (
              // La révélation est portée par ce conteneur, dont la classe ne
              // change jamais : si `data-reveal` était sur l'élément re-rendu,
              // React écraserait à chaque clic la classe `is-in` posée par
              // l'observateur et la carte disparaîtrait.
              <div className="faq__row" key={item.q} data-reveal="fade" style={delay(index * 70)}>
                <div className={`faq__item${isOpen ? " is-open" : ""}`}>
                  <h3 className="faq__head">
                    <button
                      type="button"
                      className="faq__q"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-button-${index}`}
                      onClick={() => setOpen(isOpen ? null : index)}
                    >
                      {item.q}
                      <span className="faq__sign" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    className="faq__body"
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                  >
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
