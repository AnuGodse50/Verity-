import { NextRequest, NextResponse } from "next/server";
import { readDemoSession, SESSION_COOKIE } from "@/lib/auth/session-token";
import type { Role } from "@/lib/auth/permissions";
import { homeByRole } from "@/lib/auth/permissions";

const routeAccess: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: "/customer", roles: ["customer"] },
  { prefix: "/business", roles: ["business_representative"] },
  { prefix: "/bank", roles: ["bank_operations", "bank_compliance_manager"] },
  { prefix: "/compliance", roles: ["compliance_analyst", "bank_compliance_manager"] },
  { prefix: "/audit", roles: ["auditor", "bank_compliance_manager", "platform_super_admin"] },
  { prefix: "/platform-admin", roles: ["platform_super_admin"] },
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const rule = routeAccess.find((item) => pathname === item.prefix || pathname.startsWith(item.prefix + "/"));
  if (!rule) return NextResponse.next();

  const session = readDemoSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session || !session.mfaVerified) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!session.roles.some((role) => rule.roles.includes(role))) {
    const url = new URL("/unauthorized", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/business/:path*", "/bank/:path*", "/compliance/:path*", "/audit/:path*", "/platform-admin/:path*"],
};
