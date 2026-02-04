import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; artifactId: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId, artifactId } = await params;

    const artifact = await prisma.discussionArtifact.findFirst({
      where: { id: artifactId, projectId },
      select: { fileData: true, mimeType: true, fileName: true },
    });

    if (!artifact || !artifact.fileData) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(artifact.fileData, {
      headers: {
        "Content-Type": artifact.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename=\"${artifact.fileName || "artifact"}\"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return new Response("Unauthorized", { status: 401 });
    }
    console.error("Artifact file error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
