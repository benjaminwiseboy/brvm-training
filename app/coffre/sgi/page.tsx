"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { FeesChart, FEE_SERIES_COLORS } from "@/components/coffre/FeesChart";
import { WhatsAppIcon } from "@/components/engine/WhatsAppIcon";
import { useProgress } from "@/lib/store";
import { money } from "@/lib/format";
import { ACCOMPAGNEMENT, ACCOMPAGNEMENT_HREF } from "@/lib/contact";
import { getResource, gateLabel, isResourceUnlocked } from "@/content/vault";
import {
  BRVM_SGI_LIST_URL,
  SGIS,
  countryName,
  richbourseUrl,
  sgiCountries,
  type Sgi,
} from "@/content/sgi";
import {
  atYear,
  hasFees,
  milestones,
  simulate,
  totalContributed,
  totalTransactionPct,
} from "@/lib/sgi";
import styles from "./page.module.css";

/** La palette du graphe plafonne aussi le nombre de courbes lisibles. */
const MAX_COMPARED = FEE_SERIES_COLORS.length;

const DEFAULT_SELECTION = ["MATHA Securities", "SGI BICI Bourse", "NSIA Finance"];

type SortKey = "name" | "minDeposit" | "courtagePct" | "custodyPctAnnual" | "rating";

const pct = (v: number) => `${v.toFixed(2).replace(".", ",")} %`;
const pctOrNc = (v: number | null) => (v == null ? "n.c." : pct(v));
const deposit = (v: number | null) => (v == null ? "n.c." : v === 0 ? "Aucun" : `${money(v)} F`);
const tenue = (s: Sgi) =>
  s.tenueAnnual === null ? "n.c." : s.tenueAnnual === 0 ? "Gratuit" : `${money(s.tenueAnnual)} F`;
const onlineLabel = (o: Sgi["online"]) => (o === "oui" ? "✅" : o === "non" ? "❌" : "—");
/**
 * Un `mobileMoney` absent est un TROU DE SOURCE, pas un refus de la SGI :
 * seules 11 SGI sur 40 disent quoi que ce soit sur la question. D'où le repli
 * sur « nc » (le tiret) plutôt que sur « non » — l'inverse ferait écarter une
 * SGI pour une lacune documentaire, ce que ce comparateur s'interdit.
 */
const mobileMoneyLabel = (s: Sgi) => onlineLabel(s.mobileMoney ?? "nc");
const stars = (r?: number) => (r == null ? "—" : `★ ${r.toFixed(1).replace(".", ",")}`);

/**
 * `/coffre/sgi` — comparateur des SGI et simulateur de frais.
 *
 * Les données et le moteur viennent du projet frère `brvm-tracker`
 * (cf. `content/sgi.ts` et `lib/sgi.ts`) ; ce qui est refait ici, c'est
 * l'interface, pour deux raisons. Le tracker s'appuie sur Recharts, absent
 * de ce projet — le graphe passe donc par `TrendChart`, le SVG maison déjà
 * utilisé dans les cours, ce qui évite d'ajouter une dépendance pour un seul
 * écran. Et sa charte est sombre, quand celle-ci est claire.
 *
 * L'outil répond au manque n°1 de l'audit et au tout premier jour de la
 * check-list : « choisir sa SGI ». Il ne recommande personne — il classe sur
 * des chiffres et renvoie à la grille tarifaire officielle, seule opposable.
 */
