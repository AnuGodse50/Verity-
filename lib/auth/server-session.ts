import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, readDemoSession } from "./session-token";
import type { DemoSession } from "./session-token";
import { effectivePermissions, type Role, type Permission } from "./permissions";

export type AuthenticatedSession = DemoSession & { permissions: Permission[] };

export async function getServerSession(): Promise<DemoSession | null> {
  const store = await cookies();
  return readDemoSession(store.get(SESSION_COOKIE)?.value);
}

export async function requireRoles(allowed: readonly Role[]): Promise<AuthenticatedSession> {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (!session.roles.some((role) => allowed.includes(role))) redirect("/unauthorized");
  if (!session.mfaVerified) redirect("/mfa");
  return { ...session, permissions: effectivePermissions(session.roles) };
}
