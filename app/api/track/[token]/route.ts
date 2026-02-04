import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const resolvedParams = await params;
    const { token } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
      include: {
        logs: {
          include: {
            progressUpdate: {
              include: {
                images: { orderBy: { sortOrder: "asc" } },
                links: { orderBy: { createdAt: "asc" } },
              },
            },
          },
          orderBy: [{ createdAt: "desc" }],
        },
        artifacts: {
          orderBy: { createdAt: "desc" },
        },
        updates: {
          orderBy: { createdAt: "desc" },
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            links: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      project: {
        id: project.id,
        clientName: project.clientName,
        clientPhone: project.clientPhone,
        projectName: project.projectName,
        deadline: project.deadline,
        status: project.status,
        uniqueToken: project.uniqueToken,
        createdAt: project.createdAt,
        currentPhase: project.currentPhase,
        developmentProgress: project.developmentProgress,
        maintenanceProgress: project.maintenanceProgress,
      },
      logs: project.logs.map((log) => ({
        id: log.id,
        title: log.title,
        description: log.description,
        percentage: log.percentage,
        createdAt: log.createdAt,
        progressUpdate: log.progressUpdate
          ? {
              ...log.progressUpdate,
              images: log.progressUpdate.images.map((img) => ({
                id: img.id,
                url: img.fileUrl,
                fileName: img.fileName,
                mimeType: img.mimeType,
              })),
              links: log.progressUpdate.links.map((l) => ({
                id: l.id,
                label: l.label,
                url: l.url,
              })),
            }
          : null,
      })),
      artifacts: project.artifacts.map((a) => ({
        id: a.id,
        projectId: a.projectId,
        title: a.title,
        description: a.description,
        phase: a.phase,
        type: a.type,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        sourceLinkUrl: a.sourceLinkUrl,
        fileName: a.fileName,
        mimeType: a.mimeType,
        fileSize: a.fileSize,
        fileUrl: a.fileData
          ? `/api/track/${token}/artifacts/${a.id}/file`
          : null,
      })),
      updates: project.updates.map((u) => ({
        id: u.id,
        projectId: u.projectId,
        description: u.description,
        phase: u.phase,
        createdAt: u.createdAt,
        images: u.images.map((img) => ({
          id: img.id,
          url: img.fileUrl,
          fileName: img.fileName,
          mimeType: img.mimeType,
        })),
        links: u.links.map((l) => ({ id: l.id, label: l.label, url: l.url })),
      })),
    });
  } catch (error) {
    console.error("Error fetching project by token:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
