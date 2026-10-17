import { requireRoles } from "@/lib/auth/server-session";

export default async function BankLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRoles(["bank_operations", "bank_compliance_manager"]);
  return children;
}
