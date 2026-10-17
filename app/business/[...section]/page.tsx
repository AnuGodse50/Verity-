import { WorkspaceView } from "@/components/workspace/workspace-view";
export default async function BusinessSection({ params }: { params: Promise<{section:string[]}> }) { const {section}=await params; return <WorkspaceView kind="business" section={section.join("/")} />; }
