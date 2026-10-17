import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import type { Role } from "./permissions";
import { roles } from "./permissions";

export const SESSION_COOKIE = "verity_demo_session";
const DEV_ONLY_SECRET = "verity-local-demo-session-key-never-use-in-production";

export type DemoSession = {
  sub: string;
  roles: Role[];
  tenantId: string | null;
  mfaVerified: boolean;
  authMethod: "demo";
  issuedAt: number;
  expiresAt: number;
};

function signingSecret() {
  if (process.env.NODE_ENV === "production" && !process.env.DEMO_SESSION_SECRET) {
    throw new Error("DEMO_SESSION_SECRET must be configured for production.");
  }
  return process.env.DEMO_SESSION_SECRET || DEV_ONLY_SECRET;
}

export function issueDemoSession(role: Role): string {
  const now = Math.floor(Date.now() / 1000);
  const session: DemoSession = {
    sub: randomUUID(),
    roles: [role],
    tenantId: ["bank_operations", "compliance_analyst", "bank_compliance_manager", "auditor"].includes(role) ? "northstar-bank-demo" : null,
    mfaVerified: true,
    authMethod: "demo",
    issuedAt: now,
    expiresAt: now + 60 * 60,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", signingSecret()).update(payload).digest("base64url");
  return payload + "." + signature;
}

export function readDemoSession(token?: string): DemoSession | null {
  if (!token) return null;
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = createHmac("sha256", signingSecret()).update(payload).digest("base64url");
    const suppliedBytes = Buffer.from(signature);
    const expectedBytes = Buffer.from(expected);
    if (suppliedBytes.length !== expectedBytes.length || !timingSafeEqual(suppliedBytes, expectedBytes)) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DemoSession;
    if (!Array.isArray(session.roles) || session.roles.some((role) => !roles.includes(role))) return null;
    if (session.expiresAt <= Math.floor(Date.now() / 1000) || session.mfaVerified !== true) return null;
    return session;
  } catch {
    return null;
  }
}
