import { afterEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/observability/alert", () => ({ sendAlert: vi.fn() }));

const { isAuthorizedCron } = await import("./cron");

function req(authorization?: string): NextRequest {
  return { headers: new Headers(authorization ? { authorization } : {}) } as unknown as NextRequest;
}

describe("isAuthorizedCron", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepte le bon secret", () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    expect(isAuthorizedCron(req("Bearer s3cret"))).toBe(true);
  });

  it("refuse un mauvais secret ou l'absence d'en-tête", () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    expect(isAuthorizedCron(req("Bearer nope"))).toBe(false);
    expect(isAuthorizedCron(req())).toBe(false);
  });

  it("échoue FERMÉ quand CRON_SECRET n'est pas configuré", () => {
    vi.stubEnv("CRON_SECRET", "");
    expect(isAuthorizedCron(req("Bearer undefined"))).toBe(false);
    expect(isAuthorizedCron(req("Bearer "))).toBe(false);
  });
});
