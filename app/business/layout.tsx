import { requireRoles } from "@/lib/auth/server-session";
import { PortalShell } from "@/components/workspace/portal-shell";

export default async function BusinessLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRoles(["business_representative"]);
  return <PortalShell session={session}>{children}</PortalShell>;
}
