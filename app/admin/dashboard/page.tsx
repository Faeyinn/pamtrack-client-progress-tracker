import { getProjects } from "@/lib/api/projects-server";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboardPage() {
  const projects = await getProjects();

  return <DashboardClient initialProjects={projects} />;
}
