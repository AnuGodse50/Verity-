import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, readDemoSession } from "@/lib/auth/session-token";
import { effectivePermissions } from "@/lib/auth/permissions";

export async function GET() {
  const store = await cookies();
  const session = readDemoSession(store.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({
    authenticated: true,
    roles: session.roles,
    tenantId: session.tenantId,
    mfaVerified: session.mfaVerified,
    permissions: effectivePermissions(session.roles),
  }, { headers: { "cache-control": "no-store" } });
}
