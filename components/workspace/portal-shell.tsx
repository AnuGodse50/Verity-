"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity, ArrowLeftRight, Bell, BriefcaseBusiness, Building2, CheckSquare2, ChevronDown,
  CircleUserRound, ClipboardList, FileClock, FileKey2, FileSearch, Fingerprint, Globe2,
  Landmark, LayoutDashboard, LockKeyhole, LogOut, ScrollText, Settings2, ShieldCheck,
  SlidersHorizontal, UserRound, UsersRound, Workflow,
} from "lucide-react";
import { roleLabels, roleShortLabels, hasPermission, type Permission, type Role } from "@/lib/auth/permissions";
import { AuthzContext, type PortalSession } from "@/components/auth/authz-context";

type NavEntry = { label: string; href: string; icon: typeof LayoutDashboard; permission?: Permission };

const navByRole: Record<Role, NavEntry[]> = {
  customer: [
    { label: "My overview", href: "/customer", icon: LayoutDashboard, permission: "profile:read" },
    { label: "KYC onboarding", href: "/customer/onboarding", icon: Fingerprint, permission: "kyc:create" },
    { label: "Requests & consent", href: "/customer/requests/active", icon: CheckSquare2, permission: "consent:read" },
    { label: "Access history", href: "/customer/history", icon: FileClock, permission: "consent:read" },
    { label: "Notifications", href: "/customer/notifications", icon: Bell, permission: "profile:read" },
    { label: "Profile settings", href: "/customer/profile", icon: CircleUserRound, permission: "profile:update" },
  ],
  business_representative: [
    { label: "KYB overview", href: "/business", icon: LayoutDashboard, permission: "profile:read" },
    { label: "Organization", href: "/business/organization", icon: Building2, permission: "kyb:create" },
    { label: "Owners & people", href: "/business/people", icon: UsersRound, permission: "kyb:create" },
    { label: "Evidence", href: "/business/evidence", icon: ClipboardList, permission: "evidence:request" },
    { label: "Status & actions", href: "/business/status", icon: Workflow, permission: "case:read" },
    { label: "Appeals", href: "/business/appeals", icon: FileSearch, permission: "case:appeal" },
  ],
  bank_operations: [
    { label: "Overview", href: "/bank", icon: LayoutDashboard, permission: "case:read" },
    { label: "Case list", href: "/bank/cases", icon: ClipboardList, permission: "case:read" },
    { label: "Create KYC request", href: "/bank/requests/new", icon: FileKey2, permission: "request:create" },
    { label: "Approved results", href: "/bank/results", icon: CheckSquare2, permission: "request:read" },
    { label: "Escalations", href: "/bank/escalations", icon: Activity, permission: "case:escalate" },
  ],
  compliance_analyst: [
    { label: "Review overview", href: "/compliance", icon: LayoutDashboard, permission: "case:read" },
    { label: "Assigned queue", href: "/compliance/queue", icon: ClipboardList, permission: "case:review" },
    { label: "Case review", href: "/compliance/case-review", icon: FileSearch, permission: "case:review" },
    { label: "Appeals", href: "/compliance/appeals", icon: FileClock, permission: "case:appeal" },
    { label: "Audit trail", href: "/audit", icon: ScrollText, permission: "audit:read" },
  ],
  bank_compliance_manager: [
    { label: "Compliance overview", href: "/compliance/manager", icon: LayoutDashboard, permission: "case:read" },
    { label: "Review queue", href: "/compliance/queue", icon: ClipboardList, permission: "case:assign" },
    { label: "Assignments", href: "/compliance/assignments", icon: UsersRound, permission: "case:assign" },
    { label: "Rule configuration", href: "/compliance/policies", icon: SlidersHorizontal, permission: "policy:configure" },
    { label: "Team activity", href: "/compliance/team", icon: Activity, permission: "audit:read" },
    { label: "Appeals & escalations", href: "/compliance/appeals", icon: FileClock, permission: "case:appeal" },
  ],
  auditor: [
    { label: "Audit overview", href: "/audit", icon: LayoutDashboard, permission: "audit:read" },
    { label: "Event search", href: "/audit/events", icon: ScrollText, permission: "audit:read" },
    { label: "Case timelines", href: "/audit/cases", icon: FileClock, permission: "case:read" },
    { label: "Policy history", href: "/audit/policies", icon: SlidersHorizontal, permission: "policy:read" },
    { label: "Proof history", href: "/audit/proofs", icon: FileKey2, permission: "audit:read" },
  ],
  platform_super_admin: [
    { label: "Platform overview", href: "/platform-admin", icon: LayoutDashboard, permission: "platform:manage" },
    { label: "Institutions", href: "/platform-admin/tenants", icon: Landmark, permission: "tenant:manage" },
    { label: "Users & roles", href: "/platform-admin/users", icon: UsersRound, permission: "user:manage" },
    { label: "Country packs", href: "/platform-admin/markets", icon: Globe2, permission: "platform:manage" },
    { label: "Provider adapters", href: "/platform-admin/providers", icon: Workflow, permission: "provider:manage" },
    { label: "Platform audit", href: "/platform-admin/audit", icon: ScrollText, permission: "audit:read" },
  ],
};

