/** "Aujourd'hui" / "Hier" / "Il y a N jours" / date — pour les listes admin. */
export function relativeDate(iso: string | null): string {
  if (!iso) return "Jamais";
  const date = new Date(iso);
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(new Date()) - startOf(date)) / 86_400_000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays > 1 && diffDays < 30) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR");
}

export function money(n: number): string {
  const sign = n < 0 ? "-" : "";
  const digits = Math.abs(Math.round(n)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export type Currency = "FCFA" | "EUR" | "USD";
export const CURRENCIES: Currency[] = ["FCFA", "EUR", "USD"];

/** Prix payé, admin — même formatage groupé que `money()`, symbole/position selon la devise. */
export function formatCurrency(n: number, currency: Currency): string {
  const digits = money(n);
  switch (currency) {
    case "EUR":
      return `${digits} €`;
    case "USD":
      return `$${digits}`;
    default:
      return `${digits} FCFA`;
  }
}

export function splitMarkup(input: string): { bold: boolean; text: string }[] {
  const text = input.replace(/&nbsp;/g, " ");
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((seg) => seg.length > 0)
    .map((seg) =>
      seg.startsWith("**") && seg.endsWith("**")
        ? { bold: true, text: seg.slice(2, -2) }
        : { bold: false, text: seg },
    );
}

export function fvAnnuity(monthly: number, annualRatePct: number, years: number) {
  const i = annualRatePct / 100 / 12;
  const n = years * 12;
  const invested = monthly * n;
  const future = i === 0 ? invested : monthly * ((Math.pow(1 + i, n) - 1) / i);
  return { invested, future };
}

/**
 * Montant abrégé pour un axe de graphique — « 1,2 M », « 850 k ».
 * Porté de `fmtBig` dans brvm-tracker : sur un axe, « 1 250 000 » mange la
 * moitié de la largeur utile et ne se lit pas plus vite.
 */
export function moneyCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} M`;
  if (abs >= 1_000) return `${Math.round(n / 1_000)} k`;
  return money(n);
}
