import { WorkspaceView } from "@/components/workspace/workspace-view";
export default async function CustomerSection({ params }: { params: Promise<{section:string[]}> }) { const {section}=await params; return <WorkspaceView kind="customer" section={section.join("/")} />; }
