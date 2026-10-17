import { MfaForm } from "@/components/auth/mfa-form";
import { roleFromQuery } from "@/lib/auth/permissions";

export default async function MfaPage({ searchParams }: { searchParams: Promise<{ role?: string; method?: string }> }) {
  const query = await searchParams;
  const method = query.method === "passkey" || query.method === "sms" ? query.method : "sso";
  return <MfaForm role={roleFromQuery(query.role)} method={method} />;
}
