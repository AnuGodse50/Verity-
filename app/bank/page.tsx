"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  Fingerprint,
  Globe2,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  Plus,
  Search,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  ScrollText,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

type CaseStatus = "In review" | "Queued" | "Approved" | "Rejected" | "Escalated" | "Needs attention";
type CaseKind = "Individual KYC" | "Business KYB";
type RiskLevel = "Low" | "Medium" | "High";

type KycCase = {
  id: string;
  name: string;
  kind: CaseKind;
  country: string;
  flag: string;
  risk: RiskLevel;
  status: CaseStatus;
  initials: string;
  submitted: string;
  checks: string[];
  owner: string;
};

const seedCases: KycCase[] = [
  { id: "KY-2841", name: "Aarav Mehta", kind: "Individual KYC", country: "India", flag: "🇮🇳", risk: "Low", status: "In review", initials: "AM", submitted: "8 min ago", checks: ["Document authenticity", "Liveness", "Address verified"], owner: "Maya Rao" },
  { id: "KY-2838", name: "Northstar Trading", kind: "Business KYB", country: "United States", flag: "🇺🇸", risk: "High", status: "Escalated", initials: "NT", submitted: "22 min ago", checks: ["Business registry", "Beneficial owner", "Adverse media"], owner: "Maya Rao" },
  { id: "KY-2836", name: "Priya Nair", kind: "Individual KYC", country: "India", flag: "🇮🇳", risk: "Medium", status: "Queued", initials: "PN", submitted: "41 min ago", checks: ["Document authenticity", "Liveness", "Watchlist"], owner: "Rohan Iyer" },
  { id: "KY-2832", name: "Alder & Finch Ltd.", kind: "Business KYB", country: "United Kingdom", flag: "🇬🇧", risk: "Low", status: "Approved", initials: "AF", submitted: "1 hr ago", checks: ["Company registry", "Director screening", "Address verified"], owner: "Maya Rao" },
  { id: "KY-2829", name: "Sofia Laurent", kind: "Individual KYC", country: "France", flag: "🇪🇺", risk: "Low", status: "Rejected", initials: "SL", submitted: "1 hr ago", checks: ["Document authenticity", "Liveness", "Address verified"], owner: "Elena Martin" },
];

type FilterKey = "All cases" | "Needs review" | "Business KYB" | "High risk";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, target: "overview" },
  { label: "Review queue", icon: ClipboardIcon, target: "cases", count: "18" },
  { label: "Business KYB", icon: Landmark, target: "cases" },
  { label: "Policy studio", icon: SlidersHorizontal, target: "policy" },
  { label: "Audit trail", icon: ScrollText, target: "activity" },
];

function ClipboardIcon({ size = 16 }: { size?: number }) {
  return <FileCheck2 size={size} strokeWidth={1.7} />;
}

function StatusPill({ status }: { status: CaseStatus }) {
  const styles: Record<CaseStatus, string> = {
    "In review": "review",
    Queued: "queued",
    Approved: "approved",
    Rejected: "attention",
    Escalated: "attention",
    "Needs attention": "attention",
  };
  return <span className={"status-pill " + styles[status]}><i className="status-dot" />{status}</span>;
}

function Risk({ level }: { level: RiskLevel }) {
  return <span className={"risk " + level.toLowerCase()}><i className="risk-dot" />{level}</span>;
}

function timeGreeting() {
  return "Saturday, 17 October 2026";
}

