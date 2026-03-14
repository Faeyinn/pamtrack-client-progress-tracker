import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";
import { isArtifactType, isProjectPhase } from "@/lib/project-phase";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; artifactId: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId, artifactId } = await params;
    const body = await request.json().catch(() => ({}));

    const title =
      typeof body?.title === "string" ? body.title.trim() : undefined;
    const description =
      typeof body?.description === "string"
        ? body.description.trim()
        : undefined;
    const phase = typeof body?.phase === "string" ? body.phase : undefined;
    const type = typeof body?.type === "string" ? body.type : undefined;

    if (phase !== undefined && !isProjectPhase(phase)) {
      return NextResponse.json({ message: "Invalid phase" }, { status: 400 });
    }

    if (type !== undefined && type !== "" && !isArtifactType(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const updated = await prisma.discussionArtifact.update({
      where: { id: artifactId, projectId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined
          ? { description: description || null }
          : {}),
        ...(phase !== undefined ? { phase } : {}),
        ...(type !== undefined ? { type: type || null } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Update artifact error:", error);
    return NextResponse.json(
      { message: "Failed to update artifact" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; artifactId: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId, artifactId } = await params;

    // 1. Fetch the artifact first to get the URL
    const artifact = await prisma.discussionArtifact.findUnique({
      where: { id: artifactId, projectId },
    });

    if (!artifact) {
      return NextResponse.json(
        { message: "Artifact not found" },
        { status: 404 },
      );
    }

    if (artifact.fileName && artifact.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(
          artifact.cloudinaryPublicId,
          artifact.mimeType,
        );
      } catch (err) {
        console.error("Error finding/deleting file from storage:", err);
      }
    }

    await prisma.discussionArtifact.delete({
      where: { id: artifactId, projectId },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete artifact error:", error);
    return NextResponse.json(
      { message: "Failed to delete artifact" },
      { status: 500 },
    );
  }
}
