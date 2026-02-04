import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; imageId: string }> },
) {
  try {
    const { token, imageId } = await params;

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
      select: { id: true },
    });

    if (!project) {
      return new Response("Not found", { status: 404 });
    }

    const image = await prisma.progressUpdateImage.findFirst({
      where: {
        id: imageId,
        progressUpdate: { projectId: project.id },
      },
      select: { fileUrl: true, mimeType: true, fileName: true },
    });

    if (!image) {
      return new Response("Not found", { status: 404 });
    }

    if (!image.fileUrl) {
      return new Response("Not found", { status: 404 });
    }

    const upstream = await fetch(image.fileUrl);

    if (!upstream.ok) {
      return new Response("Not found", { status: 404 });
    }

    const contentType =
      upstream.headers.get("content-type") || image.mimeType || "image/*";

    return new Response(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename=\"${image.fileName || "image"}\"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Track update image error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