export default function DashboardPage() {
  const [cases, setCases] = useState(seedCases);
  const [activeNav, setActiveNav] = useState("Overview");
  const [filter, setFilter] = useState<FilterKey>("All cases");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("India · Mumbai");
  const [modal, setModal] = useState<"create" | "review" | null>(null);
  const [selectedCase, setSelectedCase] = useState<KycCase | null>(null);
  const [caseScope, setCaseScope] = useState<"My requests" | "Team requests">("Team requests");
  const [toast, setToast] = useState("");

  const filteredCases = useMemo(() => cases.filter((item) => {
    const matchesScope = caseScope === "Team requests" || item.owner === "Maya Rao";
    const matchesSearch = (item.name + " " + item.id + " " + item.country).toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All cases" ||
      (filter === "Needs review" && (item.status === "In review" || item.status === "Needs attention" || item.status === "Escalated" || item.status === "Queued")) ||
      (filter === "Business KYB" && item.kind === "Business KYB") ||
      (filter === "High risk" && item.risk === "High");
    return matchesScope && matchesSearch && matchesFilter;
  }), [cases, caseScope, filter, search]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function navigate(label: string, target: string) {
    setActiveNav(label);
    if (label === "Business KYB") setFilter("Business KYB");
    else if (label === "Review queue") setFilter("Needs review");
    else if (label === "Overview") setFilter("All cases");
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openReview(item: KycCase) {
    setSelectedCase(item);
    setModal("review");
  }

  function resolveCase(status: CaseStatus) {
    if (!selectedCase) return;
    setCases((current) => current.map((item) => item.id === selectedCase.id ? { ...item, status } : item));
    setModal(null);
    showToast(selectedCase.name + " · " + status.toLowerCase());
  }

  function createCase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("applicant") || "").trim();
    if (!name) return;
    const kind = String(form.get("kind")) === "Business KYB" ? "Business KYB" : "Individual KYC";
    const countryValue = String(form.get("country") || "India");
    const flagMap: Record<string, string> = { India: "🇮🇳", "United States": "🇺🇸", "United Kingdom": "🇬🇧", France: "🇪🇺" };
    const item: KycCase = {
      id: "KY-" + (2842 + cases.length),
      name,
      kind,
      country: countryValue,
      flag: flagMap[countryValue] || "🌐",
      risk: "Low",
      status: "Queued",
      initials: name.split(/s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      submitted: "just now",
      checks: ["Document authenticity", "Liveness", "Sanctions screening"],
      owner: "Maya Rao",
    };
    setCases((current) => [item, ...current]);
    setModal(null);
    setFilter("All cases");
    showToast("Verification request created");
  }

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark"><ShieldCheck size={19} strokeWidth={1.8} /></div>
            <div className="brand-copy"><div className="brand-name">verity</div><span className="brand-sub">private identity</span></div>
          </div>

          <button className="workspace-switch" type="button" onClick={() => showToast("Workspace switcher · Demo")}>
            <span className="workspace-avatar">N</span>
            <span className="workspace-copy"><strong>Northstar Bank</strong><span>Compliance workspace</span></span>
            <ChevronDown size={14} />
          </button>

          <p className="nav-label">Workspace</p>
          <nav className="nav-list" aria-label="Main navigation">
            {navigation.map(({ label, icon: Icon, target, count }) => (
              <button key={label} className={"nav-item " + (activeNav === label ? "active" : "")} type="button" onClick={() => navigate(label, target)}>
                <Icon size={16} strokeWidth={1.7} /><span>{label}</span>{count && <small className="nav-count">{count}</small>}
              </button>
            ))}
            <Link className="nav-item" href="/customer"><UserRound size={16} strokeWidth={1.7} /><span>Customer view</span><ArrowUpRight size={12} /></Link>
          </nav>

          <div className="sidebar-bottom">
            <div className="region-card">
              <div className="region-top"><span className="region-title">Active region</span><i className="region-dot" /></div>
              <select className="region-select" value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Select active region">
                <option>India · Mumbai</option>
                <option>Europe · Frankfurt</option>
                <option>United Kingdom · London</option>
                <option>United States · Virginia</option>
              </select>
              <div className="region-note"><LockKeyhole size={11} /> Data stays in selected region</div>
            </div>
            <div className="user-mini">
              <span className="user-face">MR</span>
              <div className="user-info"><strong>Maya Rao</strong><span>Compliance lead</span></div>
              <Settings2 size={15} color="#75817b" />
            </div>
          </div>
        </aside>

        <main className="main-column">
          <header className="topbar">
            <div className="crumbs"><span>Northstar Bank</span><ChevronRight size={13} /><strong>Compliance overview</strong></div>
            <div className="top-actions">
              <span className="type-pill">DEMO · SYNTHETIC DATA</span>
              <button className="icon-button" type="button" aria-label="Notifications" onClick={() => showToast("You’re all caught up")}>
                <Bell size={16} /><i className="alert-dot" />
              </button>
              <span className="top-divider" />
              <button className="avatar" type="button" aria-label="Account menu" onClick={() => showToast("Signed in as Maya Rao")}>MR</button>
            </div>
          </header>

          <div className="page-wrap" id="overview">
            <div className="page-heading">
              <div>
                <div className="eyebrow"><i className="eyebrow-line" /> COMPLIANCE CONSOLE <span className="type-pill">LIVE WORKSPACE</span></div>
                <h1>Verification operations.</h1>
                <p>Track your requests, respond to customer actions, and keep every case auditable.</p>
              </div>
              <div className="date-stamp"><CalendarDays size={12} style={{ verticalAlign: "-2px", marginRight: 6 }} />{timeGreeting()}</div>
            </div>

            <section className="hero" aria-label="Privacy-first verification">
              <div className="hero-copy">
                <div className="hero-kicker"><Sparkles size={13} /> Built for confident decisions</div>
                <h2>Know what you need.<br /><span>Keep what you don’t.</span></h2>
                <p>Verify identities with precise, customer-approved proofs. Sensitive documents stay protected while your team gets the signal it needs.</p>
                <div className="hero-foot"><span><Shield size={12} /> Privacy-first by design</span><i /><span><Globe2 size={12} /> {region}</span></div>
              </div>
              <div className="proof-card">
                <div className="proof-head"><span>Verification proof</span><span>One-time</span></div>
                <div className="proof-seal">
                  <div className="seal-icon"><Fingerprint size={21} strokeWidth={1.7} /></div>
                  <div><strong>Identity confirmed</strong><span>Customer-approved · Request scoped</span></div>
                </div>
                <div className="proof-meta"><span>Shared attributes</span><b>03 selected</b></div>
                <div className="proof-meta"><span>Underlying documents</span><b>Not shared</b></div>
              </div>
            </section>

            <section className="metrics" aria-label="Key metrics">
              <Metric icon={<Activity size={14} />} label="Active cases" value={String(cases.filter((item) => ["In review", "Queued"].includes(item.status)).length + 23)} change="Across 4 markets" />
              <Metric icon={<Clock3 size={14} />} label="Pending" value={String(cases.filter((item) => item.status === "Queued" || item.status === "In review").length)} change="Awaiting decision" />
              <Metric icon={<CheckCircle2 size={14} />} label="Approved" value={String(cases.filter((item) => item.status === "Approved").length + 14)} change="Today" />
              <Metric icon={<X size={14} />} label="Rejected" value={String(cases.filter((item) => item.status === "Rejected").length + 2)} change="Today" alert />
              <Metric icon={<ShieldAlert size={14} />} label="Escalated" value={String(cases.filter((item) => item.status === "Escalated" || item.status === "Needs attention").length)} change="Needs attention" alert />
            </section>

            <div className="content-grid">
              <section className="panel" id="cases">
                <div className="panel-head">
                  <div><h2 className="panel-title">{caseScope}</h2><div className="panel-subtitle">Requests created by you or visible to your team permissions</div></div>
                  <div className="panel-actions"><button className="button" type="button" onClick={() => showToast("Export prepared · Synthetic demo data")}><ArrowDownRight size={13} /> Export</button><button className="button primary" type="button" onClick={() => setModal("create")}><Plus size={14} /> New request</button></div>
                </div>
                <div className="toolbar">
                  <div className="filters" role="group" aria-label="Request scope">
                    {(["My requests", "Team requests"] as const).map((item) => <button key={item} className={"filter-chip " + (caseScope === item ? "selected" : "")} type="button" onClick={() => setCaseScope(item)}>{item}</button>)}
                  </div>
                  <div className="filters" role="group" aria-label="Filter verification cases">
                    {(["All cases", "Needs review", "Business KYB", "High risk"] as FilterKey[]).map((item) => (
                      <button key={item} className={"filter-chip " + (filter === item ? "selected" : "")} type="button" onClick={() => setFilter(item)}>{item}</button>
                    ))}
                  </div>
                  <label className="search-box"><Search size={13} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cases" aria-label="Search cases" /></label>
                </div>
                <div className="table-wrap">
                  <table className="cases-table">
                    <thead><tr><th>Applicant</th><th>Type</th><th>Market</th><th>Risk</th><th>Status</th><th>Received</th><th aria-label="Actions" /></tr></thead>
                    <tbody>
                      {filteredCases.map((item) => (
                        <tr key={item.id}>
                          <td><div className="applicant"><span className="applicant-avatar">{item.initials}</span><div><strong>{item.name}</strong><span>{item.id}</span></div></div></td>
                          <td><span className="type-pill">{item.kind === "Individual KYC" ? "Individual" : "Business"}</span></td>
                          <td><span className="country-cell"><span className="flag">{item.flag}</span>{item.country}</span></td>
                          <td><Risk level={item.risk} /></td>
                          <td><StatusPill status={item.status} /></td>
                          <td>{item.submitted}</td>
                          <td><button className="case-action" type="button" onClick={() => openReview(item)}>Review <ArrowRight size={11} style={{ verticalAlign: "-2px" }} /></button></td>
                        </tr>
                      ))}
                      {filteredCases.length === 0 && <tr><td colSpan={7}><div className="empty-state">No cases match those filters.</div></td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="policy-strip"><span>Showing <b>{filteredCases.length} of {cases.length}</b> synthetic cases</span><button className="button ghost small" type="button" onClick={() => { setFilter("All cases"); setSearch(""); }}>Clear filters <X size={11} /></button></div>
              </section>

              <aside className="right-rail">
                <section className="panel" id="policy">
                  <div className="panel-head"><div><h2 className="panel-title">Policy health</h2><div className="panel-subtitle">Market rules and live checks</div></div><button className="icon-button" type="button" aria-label="Policy options" onClick={() => showToast("Policy settings are view-only in this demo")}><Settings2 size={15} /></button></div>
                  <div className="risk-summary">
                    <div className="risk-summary-top"><span><CircleAlert size={13} style={{ verticalAlign: "-3px", marginRight: 5 }} /> 2 items to review</span><ArrowUpRight size={14} /></div>
                    <p>One screening match needs analyst attention. A policy update is waiting for approval.</p>
                    <a href="#cases" onClick={() => { setFilter("High risk"); setActiveNav("Review queue"); }}>Open priority queue <ArrowRight size={11} style={{ verticalAlign: "-2px" }} /></a>
                  </div>
                  <div className="policy-strip"><span><b>India · Individual KYC</b><br />Policy v2.6 · Updated today</span><span className="status-pill approved"><i className="status-dot" /> Active</span></div>
                  <div className="policy-strip"><span><b>EU · Business KYB</b><br />Policy v1.9 · 3 checks</span><span className="status-pill queued">Review</span></div>
                </section>

                <section className="panel" id="action-needed">
                  <div className="panel-head"><div><h2 className="panel-title">Action needed</h2><div className="panel-subtitle">Customer action, expiry, resubmission, or escalation</div></div><span className="type-pill">03 OPEN</span></div>
                  <ul className="activity-list">
                    <ActivityItem icon={<Clock3 size={13} />} title="Customer action · proof of address" detail="KY-2841 · Expires in 2 days" time="Now" />
                    <ActivityItem icon={<CircleAlert size={13} />} title="Screening match escalated" detail="KY-2838 · US · High risk" time="22m" />
                    <ActivityItem icon={<ArrowRight size={13} />} title="Resubmission requested" detail="KY-2826 · Awaiting customer" time="1h" />
                  </ul>
                </section>

                <section className="panel" id="activity">
                  <div className="panel-head"><div><h2 className="panel-title">Recent activity & audit trail</h2><div className="panel-subtitle">Case-level status changes and proof redemptions</div></div><button className="button ghost small" type="button" onClick={() => showToast("Audit log · Demo view")}>View log <ArrowUpRight size={11} /></button></div>
                  <ul className="activity-list">
                    <ActivityItem icon={<Check size={13} />} title="Customer-approved proof redeemed" detail="Northstar Trading · 3 attributes" time="2m" />
                    <ActivityItem icon={<ShieldCheck size={13} />} title="Identity check completed" detail="Aarav Mehta · India" time="8m" />
                    <ActivityItem icon={<UsersRound size={13} />} title="Analyst assigned to case" detail="Case KY-2838 · Business KYB" time="22m" />
                  </ul>
                  <div className="policy-strip"><span>Audit events are append-only</span><LockKeyhole size={12} /></div>
                </section>

                <section className="panel">
                  <div className="panel-head"><div><h2 className="panel-title">Privacy signal</h2><div className="panel-subtitle">Sharing stays specific</div></div><div className="metric-icon"><LockKeyhole size={14} /></div></div>
                  <div className="privacy-point" style={{ margin: "0 17px 12px" }}><CheckCircle2 size={14} /> Customer-approved attributes only</div>
                  <div className="privacy-point" style={{ margin: "0 17px 17px" }}><CheckCircle2 size={14} /> One-time proofs, bound to each request</div>
                </section>
              </aside>
            </div>
            <footer className="page-footer"><span>VERITY · PRIVATE IDENTITY INFRASTRUCTURE</span><span>SECURE BY DESIGN <i className="region-dot" /></span></footer>
          </div>
        </main>
      </div>

      {modal === "create" && <CreateModal onClose={() => setModal(null)} onSubmit={createCase} />}
      {modal === "review" && selectedCase && <ReviewModal item={selectedCase} onClose={() => setModal(null)} onResolve={resolveCase} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={15} />{toast}</div>}
    </>
  );
}

function Metric({ icon, label, value, change, alert = false }: { icon: React.ReactNode; label: string; value: string; change: string; alert?: boolean }) {
  return <div className="metric"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className="metric-bottom"><span className="metric-value">{value}</span><span className={"metric-change " + (alert ? "muted" : "")}>{!alert && <ArrowUpRight size={10} />}{change}</span></div></div>;
}

function ActivityItem({ icon, title, detail, time }: { icon: React.ReactNode; title: string; detail: string; time: string }) {
  return <li className="activity-item"><span className="activity-icon">{icon}</span><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><time className="activity-time">{time}</time></li>;
}

function CreateModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
      <div className="modal-head"><div><h2 id="create-title">Start a verification</h2><p>Choose a workflow. The customer reviews every data request.</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><X size={15} /></button></div>
      <form onSubmit={onSubmit}>
        <label className="form-label" htmlFor="kind">Verification type</label>
        <select className="form-control" id="kind" name="kind"><option>Individual KYC</option><option>Business KYB</option></select>
        <label className="form-label" htmlFor="applicant">Customer or business name</label>
        <input className="form-control" id="applicant" name="applicant" placeholder="e.g. Ananya Shah" required autoFocus />
        <div className="form-row">
          <div><label className="form-label" htmlFor="country">Market</label><select className="form-control" id="country" name="country"><option>India</option><option>United States</option><option>United Kingdom</option><option>France</option></select></div>
          <div><label className="form-label" htmlFor="purpose">Purpose</label><select className="form-control" id="purpose" name="purpose"><option>Account onboarding</option><option>Periodic review</option><option>Business verification</option></select></div>
        </div>
        <p className="form-hint">Only request attributes required for your stated purpose. Sensitive source documents remain protected.</p>
        <div className="modal-actions"><button className="button" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit">Create request <ArrowRight size={13} /></button></div>
      </form>
    </section>
  </div>;
}

