const TERMS = [
  "Compte-titres",
  "SGI agréée",
  "Ordre d’achat",
  "Dividende",
  "Rendement",
  "Obligation",
  "OPCVM",
  "Capitalisation",
  "Diversification",
  "Bilan & résultat",
  "Prix d’entrée",
  "Plan d’investissement",
];

export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker__inner">
        <p className="ticker__label">
          Le jargon que vous maîtriserez <b>module après module</b>
        </p>
        <div className="ticker__track">
          <div className="ticker__run">
            {[0, 1].map((pass) => (
              <div className="ticker__run-group" key={pass} aria-hidden={pass === 1}>
                {TERMS.map((term) => (
                  <span className="ticker__item" key={`${pass}-${term}`}>
                    {term}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
