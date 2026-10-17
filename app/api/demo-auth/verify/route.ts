import { NextResponse } from "next/server";
import { issueDemoSession } from "@/lib/auth/session-token";
import { roles } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const role = body?.role;
  const code = String(body?.code ?? "");

  if (!roles.includes(role)) return NextResponse.json({ error: "Choose a valid demo role." }, { status: 400 });
  if (code !== "246810") return NextResponse.json({ error: "That demo code did not match. Try 246810." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("verity_demo_session", issueDemoSession(role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });
  return response;
}
