import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return <main className="auth-page"><div className="auth-top"><Link className="auth-brand" href="/login"><span className="auth-mark"><ShieldAlert size={19} /></span><span><strong>verity</strong><small>PRIVATE IDENTITY</small></span></Link></div><section className="auth-card auth-unauthorized"><span className="auth-card-icon"><ShieldAlert size={19} /></span><span className="auth-eyebrow"><i /> ACCESS CONTROL</span><h1>You don’t have access to this workspace.</h1><p>Your current role does not include permission to view this area. Switch to an authorized demo role to continue.</p><Link className="auth-submit" href="/login">Return to sign in <span>→</span></Link></section></main>;
}