export default function SgiPage() {
  const { state, hydrated } = useProgress();
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_SELECTION));
  const [sortKey, setSortKey] = useState<SortKey>("courtagePct");
  const [asc, setAsc] = useState(true);
  const [country, setCountry] = useState("all");

  // Paramètres du simulateur — valeurs de départ alignées sur le DCA du cours.
  const [initial, setInitial] = useState(100_000);
  const [monthly, setMonthly] = useState(25_000);
  const [ret, setRet] = useState(5);
  const [years, setYears] = useState(10);

  const resource = getResource("comparateur-sgi")!;
  const unlocked = hydrated && isResourceUnlocked(resource, state.completed);

  const countries = useMemo(() => sgiCountries(), []);

  const sorted = useMemo(() => {
    const rows = SGIS.filter((s) => country === "all" || s.country === country);
    return [...rows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      // « Non communiqué » tombe toujours en fin de liste, quel que soit le
      // sens du tri : une absence de donnée n'est pas une bonne valeur.
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "fr");
      return asc ? cmp : -cmp;
    });
  }, [sortKey, asc, country]);

  const selectedSgis = useMemo(() => SGIS.filter((s) => selected.has(s.name)), [selected]);
  const simulated = useMemo(() => selectedSgis.filter(hasFees), [selectedSgis]);
  const excluded = selectedSgis.length - simulated.length;

  const params = useMemo(
    () => ({ initial, monthly, annualReturnPct: ret, years }),
    [initial, monthly, ret, years]
  );
  const sims = useMemo(
    () => simulated.map((s) => ({ sgi: s, points: simulate(s, params) })),
    [simulated, params]
  );

  const marks = useMemo(() => milestones(years), [years]);
  const contributed = totalContributed(params);

  /**
   * Une année par point, et seules les années repères portent une étiquette
   * (`ticks`) : l'axe reste un vrai axe de temps — sans quoi 1, 3, 5 et 10 ans
   * répartis à intervalles égaux étireraient le premier tiers de la courbe et
   * écraseraient le reste, montrant l'inverse de ce qu'on veut donner à voir,
   * à savoir que les frais accélèrent avec la durée.
   */
  const chartSeries = useMemo(
    () =>
      sims.slice(0, MAX_COMPARED).map((s) => ({
        name: s.sgi.name,
        points: Array.from({ length: years }, (_, i) => ({
          year: i + 1,
          fees: Math.round(atYear(s.points, i + 1)?.cumFees ?? 0),
        })),
      })),
    [sims, years]
  );

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else if (next.size < MAX_COMPARED) next.add(name);
      return next;
    });
  }

  function setSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  const arrow = (key: SortKey) => (key === sortKey ? (asc ? " ▲" : " ▼") : "");
  const full = selected.size >= MAX_COMPARED;

  // La meilleure valeur de la sélection, pour la souligner en vert.
  const best = useMemo(() => {
    const lowest = (values: (number | null)[]) => {
      const numbers = values.filter((v): v is number => v != null);
      return numbers.length ? Math.min(...numbers) : null;
    };
    const highest = (values: (number | null | undefined)[]) => {
      const numbers = values.filter((v): v is number => v != null);
      return numbers.length ? Math.max(...numbers) : null;
    };
    return {
      courtagePct: lowest(selectedSgis.map((s) => s.courtagePct)),
      custodyPctAnnual: lowest(selectedSgis.map((s) => s.custodyPctAnnual)),
      minDeposit: lowest(selectedSgis.map((s) => s.minDeposit)),
      rating: highest(selectedSgis.map((s) => s.rating)),
    };
  }, [selectedSgis]);

  if (!hydrated) return null;

  if (!unlocked) {
    return (
      <AppShell variant="dash">
        <Link href="/coffre" className={styles.back}>
          ← Le Coffre-fort
        </Link>
        <div className={styles.locked}>
          <span className={styles.lockedIc} aria-hidden="true">
            🔒
          </span>
          <h1 className={styles.h1}>Comparateur de SGI</h1>
          <p className={styles.lockedText}>
            Il s&rsquo;ouvre à la fin de la {gateLabel(resource.gate)}, quand vous entrez dans
            « Passage à l&rsquo;action » : les {SGIS.length} courtiers agréés de la BRVM, leurs
            frais réels, et ce qu&rsquo;ils vous coûtent sur dix ans.
          </p>
          <Link href="/parcours" className={styles.lockedBtn}>
            Reprendre le parcours →
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell variant="dash">
      <Link href="/coffre" className={styles.back}>
        ← Le Coffre-fort
      </Link>

      <header className={styles.head}>
        <p className={styles.eyebrow}>Coffre-fort</p>
        <h1 className={styles.h1}>Comparateur de SGI</h1>
        <p className={styles.lead}>
          Les {SGIS.length} courtiers agréés de la BRVM, leurs frais, et surtout ce que ces frais
          vous coûteront vraiment sur la durée. Aucune SGI n&rsquo;est recommandée ici.
        </p>
      </header>

      {/* --- Ce que tout le monde facture --- */}
      <section className={styles.card}>
        <h2 className={styles.h2}>D&rsquo;abord : la part que TOUTES facturent</h2>
        <p className={styles.text}>
          À chaque achat ou vente, une commission part à la Bourse et au dépositaire, quel que soit
          votre courtier :
        </p>
        <div className={styles.pills}>
          <div className={styles.pill}>
            <strong>0,2 %</strong>
            <span>Commission BRVM</span>
          </div>
          <div className={styles.pill}>
            <strong>0,1 %</strong>
            <span>Dépositaire (DC/BR)</span>
          </div>
          <div className={`${styles.pill} ${styles.pillSum}`}>
            <strong>= 0,3 %</strong>
            <span>par transaction, incompressible</span>
          </div>
        </div>
        <p className={styles.note}>
          C&rsquo;est au-dessus que les SGI se distinguent : le <strong>courtage</strong> (leur
          commission), les <strong>droits de garde</strong> (coût annuel de détention) et la{" "}
          <strong>tenue de compte</strong>.
        </p>
      </section>

      {/* --- Le tableau --- */}
      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.h2}>Les {SGIS.length} SGI</h2>
          <span className={styles.counter}>
            {selected.size} / {MAX_COMPARED} sélectionnées
          </span>
        </div>
        <p className={styles.note}>
          Cochez celles à comparer, touchez un en-tête pour trier. Les droits de garde sont ramenés
          à l&rsquo;année pour être comparables ; « n.c. » = non communiqué.
        </p>

        <label className={styles.filter}>
          <span>Pays</span>
          <select
            className={styles.select}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="all">Tous les pays ({SGIS.length})</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </label>

        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th aria-label="Sélection" />
                <th className={styles.sortable} onClick={() => setSort("name")}>
                  SGI{arrow("name")}
                </th>
                <th className={`${styles.num} ${styles.sortable}`} onClick={() => setSort("minDeposit")}>
                  Dépôt min.{arrow("minDeposit")}
                </th>
                <th className={`${styles.num} ${styles.sortable}`} onClick={() => setSort("courtagePct")}>
                  Courtage{arrow("courtagePct")}
                </th>
                <th
                  className={`${styles.num} ${styles.sortable}`}
                  onClick={() => setSort("custodyPctAnnual")}
                >
                  Garde/an{arrow("custodyPctAnnual")}
                </th>
                <th className={styles.num}>Tenue/an</th>
                <th>En ligne</th>
                <th>Mobile money</th>
                <th className={`${styles.num} ${styles.sortable}`} onClick={() => setSort("rating")}>
                  Note{arrow("rating")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => {
                const on = selected.has(s.name);
                const url = richbourseUrl(s.name);
                return (
                  <tr
                    key={s.name}
                    className={`${on ? styles.rowOn : ""} ${!on && full ? styles.rowFull : ""}`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={!on && full}
                        onChange={() => toggle(s.name)}
                        aria-label={`Comparer ${s.name}`}
                      />
                    </td>
                    <td>
                      <span className={styles.name}>{s.name}</span>
                      <span className={styles.sub}>
                        {countryName(s.country)}
                        {url && (
                          <>
                            {" · "}
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              tarifs officiels ↗
                            </a>
                          </>
                        )}
                      </span>
                    </td>
                    <td className={styles.num}>{deposit(s.minDeposit)}</td>
                    <td className={styles.num} title={s.courtageRaw}>
                      {pctOrNc(s.courtagePct)}
                      {s.courtageRaw && <span className={styles.star}> *</span>}
                    </td>
                    <td className={styles.num} title={s.custodyRaw}>
                      {pctOrNc(s.custodyPctAnnual)}
                      {s.custodyRaw && <span className={styles.star}> *</span>}
                    </td>
                    <td className={styles.num} title={s.tenueRaw}>
                      {tenue(s)}
                      {s.tenueRaw && <span className={styles.star}> *</span>}
                    </td>
                    <td>{onlineLabel(s.online)}</td>
                    <td title={s.fundingRaw}>
                      {mobileMoneyLabel(s)}
                      {s.fundingRaw && <span className={styles.star}> *</span>}
                    </td>
                    <td className={`${styles.num} ${styles.rating}`}>{stars(s.rating)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={styles.footnote}>
          * la valeur d&rsquo;origine est une fourchette (on retient la borne haute) ou un montant
          trimestriel (annualisé ici) — survolez la case pour la voir. En colonne mobile money,
          l&rsquo;étoile renvoie au détail : opérateurs acceptés, ou moyens de dépôt à défaut.
          {" "}
          <strong>Un tiret ne veut pas dire « non »</strong> : seules 11 SGI publient leurs moyens
          d&rsquo;approvisionnement. Le virement, le chèque et le versement en agence, eux,
          fonctionnent partout — demandez le mobile money à la SGI avant de la choisir pour ça.
          {full && " Décochez une SGI pour en comparer une autre."}
        </p>
      </section>

      {/* --- Simulateur --- */}
      <section className={styles.card}>
        <h2 className={styles.h2}>💸 Ce que les frais vous coûtent vraiment</h2>
        <p className={styles.note}>
          Renseignez votre projet : on calcule les frais cumulés (courtage + commission de marché +
          droits de garde + tenue) que chaque SGI vous prélèverait. Hypothèse : des achats
          réguliers, sans revente.
        </p>

        <div className={styles.fields}>
          <Field label="Investissement de départ" suffix="FCFA" value={initial} step={50_000} onChange={setInitial} />
          <Field label="Apport mensuel" suffix="FCFA" value={monthly} step={5_000} onChange={setMonthly} />
          <Field label="Rendement annuel espéré" suffix="%" value={ret} step={1} onChange={setRet} />
          <Field
            label="Horizon"
            suffix="ans"
            value={years}
            step={1}
            onChange={(v) => setYears(Math.max(1, Math.min(40, v)))}
          />
        </div>

        {sims.length === 0 ? (
          <p className={styles.empty}>
            Cochez au moins une SGI dont les frais sont publiés pour lancer la simulation.
          </p>
        ) : (
          <>
            <p className={styles.total}>
              Total versé sur {years} an{years > 1 ? "s" : ""} : <strong>{money(contributed)} FCFA</strong>{" "}
              (hors frais).
              {excluded > 0 && (
                <>
                  {" "}
                  {excluded} SGI sélectionnée{excluded > 1 ? "s" : ""} sans frais publiés,{" "}
                  {excluded > 1 ? "exclues" : "exclue"} du calcul.
                </>
              )}
            </p>

            <FeesChart series={chartSeries} years={years} ticks={marks} />

            <div className={styles.scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>SGI</th>
                    {marks.map((y) => (
                      <th key={y} className={styles.num}>
                        À {y} an{y > 1 ? "s" : ""}
                      </th>
                    ))}
                    <th className={styles.num}>% des versements</th>
                  </tr>
                </thead>
                <tbody>
                  {sims.map(({ sgi, points }) => {
                    const final = atYear(points, years);
                    const ratio = final && contributed ? (final.cumFees / contributed) * 100 : 0;
                    return (
                      <tr key={sgi.name}>
                        <td>
                          <span className={styles.name}>{sgi.name}</span>
                        </td>
                        {marks.map((y) => (
                          <td key={y} className={styles.num}>
                            {money(Math.round(atYear(points, y)?.cumFees ?? 0))}
                          </td>
                        ))}
                        <td className={`${styles.num} ${styles.ratio}`}>
                          {ratio.toFixed(1).replace(".", ",")} %
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={styles.footnote}>
              💡 Sur la durée, 0,3 % d&rsquo;écart de frais finit par représenter beaucoup
              d&rsquo;argent — c&rsquo;est le même effet du temps que les intérêts composés, mais
              contre vous.
            </p>
          </>
        )}
      </section>

      {/* --- Comparaison détaillée --- */}
      {selectedSgis.length > 0 && (
        <section className={styles.card}>
          <h2 className={styles.h2}>Fiche à fiche</h2>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Critère</th>
                  {selectedSgis.map((s) => (
                    <th key={s.name}>{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Pays</th>
                  {selectedSgis.map((s) => (
                    <td key={s.name}>{countryName(s.country)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Dépôt minimum</th>
                  {selectedSgis.map((s) => (
                    <td
                      key={s.name}
                      className={s.minDeposit != null && s.minDeposit === best.minDeposit ? styles.best : ""}
                    >
                      {deposit(s.minDeposit)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Courtage / transaction</th>
                  {selectedSgis.map((s) => (
                    <td
                      key={s.name}
                      title={s.courtageRaw}
                      className={s.courtagePct != null && s.courtagePct === best.courtagePct ? styles.best : ""}
                    >
                      {pctOrNc(s.courtagePct)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Coût total / transaction</th>
                  {selectedSgis.map((s) => {
                    const t = totalTransactionPct(s);
                    return <td key={s.name}>{t == null ? "n.c." : pct(t)}</td>;
                  })}
                </tr>
                <tr>
                  <th scope="row">Droits de garde / an</th>
                  {selectedSgis.map((s) => (
                    <td
                      key={s.name}
                      title={s.custodyRaw}
                      className={
                        s.custodyPctAnnual != null && s.custodyPctAnnual === best.custodyPctAnnual
                          ? styles.best
                          : ""
                      }
                    >
                      {pctOrNc(s.custodyPctAnnual)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Tenue de compte / an</th>
                  {selectedSgis.map((s) => (
                    <td key={s.name} title={s.tenueRaw}>
                      {tenue(s)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Plateforme en ligne</th>
                  {selectedSgis.map((s) => (
                    <td key={s.name}>{onlineLabel(s.online)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Dépôt par mobile money</th>
                  {selectedSgis.map((s) => (
                    <td key={s.name} title={s.fundingRaw}>
                      {mobileMoneyLabel(s)}
                      {s.fundingRaw && <span className={styles.sub}> {s.fundingRaw}</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Note des avis</th>
                  {selectedSgis.map((s) => (
                    <td
                      key={s.name}
                      className={`${styles.rating} ${s.rating != null && s.rating === best.rating ? styles.best : ""}`}
                    >
                      {stars(s.rating)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Téléphone</th>
                  {selectedSgis.map((s) => (
                    <td key={s.name}>
                      {s.phone ? <a href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}>{s.phone}</a> : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Site officiel</th>
                  {selectedSgis.map((s) => (
                    <td key={s.name}>
                      {s.website ? (
                        <a href={`https://${s.website}`} target="_blank" rel="noopener noreferrer">
                          {s.website} ↗
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Grille tarifaire officielle</th>
                  {selectedSgis.map((s) => {
                    const url = richbourseUrl(s.name);
                    return (
                      <td key={s.name}>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            PDF officiel ↗
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className={styles.help}>
        <span className={styles.helpIc} aria-hidden="true">
          🤝
        </span>
        <div className={styles.helpBody}>
          <strong>{ACCOMPAGNEMENT.title}</strong>
          <p>
            Choix de la SGI selon votre budget, rédaction de votre e-mail, relecture du dossier.{" "}
            {ACCOMPAGNEMENT.note}
          </p>
        </div>
        <a className={styles.helpBtn} href={ACCOMPAGNEMENT_HREF} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon className={styles.helpIcon} /> {ACCOMPAGNEMENT.cta}
        </a>
      </section>

      <p className={styles.warn}>
        ⚠️ <strong>À vérifier avant d&rsquo;ouvrir un compte.</strong> Ces frais viennent de
        comparateurs publics (PlayInvest pour la Côte d&rsquo;Ivoire, Sikafinance ailleurs) et sont
        parfois simplifiés. Seule la <strong>grille tarifaire officielle</strong> de la SGI fait
        foi — demandez-la, c&rsquo;est d&rsquo;ailleurs l&rsquo;objet de l&rsquo;e-mail du jour 1.
        La liste complète et à jour des courtiers agréés est publiée par la Bourse :{" "}
        <a href={BRVM_SGI_LIST_URL} target="_blank" rel="noopener noreferrer">
          BRVM — Courtiers (SGI) ↗
        </a>
        .
      </p>
    </AppShell>
  );
}

function Field({
  label,
  suffix,
  value,
  step,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldInput}>
        <input
          type="number"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className={styles.suffix}>{suffix}</span>
      </span>
    </label>
  );
}
