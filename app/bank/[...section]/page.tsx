import { WorkspaceView } from "@/components/workspace/workspace-view";
export default async function BankSection({ params }: { params: Promise<{section:string[]}> }) { const {section}=await params; return <WorkspaceView kind="bank" section={section.join("/")} />; }
