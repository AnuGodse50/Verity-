"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowDownToLine, CheckCircle2, Clock3, Search, ShieldAlert } from "lucide-react";

const categories = [
  { name:"Authentication", events:["user.login","mfa.enrolled","mfa.verified","session.revoked","login.failed","account.locked"] },
  { name:"Case lifecycle", events:["case.created","case.submitted","case.reviewed","case.approved","case.rejected","case.resubmitted","case.expired","case.reverification_required"] },
  { name:"Consent", events:["consent.requested","consent.approved","consent.rejected","consent.revoked","consent.attribute_selected","renewable_consent.cancelled"] },
  { name:"Proof", events:["proof.issued","proof.redeemed","proof.expired","proof.replay_blocked"] },
  { name:"Evidence", events:["evidence.uploaded","evidence.viewed","evidence.accessed","evidence.exported","evidence.deleted"] },
  { name:"Review", events:["case.assigned","case.escalated","override.requested","override.approved","appeal.created","appeal.resolved"] },
  { name:"Policy", events:["policy.created","policy.updated","policy.approved","policy.version_activated"] },
  { name:"Administration", events:["tenant.created","user.invited","role.assigned","role.revoked","provider.configured"] },
  { name:"Webhook / integration", events:["webhook.received","webhook.signature_failed","webhook.replay_blocked","webhook.delivered","webhook.failed"] },
  { name:"Security", events:["rate_limit.triggered","anomaly.detected","suspicious_login","data_export","cross_region_access_attempt"] },
];

const feed = [
  { event:"proof.redeemed", category:"Proof", actor:"Northstar Bank · ops-184", target:"CASE-92841 · proof ref PRF-72A1", region:"India · Mumbai", time:"Today, 10:42:18", result:"Success" },
  { event:"case.escalated", category:"Review", actor:"Maya Rao · analyst-024", target:"CASE-92838 · screening match", region:"United States · Virginia", time:"Today, 10:38:04", result:"Success" },
  { event:"consent.attribute_selected", category:"Consent", actor:"Customer · pseudonymous ID C-91F2", target:"REQ-77309 · address + age", region:"United Kingdom · London", time:"Today, 10:31:47", result:"Success" },
  { event:"webhook.signature_failed", category:"Webhook / integration", actor:"Provider adapter · Sumsub EU", target:"Delivery WH-44982", region:"EU · Frankfurt", time:"Today, 10:28:12", result:"Blocked" },
  { event:"cross_region_access_attempt", category:"Security", actor:"Service principal · svc-kyc-08", target:"Resource REF-2B88 · denied", region:"EU → US", time:"Today, 10:21:33", result:"Blocked" },
  { event:"policy.version_activated", category:"Policy", actor:"Compliance manager · mgr-019", target:"India Individual KYC · v2.6", region:"India · Mumbai", time:"Today, 10:16:05", result:"Success" },
];

export function AuditDashboard() {
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("All categories");
  const filtered = useMemo(()=>feed.filter((item)=>(category==="All categories"||item.category===category)&&(`${item.event} ${item.actor} ${item.target} ${item.region}`.toLowerCase().includes(query.toLowerCase()))),[category,query]);
  const eventCount=categories.reduce((sum,item)=>sum+item.events.length,0);
  return <div className="audit-dashboard">
    <header className="workspace-heading"><div><div className="eyebrow"><i className="eyebrow-line"/>ASSURANCE & EVIDENCE</div><h1>Audit events, with full context.</h1><p>Search security, identity, consent, and administration events across your compliance workspace.</p></div><span className="date-stamp">IMMUTABLE · APPEND-ONLY LOG</span></header>
    <section className="audit-summary"><div><span className="customer-card-icon green"><Activity size={17}/></span><span><small>Event types cataloged</small><strong>{eventCount}</strong></span></div><div><span className="customer-card-icon pearl"><Clock3 size={17}/></span><span><small>Events · last 24 hours</small><strong>8,421</strong></span></div><div><span className="customer-card-icon amber"><ShieldAlert size={17}/></span><span><small>Security blocks · last 24 hours</small><strong>03</strong></span></div><span className="audit-append"><CheckCircle2 size={13}/> Append-only trail active</span></section>
    <section className="panel audit-feed-panel"><header className="panel-head"><div><h2 className="panel-title">Recent audit activity</h2><div className="panel-subtitle">Synthetic sample events · identifiers are pseudonymous</div></div><button className="button small" type="button" onClick={()=>window.alert("Demo only: export is disabled for synthetic audit data.")}><ArrowDownToLine size={13}/> Export</button></header>
      <div className="audit-toolbar"><label className="search-box"><Search size={13}/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search event, actor, case, or region" aria-label="Search audit events"/></label><select className="audit-select" value={category} onChange={(event)=>setCategory(event.target.value)} aria-label="Filter by event category"><option>All categories</option>{categories.map((item)=><option key={item.name}>{item.name}</option>)}</select></div>
      <div className="audit-table-wrap"><table className="audit-table"><thead><tr><th>Event</th><th>Actor</th><th>Target</th><th>Region</th><th>Timestamp</th><th>Result</th></tr></thead><tbody>{filtered.map((item,index)=><tr key={item.event+item.time}><td><span className="audit-event-name">{item.event}</span><small>{item.category}</small></td><td>{item.actor}</td><td>{item.target}</td><td>{item.region}</td><td>{item.time}</td><td><span className={"audit-result "+(item.result==="Blocked"?"blocked":"")}>{item.result}</span></td></tr>)}{filtered.length===0&&<tr><td colSpan={6} className="audit-empty">No sample events match your search.</td></tr>}</tbody></table></div>
    </section>
    <section className="audit-catalog-head"><div><div className="eyebrow"><i className="eyebrow-line"/>EVENT TAXONOMY</div><h2>Cataloged event types</h2><p>Complete event coverage for audit, investigations, and incident response.</p></div><span>{categories.length} categories · {eventCount} event types</span></section>
    <section className="audit-category-grid">{categories.map((item)=><article className="audit-category-card" key={item.name}><div><h3>{item.name}</h3><span>{item.events.length.toString().padStart(2,"0")}</span></div><ul>{item.events.map((event)=><li key={event}><code>{event}</code></li>)}</ul></article>)}</section>
    <footer className="audit-note"><ShieldAlert size={14}/><span>Audit integrity</span><p>Production logs should be tamper-evident, access-controlled, retained according to policy, and redacted to avoid unnecessary PII.</p></footer>
  </div>;
}
