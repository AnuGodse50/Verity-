import { requireRoles } from "@/lib/auth/server-session";
import { PortalShell } from "@/components/workspace/portal-shell";

export default async function ComplianceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRoles(["compliance_analyst", "bank_compliance_manager"]);
  return <PortalShell session={session}>{children}</PortalShell>;
}
