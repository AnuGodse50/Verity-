import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/server-session";
import { homeByRole } from "@/lib/auth/permissions";

export default async function IndexPage() {
  const session = await getServerSession();
  if (session) redirect(homeByRole[session.roles[0]]);
  redirect("/login");
}
