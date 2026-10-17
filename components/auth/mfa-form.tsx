"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Fingerprint, LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { homeByRole, roleLabels, type Role } from "@/lib/auth/permissions";

export function MfaForm({ role, method }: { role: Role; method: "sso" | "passkey" | "sms" }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/demo-auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role, code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Verification failed.");
      router.replace(homeByRole[role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify this session.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-top"><Link className="auth-brand" href="/login"><span className="auth-mark"><ShieldCheck size={19} /></span><span><strong>verity</strong><small>PRIVATE IDENTITY</small></span></Link><span className="auth-secure"><LockKeyhole size={12} /> MFA CHALLENGE</span></div>
      <div className="auth-single">
        <section className="auth-card auth-card-wide">
          <Link className="auth-back" href="/login"><ArrowLeft size={13} /> Back to sign in</Link>
          <div className="auth-card-head">
            <div><span className="auth-eyebrow"><i /> SECOND FACTOR REQUIRED</span><h2>Verify it’s you.</h2><p>Complete multi-factor authentication for {roleLabels[role]}.</p></div>
            <span className="auth-card-icon"><Fingerprint size={18} /></span>
          </div>
          <div className="auth-challenge"><span className="auth-challenge-icon">{method === "sms" ? <MessageSquareText size={18} /> : method === "passkey" ? <Fingerprint size={18} /> : <LockKeyhole size={18} />}</span><div><strong>{method === "sms" ? "SMS verification code" : method === "passkey" ? "Passkey/device verification" : "Authenticator verification"}</strong><span>{method === "sms" ? "A code was sent to the verified phone on your account." : "Confirm this sign-in with your registered second factor."}</span></div></div>
          <form onSubmit={verify}>
            <label className="auth-label" htmlFor="mfa-code">ONE-TIME CODE</label>
            <input id="mfa-code" className="auth-input auth-code-input" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" required />
            <div className="auth-demo-note"><CheckCircle2 size={14} /><span>Prototype only: enter <strong>246810</strong> to continue. No real OTP is sent.</span></div>
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="auth-submit" type="submit" disabled={loading || code.length !== 6}>{loading ? "Verifying…" : "Verify and continue"} <ArrowRight size={15} /></button>
          </form>
          <div className="auth-card-foot"><span><LockKeyhole size={11} /> Session cookie is HttpOnly and short-lived</span><span>Role: {roleShort(role)}</span></div>
        </section>
      </div>
      <footer className="auth-footer"><span>VERITY · SECURE ACCESS</span><span>MFA REQUIRED <i /></span></footer>
    </main>
  );
}

function roleShort(role: Role) {
  return role.replaceAll("_", " ");
}

