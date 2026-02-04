import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; artifactId: string }> },
) {
  try {
    const { token, artifactId } = await params;

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
      select: { id: true },
    });

    if (!project) {
      return new Response("Not found", { status: 404 });
    }

    const artifact = await prisma.discussionArtifact.findFirst({
      where: { id: artifactId, projectId: project.id },
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
    console.error("Track artifact file error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
