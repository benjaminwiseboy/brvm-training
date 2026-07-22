export function money(n: number): string {
  const sign = n < 0 ? "-" : "";
  const digits = Math.abs(Math.round(n)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function splitMarkup(input: string): { bold: boolean; text: string }[] {
  const text = input.replace(/&nbsp;/g, " ");
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
