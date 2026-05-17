import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher(["/account(.*)", "/checkout(.*)"]);
const isMaintenanceExempt = createRouteMatcher([
  "/admin(.*)",
  "/api/health",
  "/auth(.*)",
  "/maintenance",
]);

export default clerkMiddleware(async (auth, req) => {
  // ── Maintenance mode ────────────────────────────────────────────────────────
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  if (maintenanceMode && !isMaintenanceExempt(req)) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  const { userId, sessionClaims } = await auth();

  // ── Admin route protection ──────────────────────────────────────────────────
  if (isAdminRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Try session claims first (fast path — works when Clerk JWT template is configured)
    let role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

    // Fall back to Clerk API for guaranteed fresh metadata
    if (!role) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      role = user.publicMetadata?.role as string | undefined;
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ── Protected customer routes ───────────────────────────────────────────────
  if (isProtectedRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
