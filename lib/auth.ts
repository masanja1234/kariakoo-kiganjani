import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  const { userId } = await auth();
  return userId;
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) redirect("/auth/login");
  return userId;
}

// Uses currentUser() which always fetches fresh data from Clerk's API,
// bypassing the JWT session cache that can lag after metadata changes.
export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/auth/login");

  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "ADMIN") redirect("/");

  return userId;
}

export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  return role === "ADMIN";
}

export async function getUserRole(): Promise<string | null> {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  return role ?? "CUSTOMER";
}
