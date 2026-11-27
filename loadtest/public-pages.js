// Scénario 1 — visiteurs anonymes : landing → inscription/connexion.
// C'est le trafic d'une campagne d'acquisition (pub, post viral).
//
//   k6 run -e BASE_URL=https://<url-dev> -e PROFILE=load loadtest/public-pages.js
import http from "k6/http";
import { check, group, sleep } from "k6";
import { assertNotProduction, bypassHeaders, profile } from "./lib.js";

const BASE_URL = assertNotProduction(__ENV.BASE_URL);

export const options = {
  ...profile(),
  thresholds: {
    http_req_failed: ["rate<0.01"], // < 1 % d'erreurs
    "http_req_duration{page:landing}": ["p(95)<1200"],
    "http_req_duration{page:auth}": ["p(95)<1000"],
    "http_req_duration{page:health}": ["p(95)<800"],
    checks: ["rate>0.99"],
  },
};

const params = (page) => ({ headers: bypassHeaders(), tags: { page }, redirects: 0 });

export default function visitor() {
  group("landing", () => {
    const res = http.get(`${BASE_URL}/`, params("landing"));
    check(res, { "landing 200": (r) => r.status === 200 });
    sleep(Math.random() * 3 + 2); // lecture de la page
  });

  group("auth", () => {
    const page = Math.random() < 0.6 ? "/signup" : "/login";
    const res = http.get(`${BASE_URL}${page}`, params("auth"));
    check(res, { [`${page} 200`]: (r) => r.status === 200 });
    sleep(Math.random() * 2 + 1);
  });

  group("health", () => {
    const res = http.get(`${BASE_URL}/api/health`, params("health"));
    check(res, { "health ok": (r) => r.status === 200 && r.json("status") === "ok" });
  });
}
