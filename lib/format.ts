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
