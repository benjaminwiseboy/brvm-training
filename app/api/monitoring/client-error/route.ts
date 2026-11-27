import { NextResponse, type NextRequest } from "next/server";
import { sendAlert } from "@/lib/observability/alert";
import { isClientNoise, stripQuery, truncate } from "@/lib/observability/format";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024;

/**
 * Reçoit les erreurs JavaScript du navigateur (lib/observability/client.ts).
 *
 * Route publique : un visiteur de la landing peut planter aussi. D'où les
 * garde-fous — taille bornée, champs tronqués, bruit filtré, et l'AlertGate
 * de sendAlert (dédoublonnage + plafond par fenêtre) contre l'inondation.
 * Répond toujours 204 : rien à apprendre pour un appelant malveillant.
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();
  if (raw.length > MAX_BYTES) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const message = truncate(String(body.message ?? ""), 400);
  const source = typeof body.source === "string" ? body.source : undefined;
  if (!message || isClientNoise(message, source)) return new NextResponse(null, { status: 204 });

  const path = stripQuery(truncate(String(body.path ?? "?"), 200));
  await sendAlert({
    severity: "error",
    title: `Erreur navigateur sur ${path}`,
    details: {
      message,
      kind: truncate(String(body.kind ?? "error"), 40),
      source: source ? stripQuery(truncate(source, 200)) : undefined,
      stack: typeof body.stack === "string" ? truncate(body.stack, 500) : undefined,
      userAgent: truncate(request.headers.get("user-agent") ?? "", 160),
    },
    fingerprint: `client:${path}:${message.slice(0, 120)}`,
  });

  return new NextResponse(null, { status: 204 });
}
