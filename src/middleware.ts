import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/sign-in"];
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/(Landing)") ||
    pathname.startsWith("/api/auth");

  // Si el usuario está logueado y trata de acceder a la página de login
  if (isAuthenticated && pathname.startsWith("/sign-in")) {
    const candidatesUrl = new URL("/candidates", req.url);
    return NextResponse.redirect(candidatesUrl);
  }

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si no está autenticado y está intentando acceder a una ruta protegida
  if (!isAuthenticated) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Usuario autenticado, permitir acceso
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: "nodejs",
};
