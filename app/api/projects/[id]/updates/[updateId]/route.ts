import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; updateId: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId, updateId } = await params;

    await prisma.progressUpdate.delete({
      where: { id: updateId, projectId },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete update error:", error);
    return NextResponse.json({ message: "Failed to delete update" }, { status: 500 });
  }
}