function activePath(pathname: string, href: string) {
  if (href === "/customer" || href === "/business" || href === "/bank" || href === "/compliance" || href === "/audit" || href === "/platform-admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function PortalShell({ session, children }: { session: PortalSession; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const mainRole = session.roles[0];
  const items = [...new Map(session.roles.flatMap((role) => navByRole[role]).map((entry) => [entry.href, entry])).values()]
    .filter((entry) => !entry.permission || hasPermission(session.roles, entry.permission));

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const contextValue = {
    roles: session.roles,
    permissions: session.permissions,
    tenantId: session.tenantId,
    mfaVerified: session.mfaVerified,
  };

  return (
    <AuthzContext.Provider value={contextValue}>
      <div className="portal-frame">
        <aside className="portal-sidebar">
          <Link className="portal-brand" href={mainRole === "bank_operations" ? "/bank" : navByRole[mainRole][0].href}>
            <span className="portal-mark"><ShieldCheck size={18} /></span>
            <span><strong>verity</strong><small>PRIVATE IDENTITY</small></span>
          </Link>
          <div className="portal-tenant">
            <span className="portal-tenant-icon">{mainRole === "customer" || mainRole === "business_representative" ? <UserRound size={15} /> : <Landmark size={15} />}</span>
            <span><strong>{session.tenantId ? "Northstar Bank" : mainRole === "business_representative" ? "Alder & Finch Ltd." : "Personal workspace"}</strong><small>{roleShortLabels[mainRole]}</small></span>
            <ChevronDown size={13} />
          </div>
          <p className="portal-nav-label">WORKSPACE</p>
          <nav className="portal-nav" aria-label="Workspace navigation">
            {items.map((entry) => {
              const Icon = entry.icon;
              return <Link key={entry.href} className={"portal-link " + (activePath(pathname, entry.href) ? "current" : "")} href={entry.href}><Icon size={16} strokeWidth={1.7} /><span>{entry.label}</span></Link>;
            })}
          </nav>
          <div className="portal-side-bottom">
            <div className="portal-security"><span className="portal-security-dot" /><span><strong>MFA verified</strong><small>Session expires in 59m</small></span><LockKeyhole size={13} /></div>
            <button className="portal-logout" type="button" onClick={signOut}><LogOut size={15} /> Sign out</button>
          </div>
        </aside>
        <div className="portal-content">
          <header className="portal-topbar">
            <div className="portal-breadcrumb"><span>Workspace</span><span>/</span><strong>{roleShortLabels[mainRole]}</strong></div>
            <div className="portal-top-actions"><span className="portal-demo-badge">DEMO · SYNTHETIC RECORDS</span><button className="portal-notify" type="button" aria-label="Notifications" onClick={() => { setNotice("You’re all caught up."); window.setTimeout(() => setNotice(""), 2500); }}><Bell size={16} /><i /></button><span className="portal-avatar">{mainRole === "customer" ? "AS" : mainRole === "business_representative" ? "AM" : "MR"}</span></div>
          </header>
          <main className="portal-main">{children}</main>
          {notice && <div className="portal-toast" role="status">{notice}</div>}
        </div>
      </div>
    </AuthzContext.Provider>
  );
}
