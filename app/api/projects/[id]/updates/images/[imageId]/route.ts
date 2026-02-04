import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId, imageId } = await params;

    const image = await prisma.progressUpdateImage.findFirst({
      where: {
        id: imageId,
        progressUpdate: { projectId },
      },
      select: { fileUrl: true },
    });

    if (!image) {
      return new Response("Not found", { status: 404 });
    }

    return Response.redirect(image.fileUrl);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return new Response("Unauthorized", { status: 401 });
    }
    console.error("Progress image error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
