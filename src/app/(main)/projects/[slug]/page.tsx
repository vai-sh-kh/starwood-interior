import ProjectClient from "./ProjectClient";

export const dynamic = "force-dynamic";

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjectClient params={params} />;
}
