import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    console.log("[API] GET /api/projects/[id]/feedbacks HIT");
    await requireAdminSession();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    console.log(`[API] Fetching feedbacks for project: ${id}`);

    const feedbacks = await prisma.clientFeedback.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
