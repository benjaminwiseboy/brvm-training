import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isModulePublic } from "@/lib/access";

const ALWAYS_PUBLIC = [
  "/login",
  "/signup",
  "/reset-password",
  "/reset-password/update",
  "/auth/confirm",
  "/auth/auth-code-error",
];

/**
 * Garde "optimiste" (cookie de session uniquement, jamais de requête
 * DB — proxy.ts tourne sur chaque requête/prefetch). Les checks qui
 * ont besoin de la base (rôle admin, module bloqué pour CET
 * utilisateur) vivent dans les Server Components correspondants
 * (app/admin/layout.tsx, app/module/[code]/page.tsx).
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const moduleMatch = pathname.match(/^\/module\/([^/]+)/);
  const isPublicModule = moduleMatch ? isModulePublic(moduleMatch[1]) : false;
  const isPublicPath = ALWAYS_PUBLIC.includes(pathname) || isPublicModule;

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // `manifest.webmanifest`/`sw.js` exclus : requis pour l'installabilité PWA
  // (le navigateur doit pouvoir les récupérer sans redirection vers /login,
  // y compris pour un visiteur non connecté — cf. InstallPrompt).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
