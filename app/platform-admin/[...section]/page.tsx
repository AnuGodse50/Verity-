import { WorkspaceView } from "@/components/workspace/workspace-view";
export default async function PlatformSection({ params }: { params: Promise<{section:string[]}> }) { const {section}=await params; return <WorkspaceView kind="platform-admin" section={section.join("/")} />; }
