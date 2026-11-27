import { describe, expect, it } from "vitest";
import { AlertGate, escapeHtml, formatAlert, isClientNoise, isNextControlFlow, stripQuery } from "./format";

describe("escapeHtml", () => {
  it("échappe les trois entités exigées par Telegram", () => {
    expect(escapeHtml("<b>a & b</b>")).toBe("&lt;b&gt;a &amp; b&lt;/b&gt;");
  });
});

describe("stripQuery", () => {
  it("retire query string et fragment (jetons PKCE, next=)", () => {
    expect(stripQuery("/auth/confirm?code=secret&next=/")).toBe("/auth/confirm");
    expect(stripQuery("/module/m01#slide-3")).toBe("/module/m01");
    expect(stripQuery("/parcours")).toBe("/parcours");
  });
});

describe("formatAlert", () => {
  it("préfixe l'environnement, échappe le contenu et ignore les détails vides", () => {
    const text = formatAlert(
      { severity: "critical", title: "Panne <db>", details: { route: "/", vide: "", nul: null, n: 3 } },
      "production",
    );
    expect(text).toContain("🔴 <b>[PRODUCTION] Panne &lt;db&gt;</b>");
    expect(text).toContain("<b>route</b> : <code>/</code>");
    expect(text).toContain("<b>n</b> : <code>3</code>");
    expect(text).not.toContain("vide");
    expect(text).not.toContain("nul");
  });

  it("reste sous la limite de 4096 caractères de Telegram", () => {
    const details = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`k${i}`, "x".repeat(600)]));
    expect(formatAlert({ severity: "error", title: "t", details }, "preview").length).toBeLessThanOrEqual(3800);
  });
});

describe("AlertGate", () => {
  it("ne laisse passer qu'une fois la même empreinte dans la fenêtre", () => {
    const gate = new AlertGate(1000, 10);
    expect(gate.allow("a", 0)).toBe(true);
    expect(gate.allow("a", 500)).toBe(false);
    expect(gate.allow("a", 1500)).toBe(true);
  });

  it("plafonne le nombre total d'alertes par fenêtre", () => {
    const gate = new AlertGate(1000, 2);
    expect(gate.allow("a", 0)).toBe(true);
    expect(gate.allow("b", 1)).toBe(true);
    expect(gate.allow("c", 2)).toBe(false);
    expect(gate.allow("c", 1001)).toBe(true);
  });
});

describe("filtres de bruit", () => {
  it("reconnaît les erreurs de contrôle de flux de Next.js", () => {
    expect(isNextControlFlow("NEXT_REDIRECT;replace;/login;307;")).toBe(true);
    expect(isNextControlFlow("NEXT_HTTP_ERROR_FALLBACK;404")).toBe(true);
    expect(isNextControlFlow("1234567890")).toBe(false);
    expect(isNextControlFlow(undefined)).toBe(false);
  });

  it("ignore le bruit navigateur connu", () => {
    expect(isClientNoise("Script error.")).toBe(true);
    expect(isClientNoise("ResizeObserver loop completed with undelivered notifications.")).toBe(true);
    expect(isClientNoise("boom", "chrome-extension://abc/content.js")).toBe(true);
    expect(isClientNoise("Cannot read properties of undefined (reading 'slides')")).toBe(false);
  });
});
