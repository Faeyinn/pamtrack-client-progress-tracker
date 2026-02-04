import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const artifacts = await prisma.discussionArtifact.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: "desc" },
    });

    const payload = artifacts.map((a) => ({
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
      fileUrl: a.fileData ? `/api/track/${token}/artifacts/${a.id}/file` : null,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Track artifacts error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
