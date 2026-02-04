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

    const updates = await prisma.progressUpdate.findMany({
      where: { projectId: project.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        links: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const payload = updates.map((u) => ({
      id: u.id,
      projectId: u.projectId,
      description: u.description,
      phase: u.phase,
      createdAt: u.createdAt,
      images: u.images.map((img) => ({
        id: img.id,
        url: `/api/track/${token}/updates/images/${img.id}`,
        fileName: img.fileName,
        mimeType: img.mimeType,
      })),
      links: u.links.map((l) => ({ id: l.id, label: l.label, url: l.url })),
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Track updates error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
