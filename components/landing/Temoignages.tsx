import Image from "next/image";

/**
 * Retours réels reçus par message. Deux seulement, et c'est
 * volontaire : la capture d'origine est affichée à côté de chaque extrait, ce
 * qu'un mur de faux avis ne peut pas faire. Le second retour garde sa réserve
 * (« un peu scientifique au milieu ») — c'est elle qui rend l'ensemble crédible.
 */
const AVIS = [
  {
    id: "beta-1",
    lead: "On arrive progressivement à comprendre énormément de choses sans avoir l’impression d’être noyé dans des termes techniques.",
    body: [
      "J’ai surtout apprécié le fait que le jargon reste simple, accessible et très terre-à-terre.",
      "Un truc qui m’a fait réaliser que la formation avait fonctionné pour moi : je comprends beaucoup mieux aujourd’hui le rôle du Cauri News. Avant, je pouvais voir passer ces informations sans forcément comprendre toute leur importance. Maintenant, je sais ce qu’il faut regarder et surtout pourquoi.",
      "J’ai eu du mal à trouver une « faille » ou un vrai point négatif.",
    ],
    who: "Partait de zéro sur la BRVM",
    shot: "/screenshots/avis-long.png",
    shotRatio: "934 / 760",
    shotAlt:
      "Capture du message reçu : le jargon reste simple et accessible, et aucun vrai point négatif n’a été trouvé.",
  },
  {
    id: "beta-2",
    lead: "Ça donne l’envie d’investir en bourse.",
    body: [
      "C’était captivant au début, un peu scientifique et technique au milieu — ça m’a pris du temps pour finir — et intéressant à la fin, car c’était un récap de tout le parcours.",
    ],
    who: "Parcours terminé",
    shot: "/screenshots/avis-court.png",
    shotRatio: "795 / 216",
    shotAlt:
      "Capture du message reçu : le parcours vient d’être terminé et donne envie d’investir en bourse.",
  },
];

export default function Temoignages() {
  return (
    <section className="section section--dark avis" id="avis">
      <div className="shell">
        <header className="avis__head" data-reveal>
          <h2 className="h2 avis__title">Ils ont terminé les 28 modules. Voici ce qu’ils en disent.</h2>
          <p className="avis__note">
            Extraits des messages reçus. La capture d’origine est affichée à côté de chaque retour —
            réserves comprises.
          </p>
        </header>

        {AVIS.map((avis, index) => (
          <article
            className={`avis__row${index % 2 === 1 ? " avis__row--flip" : ""}`}
            key={avis.id}
            data-reveal
          >
            <div className="avis__text">
              <blockquote className="avis__lead">{avis.lead}</blockquote>
              {avis.body.map((paragraph) => (
                <p className="avis__p" key={paragraph.slice(0, 32)}>
                  {paragraph}
                </p>
              ))}
              <p className="avis__who">{avis.who}</p>
            </div>

            <figure className="avis__proof">
              <span className="avis__shot" style={{ aspectRatio: avis.shotRatio }}>
                <Image
                  src={avis.shot}
                  alt={avis.shotAlt}
                  fill
                  sizes="(max-width: 900px) 92vw, 420px"
                  className="avis__img"
                />
              </span>
              <figcaption className="avis__cap">Le message d’origine</figcaption>
            </figure>
          </article>
        ))}
      </div>
    </section>
  );
}
