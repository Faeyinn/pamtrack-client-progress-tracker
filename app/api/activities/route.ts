import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";

export async function GET() {
  try {
    await requireAdminSession();

    const logs = await prisma.projectLog.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: {
          select: {
            projectName: true,
            clientName: true,
            status: true,
          },
        },
      },
    });

    // Also fetch recent completed projects to mix into activity?
    // For now let's just use logs as they represent "activity".
    // Most actions (update progress) create a log.
    // Project creation doesn't create a log by default unless we check 'createdAt' of project.
    // Let's stick to ProjectLog for simplicity as requested "Log Aktivitas".

    return NextResponse.json(logs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "UNAUTHORIZED") {
      const response = NextResponse.json(
        { message: "Sesi kadaluarsa" },
        { status: 401 },
      );
      response.cookies.delete("admin_session");
      return response;
    }

    console.error("Get activities error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data aktivitas" },
      { status: 500 },
    );
  }
}
