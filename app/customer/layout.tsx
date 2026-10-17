import { requireRoles } from "@/lib/auth/server-session";
import { PortalShell } from "@/components/workspace/portal-shell";

export default async function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRoles(["customer"]);
  return <PortalShell session={session}>{children}</PortalShell>;
}
