import { WorkspaceView } from "@/components/workspace/workspace-view";
export default async function ComplianceSection({ params }: { params: Promise<{section:string[]}> }) { const {section}=await params; return <WorkspaceView kind="compliance" section={section.join("/")} />; }
