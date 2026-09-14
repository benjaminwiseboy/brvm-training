import type { CSSProperties } from "react";
import { Frame } from "./Icons";

type Props = {
  /** Ce que la capture doit montrer, en une ligne. */
  caption: string;
  /** Précision facultative pour la personne qui remplacera le placeholder. */
  hint?: string;
  url?: string;
  tone?: "dark" | "light";
  device?: "desktop" | "phone";
  /** Ratio CSS de la zone image, ex. "16 / 10". */
  ratio?: string;
  /** Barre de navigateur factice — à masquer pour un document (certificat…). */
  chrome?: boolean;
  className?: string;
};

export default function Mockup({
  caption,
  hint,
  url = "brvmlearning.com/parcours",
  tone = "dark",
  device = "desktop",
  ratio,
  chrome = true,
  className = "",
}: Props) {
  const classes = [
    "mock",
    tone === "light" ? "mock--light" : "",
    device === "phone" ? "mock--phone" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {chrome ? (
        <div className="mock__chrome">
          <span className="mock__dot" />
          <span className="mock__dot" />
          <span className="mock__dot" />
          <span className="mock__url">{url}</span>
        </div>
      ) : null}
      <div className="mock__screen" style={ratio ? ({ "--ratio": ratio } as CSSProperties) : undefined}>
        <span className="mock__wire" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="mock__ph">
          <Frame />
        </span>
        <span className="mock__cap">{caption}</span>
        {hint ? <span className="mock__hint">{hint}</span> : null}
      </div>
    </div>
  );
}
