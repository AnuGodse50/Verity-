import { requireRoles } from "@/lib/auth/server-session";
import { PortalShell } from "@/components/workspace/portal-shell";

export default async function PlatformAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRoles(["platform_super_admin"]);
  return <PortalShell session={session}>{children}</PortalShell>;
}
