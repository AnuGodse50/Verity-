import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, Building2, ClipboardCheck, Fingerprint, Landmark, LockKeyhole, ShieldCheck, Users, UserRound } from "lucide-react";
import { roleLabels, roleShortLabels, roles, type Role } from "@/lib/auth/permissions";

const previews: Record<Role, { icon: typeof UserRound; intro: string; stats: [string,string][]; rows: [string,string][] }> = {
  customer: { icon: UserRound, intro: "Manage your identity, consent requests, and access history.", stats:[["Identity","Verified"],["Permissions","02"]], rows:[["Northstar Bank","Proof shared · active"],["Harbor Insurance","Consent requested"]] },
  business_representative: { icon: Building2, intro: "Track business verification, owners, and evidence requests.", stats:[["Application","In review"],["Owners","2 of 3"]], rows:[["Alder & Finch Ltd.","Company check · UK"],["Beneficial owner","Action needed"]] },
  bank_operations: { icon: Landmark, intro: "Create customer checks and monitor outcomes across markets.", stats:[["Open cases","128"],["Attention","12"]], rows:[["KYC-28491","India · Manual review"],["KYB-28490","UK · Processing"]] },
  compliance_analyst: { icon: Fingerprint, intro: "Review exceptions, screening signals, and assigned cases.", stats:[["Assigned","18"],["Due today","05"]], rows:[["CASE-92841","Potential PEP match"],["CASE-92838","Address mismatch"]] },
  bank_compliance_manager: { icon: Users, intro: "Balance analyst workload and oversee market rule changes.", stats:[["Unassigned","12"],["Capacity","84%"]], rows:[["India KYC pack","Active · v1.8"],["EU KYB pack","Approval needed"]] },
  auditor: { icon: ClipboardCheck, intro: "Search immutable events, case timelines, and evidence history.", stats:[["Events · 24h","8,421"],["Exceptions","03"]], rows:[["EVT-77A2","Case decision updated"],["EVT-77A1","Policy published"]] },
  platform_super_admin: { icon: ShieldCheck, intro: "Manage institutions, country packs, providers, and platform access.", stats:[["Institutions","24"],["Markets","08"]], rows:[["Sumsub · EU","Provider healthy"],["India pack","Published · v1.8"]] },
};

export default function DemoGalleryPage() {
  return <main className="demo-page">
    <header className="demo-top"><Link className="auth-brand" href="/login"><span className="auth-mark"><ShieldCheck size={18}/></span><span><strong>verity</strong><small>PRIVATE IDENTITY</small></span></Link><div><span className="demo-pill"><i/> ALL ROLE PREVIEWS · SYNTHETIC DATA</span><Link className="demo-signin" href="/login">Sign in <ArrowUpRight size={14}/></Link></div></header>
    <section className="demo-intro"><div className="auth-eyebrow"><i/> ONE PLATFORM · SEVEN WORKSPACES</div><h1>Every role. <span>One private identity layer.</span></h1><p>Preview all role dashboards together. Each workspace has its own navigation, metrics, and actions. No external backend or real identity data is used in this demo.</p><div className="demo-assurance"><span><LockKeyhole size={13}/> Demo data only</span><span><Activity size={13}/> Role-specific views</span><span><Fingerprint size={13}/> Privacy-first by design</span></div></section>
    <section className="role-gallery" aria-label="All role dashboard previews">
      {roles.map((role,index)=>{ const preview=previews[role]; const Icon=preview.icon; return <article className="role-preview-card" key={role}>
        <header className="role-preview-head"><span className="role-preview-icon"><Icon size={17}/></span><span className="role-index">0{index+1}</span></header>
        <div className="role-preview-kicker">{roleShortLabels[role].toUpperCase()}</div><h2>{roleLabels[role]}</h2><p className="role-preview-intro">{preview.intro}</p>
        <div className="role-preview-stats">{preview.stats.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <div className="role-preview-rows">{preview.rows.map(([label,value])=><div key={label}><span>{label}</span><small>{value}</small></div>)}</div>
        <Link className="role-preview-link" href={`/mfa?role=${role}&method=sso`}>Open this dashboard <ArrowRight size={14}/></Link>
      </article> })}
    </section>
    <footer className="demo-bottom"><span>VERITY · PRIVATE IDENTITY INFRASTRUCTURE</span><span>INDIA <i/> EU / UK <i/> US</span></footer>
  </main>;
}
