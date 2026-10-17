import { requireRoles } from "@/lib/auth/server-session";
import { PortalShell } from "@/components/workspace/portal-shell";

export default async function AuditLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRoles(["auditor", "bank_compliance_manager", "platform_super_admin"]);
  return <PortalShell session={session}>{children}</PortalShell>;
}
