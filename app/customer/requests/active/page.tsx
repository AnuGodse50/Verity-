"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";

const optionalFields = ["Address verification", "Verified phone number"];

export default function CustomerPage() {
  const [selected, setSelected] = useState<string[]>(optionalFields);
  const [complete, setComplete] = useState(false);
  const [toast, setToast] = useState("");

  function toggle(field: string) {
    setSelected((current) => current.includes(field) ? current.filter((item) => item !== field) : [...current, field]);
  }

  function approve() {
    setComplete(true);
    setToast("Your approval was recorded. The proof is limited to this request.");
    window.setTimeout(() => setToast(""), 3500);
  }

  return (
    <main className="customer-page">
      <header className="customer-nav">
        <Link className="brand" href="/" style={{ padding: 0 }}>
          <span className="brand-mark"><ShieldCheck size={19} strokeWidth={1.8} /></span>
          <span className="brand-copy"><span className="brand-name">verity</span><span className="brand-sub">private identity</span></span>
        </Link>
        <Link href="/" className="button ghost"><ArrowLeft size={13} /> Back to workspace</Link>
      </header>

      {complete ? (
        <section className="customer-main" style={{ gridTemplateColumns: "minmax(0, 650px)", justifyContent: "center" }}>
          <div className="customer-card" style={{ textAlign: "center", padding: "48px 28px" }}>
            <div className="seal-icon" style={{ margin: "0 auto 17px", width: 52, height: 52 }}><Check size={24} /></div>
            <div className="eyebrow" style={{ justifyContent: "center" }}><i className="eyebrow-line" /> APPROVAL RECORDED</div>
            <h1 className="customer-title">Your identity stays yours.</h1>
            <p className="customer-intro" style={{ maxWidth: 410, margin: "0 auto" }}>Horizon Bank received a one-time proof for the details you approved. Your source documents were not shared.</p>
            <div className="request-org" style={{ maxWidth: 390, margin: "24px auto", textAlign: "left" }}><span className="org-mark"><FileCheck2 size={18} /></span><div><strong>One-time proof issued</strong><span>Request HZ-3841 · Expires in 10 minutes</span></div><CheckCircle2 size={15} color="#a9dbbc" /></div>
            <Link className="button primary" href="/">Return to workspace <ArrowRight size={13} /></Link>
          </div>
        </section>
      ) : (
        <>
          <div className="eyebrow"><i className="eyebrow-line" /> CUSTOMER PORTAL <span className="type-pill">SYNTHETIC DEMO</span></div>
          <section className="customer-main" style={{ marginTop: 12 }}>
            <div className="customer-card">
              <div className="eyebrow"><Clock3 size={12} /> REQUEST EXPIRES IN 09:42</div>
              <h1 className="customer-title">Your information,<br />on your terms.</h1>
              <p className="customer-intro">Review what Horizon Bank is asking for. You choose which optional details to share. This approval is for one request only.</p>
              <div className="request-org">
                <span className="org-mark"><span style={{ fontSize: 18, fontWeight: 700 }}>H</span></span>
                <div style={{ flex: 1 }}><strong>Horizon Bank</strong><span>Verified institution · India</span></div>
                <span className="status-pill approved"><i className="status-dot" /> Verified</span>
              </div>
              <div className="request-purpose"><b>Why they need this</b><span>To open your personal savings account and complete identity checks required for onboarding.</span></div>

              <div className="attribute-list">
                <label className="attribute-row">
                  <input type="checkbox" checked disabled aria-label="Legal name is required" />
                  <div><strong>Legal name</strong><span>Share a verified name claim. Source identity documents stay protected.</span></div>
                  <span className="attribute-tag">Required</span>
                </label>
                <label className="attribute-row">
                  <input type="checkbox" checked disabled aria-label="Date of birth check is required" />
                  <div><strong>Date of birth check</strong><span>Horizon receives a match result, not your full date of birth.</span></div>
                  <span className="attribute-tag">Required</span>
                </label>
                {optionalFields.map((field) => (
                  <label className="attribute-row" key={field}>
                    <input type="checkbox" checked={selected.includes(field)} onChange={() => toggle(field)} />
                    <div><strong>{field}</strong><span>{field === "Address verification" ? "Share only whether your address is verified." : "Share a verified contact claim with the bank."}</span></div>
                    <span className="attribute-tag" style={{ color: "#88958e" }}>Optional</span>
                  </label>
                ))}
              </div>
              <div className="customer-actions">
                <button className="button" type="button" onClick={() => { setToast("Request declined"); window.setTimeout(() => setToast(""), 2500); }}><X size={13} /> Decline request</button>
                <button className="button primary" type="button" onClick={approve}>Approve selected <ArrowRight size={13} /></button>
              </div>
              <p className="form-hint" style={{ textAlign: "right" }}>You can revoke an unused approval before the proof is redeemed.</p>
            </div>

            <aside style={{ display: "grid", gap: 13 }}>
              <section className="customer-info-card">
                <h3><Eye size={14} style={{ verticalAlign: "-3px", marginRight: 7 }} />What the bank will receive</h3>
                <p>Only the verified claims you approve for this request. No raw ID images, selfie, or biometric template.</p>
                <div className="privacy-point"><CheckCircle2 size={14} /> Limited to Horizon Bank</div>
                <div className="privacy-point"><CheckCircle2 size={14} /> One-time use, expires in 10 minutes</div>
                <div className="privacy-point"><CheckCircle2 size={14} /> Added to your access history</div>
              </section>
              <section className="customer-info-card">
                <h3><LockKeyhole size={14} style={{ verticalAlign: "-3px", marginRight: 7 }} />Your control</h3>
                <p>Approving shares only the selected claims. You can review this request later in your activity history.</p>
                <div className="privacy-point"><Fingerprint size={14} /> Verified with a device-bound proof</div>
              </section>
              <section className="customer-info-card">
                <h3><ShieldCheck size={14} style={{ verticalAlign: "-3px", marginRight: 7 }} />Verification assurance</h3>
                <p>Identity verified in India on 17 Oct 2026. Level 2 assurance · Details remain encrypted at rest.</p>
                <div className="privacy-point"><ChevronRight size={14} /> View verification methods</div>
              </section>
            </aside>
          </section>
        </>
      )}
      {toast && <div className="toast" role="status"><CheckCircle2 size={15} />{toast}</div>}
    </main>
  );
}
