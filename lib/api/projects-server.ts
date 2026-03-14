import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";
import { Project } from "@/lib/types/project";

export async function getProjects(): Promise<Project[]> {
  await requireAdminSession();
  const projects = await prisma.project.findMany({
    include: {
      logs: {
        orderBy: [{ createdAt: "desc" }, { percentage: "desc" }],
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return projects.map((project: any) => {
    const progress = project.logs[0]?.percentage || 0;
    // Ensure status is consistent with progress, handling existing data issues
    const status = progress === 100 ? "Done" : project.status;

    return {
      ...project,
      progress,
      status,
      currentPhase: project.currentPhase,
      developmentProgress: project.developmentProgress,
      maintenanceProgress: project.maintenanceProgress,
      developmentCompletedAt: project.developmentCompletedAt,
    };
  });
}