function ReviewModal({ item, onClose, onResolve }: { item: KycCase; onClose: () => void; onResolve: (status: CaseStatus) => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <div className="modal-head"><div><div className="eyebrow"><i className="eyebrow-line" /> CASE {item.id}</div><h2 id="review-title" style={{ marginTop: 9 }}>Review verification</h2><p>Decision actions are recorded in the audit trail.</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><X size={15} /></button></div>
      <div className="review-profile"><span className="applicant-avatar">{item.initials}</span><div><strong>{item.name}</strong><span>{item.kind} · {item.flag} {item.country}</span></div><Risk level={item.risk} /></div>
      <div className="case-detail-block"><div className="case-detail-title">Approved attributes & verification result</div><div className="review-checks">{item.checks.map((check) => <div className="review-check" key={check}><span>{check}</span><span><CheckCircle2 size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />Complete</span></div>)}</div><div className="case-result-row"><span>Current result</span><StatusPill status={item.status} /></div></div>
      <div className="case-timeline"><div className="case-detail-title">Case timeline · {item.owner}</div><div><i/><span><strong>Request submitted</strong><small>{item.submitted} · {item.id}</small></span></div><div><i/><span><strong>Provider checks completed</strong><small>Document, liveness, and screening signals</small></span></div><div><i/><span><strong>Customer-approved proof</strong><small>Scoped attributes only · audit event recorded</small></span></div></div>
      <p className="form-hint">Synthetic review data. Source identity documents are not displayed in this demo.</p>
      <div className="modal-actions" style={{ justifyContent: "space-between" }}><button className="button" type="button" onClick={() => onResolve("Escalated")}><CircleAlert size={13} /> Escalate</button><div style={{ display: "flex", gap: 8 }}><button className="button" type="button" onClick={() => onResolve("Queued")}>Request resubmission</button><button className="button" type="button" onClick={() => onResolve("Rejected")}>Reject</button><button className="button primary" type="button" onClick={() => onResolve("Approved")}><Check size={13} /> Approve</button></div></div>
    </section>
  </div>;
}

