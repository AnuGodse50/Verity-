"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Fingerprint, Landmark, LockKeyhole, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { roleLabels, roles, type Role } from "@/lib/auth/permissions";
import Link from "next/link";

const roleIcons: Record<Role, typeof UserRound> = {
  customer: UserRound,
  business_representative: Landmark,
  bank_operations: Landmark,
  compliance_analyst: Fingerprint,
  bank_compliance_manager: ShieldCheck,
  auditor: LockKeyhole,
  platform_super_admin: Sparkles,
};

export default function LoginPage() {
  const [role, setRole] = useState<Role>("customer");
  const [method, setMethod] = useState<"sso" | "passkey" | "sms">("sso");
  const [invitationMode, setInvitationMode] = useState(false);
  const router = useRouter();

  return (
    <main className="auth-page">
      <div className="auth-top">
        <a className="auth-brand" href="/"><span className="auth-mark"><ShieldCheck size={19} /></span><span><strong>verity</strong><small>PRIVATE IDENTITY</small></span></a>
        <span className="auth-secure"><LockKeyhole size={12} /> SECURE WORKSPACE</span>
      </div>
      <div className="auth-layout">
        <section className="auth-story">
          <div className="auth-eyebrow"><i /> PRIVACY-FIRST VERIFICATION</div>
          <h1>Prove what matters.<br /><span>Protect what doesn’t.</span></h1>
          <p>One trusted identity. Precise, customer-approved proofs. A clearer way to move through KYC and KYB.</p>
          <div className="auth-assurance">
            <div><LockKeyhole size={14} /><span>Encrypted by design</span></div>
            <div><Fingerprint size={14} /><span>Scoped, one-time proofs</span></div>
            <div><Landmark size={14} /><span>Built for regulated teams</span></div>
          </div>
          <div className="auth-quote">“Your identity stays yours.”<span>VERITY · PRIVATE IDENTITY</span></div>
        </section>

        <section className="auth-card">
          <div className="auth-card-head">
            <div><span className="auth-eyebrow"><i /> {invitationMode ? "ACCEPT INVITATION" : "WELCOME BACK"}</span><h2>{invitationMode ? "Join your workspace" : "Sign in to Verity"}</h2><p>Choose a role to explore the interactive prototype.</p></div>
            <span className="auth-card-icon"><ShieldCheck size={18} /></span>
          </div>
          <div className="auth-demo-note"><Sparkles size={14} /><span><strong>Demo workspace</strong> — use synthetic records only. This preview does not connect to a real identity provider.</span></div>
          <div className="login-role-label"><label className="auth-label" htmlFor="role-select">DEMO ROLE</label><Link href="/demo">Preview all roles <ArrowRight size={11}/></Link></div>
          <div className="auth-role-select-wrap">
            <select id="role-select" className="auth-input" value={role} onChange={(event) => setRole(event.target.value as Role)}>
              {roles.map((item) => <option key={item} value={item}>{roleLabels[item]}</option>)}
            </select>
            <span className="auth-select-icon"><ArrowRight size={14} /></span>
          </div>
          {invitationMode && <><label className="auth-label" htmlFor="invite-code">INVITATION CODE</label><input id="invite-code" className="auth-input" placeholder="Enter your workspace invitation" /></>}
          <label className="auth-label">SIGN-IN METHOD</label>
          <div className="auth-methods" role="group" aria-label="Sign-in method">
            <button type="button" className={"auth-method " + (method === "sso" ? "selected" : "")} onClick={() => setMethod("sso")}><Landmark size={14} /> Organization SSO</button>
            <button type="button" className={"auth-method " + (method === "passkey" ? "selected" : "")} onClick={() => setMethod("passkey")}><Fingerprint size={14} /> Passkey</button>
            <button type="button" className={"auth-method " + (method === "sms" ? "selected" : "")} onClick={() => setMethod("sms")}><LockKeyhole size={14} /> SMS OTP</button>
          </div>
          <button className="auth-submit" type="button" onClick={() => router.push("/mfa?role=" + role + "&method=" + method + (invitationMode ? "&invite=1" : ""))}>
            Continue securely <ArrowRight size={15} />
          </button>
          <button className="auth-switch" type="button" onClick={() => setInvitationMode(!invitationMode)}>{invitationMode ? "Already have access? Sign in" : "Have a workspace invitation? Accept it"}</button>
          <div className="auth-card-foot"><span><LockKeyhole size={11} /> Your session is protected with MFA</span><a href="/privacy">Privacy</a></div>
        </section>
      </div>
      <footer className="auth-footer"><span>VERITY · PRIVATE IDENTITY INFRASTRUCTURE</span><span>INDIA <i /> EU / UK <i /> US</span></footer>
    </main>
  );
}
