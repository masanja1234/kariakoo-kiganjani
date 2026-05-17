import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};
  let healthy = true;

  // Check database connectivity
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
    healthy = false;
  }

  // Check required environment variables (existence only — never expose values)
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
  if (missingEnvVars.length > 0) {
    checks.environment = `missing: ${missingEnvVars.join(", ")}`;
    healthy = false;
  } else {
    checks.environment = "ok";
  }

  checks.maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ? "on" : "off";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
