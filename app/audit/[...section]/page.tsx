import { WorkspaceView } from "@/components/workspace/workspace-view";
export default async function AuditSection({ params }: { params: Promise<{section:string[]}> }) { const {section}=await params; return <WorkspaceView kind="audit" section={section.join("/")} />; }
