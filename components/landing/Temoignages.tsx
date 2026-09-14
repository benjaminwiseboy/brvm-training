import { delay } from "./style";

/**
 * Emplacements de témoignages. Remplacez `quote`, `name` et `role` par les
 * retours réellement recueillis — le reste du composant ne bouge pas.
 */
const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Emplacement du premier témoignage. Racontez en deux ou trois phrases d’où partait l’apprenant, ce qu’il a fait grâce au parcours, et ce qui a changé concrètement.",
    name: "Prénom N.",
    role: "Profession · Ville",
    initials: "??",
  },
  {
    id: "t2",
    quote:
      "Emplacement du deuxième témoignage. Les retours qui parlent le mieux sont ceux qui citent un fait précis : un compte-titres ouvert, une première analyse menée seul, un premier dividende reçu.",
    name: "Prénom N.",
    role: "Profession · Ville",
    initials: "??",
  },
  {
    id: "t3",
    quote:
      "Emplacement du troisième témoignage. Pensez à varier les profils : un actif sur place, un membre de la diaspora, un jeune qui débute avec une petite épargne.",
    name: "Prénom N.",
    role: "Profession · Ville",
    initials: "??",
  },
];

export default function Temoignages() {
  return (
    <section className="section section--dark tmoi" id="avis">
      <span className="glow tmoi__glow" />

      <div className="shell">
        <header className="head head--center" data-reveal>
          <p className="eyebrow">Ils ont suivi le parcours</p>
          <h2 className="h2">Ce que ça change, dit par ceux qui l’ont fait.</h2>
        </header>

        <div className="grid grid--3 tmoi__grid">
          {TESTIMONIALS.map((item, index) => (
            <figure
              className="tmoi__card"
              key={item.id}
              data-reveal
              style={delay(index * 110)}
            >
              <span className="tmoi__mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="tmoi__quote">{item.quote}</blockquote>
              <figcaption className="tmoi__who">
                <span className="tmoi__avatar" aria-hidden="true">
                  {item.initials}
                </span>
                <span>
                  <b>{item.name}</b>
                  <small>{item.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
