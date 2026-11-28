import type { NextConfig } from "next";

/**
 * En-têtes de sécurité appliqués à toutes les réponses (audit 2026-11,
 * docs/SECURITY-AUDIT.md).
 *
 * CSP volontairement PARTIELLE : seules les directives qui ne touchent pas
 * aux scripts (Next.js injecte des scripts inline d'hydratation ; une
 * `script-src` stricte demande des nonces — chantier suivi dans la roadmap).
 * `frame-ancestors 'none'` interdit l'intégration de l'app dans une iframe
 * (clickjacking sur l'admin et les formulaires de compte).
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["broadly-judo-freedom.ngrok-free.dev"],
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
