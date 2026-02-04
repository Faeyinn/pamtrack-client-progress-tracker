import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppFonnte } from "@/lib/whatsapp";
import { requireAdminSession } from "@/lib/api/admin";

type ProjectWithLatestLog = {
  id: string;
  clientName: string;
  clientPhone: string;
  projectName: string;
  uniqueToken: string;
  deadline: Date;
  status: string;
  currentPhase: "DEVELOPMENT" | "MAINTENANCE";
  developmentProgress: number;
  maintenanceProgress: number;
  developmentCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  logs: Array<{ percentage: number }>;
};

function normalizePhone(input: string): string {
  let phone = input.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "62" + phone.slice(1);
  if (!phone.startsWith("62")) phone = "62" + phone;
  return phone;
}

function isValidIndoWhatsApp(phone: string): boolean {
  return /^62\d{8,15}$/.test(phone);
}

export async function GET() {
  try {
    await requireAdminSession();
    const projects = (await prisma.project.findMany({
      include: {
        logs: {
          orderBy: [{ createdAt: "desc" }, { percentage: "desc" }],
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    })) as ProjectWithLatestLog[];

    const projectsWithProgress = projects.map(
      (project: ProjectWithLatestLog) => {
        const progress = project.logs[0]?.percentage || 0;
        // Ensure status is consistent with progress, handling existing data issues
        const status = progress === 100 ? "Done" : project.status;

        return {
          ...project,
          progress,
          status,
          currentPhase: project.currentPhase,
          developmentProgress: project.developmentProgress,
          maintenanceProgress: project.maintenanceProgress,
          developmentCompletedAt: project.developmentCompletedAt,
        };
      },
    );

    return NextResponse.json(projectsWithProgress);
  } catch (error: unknown) {
    const errorObject =
      typeof error === "object" && error !== null
        ? (error as Record<string, unknown>)
        : null;

    const message =
      (errorObject &&
        typeof errorObject.message === "string" &&
        errorObject.message) ||
      (error instanceof Error ? error.message : "Unknown error");

    const stack =
      errorObject && typeof errorObject.stack === "string"
        ? errorObject.stack
        : error instanceof Error
          ? error.stack
          : undefined;

    const code = errorObject ? errorObject.code : undefined;
    const meta = errorObject ? errorObject.meta : undefined;

    console.error("Get projects error details:", {
      message,
      stack,
      code,
      meta,
    });

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Sesi kadaluarsa, silakan login kembali" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Gagal mengambil data proyek", error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = await request.json().catch(() => ({}));

    const clientName =
      typeof body?.clientName === "string"
        ? body.clientName
        : typeof body?.client_name === "string"
          ? body.client_name
          : "";
    const clientPhone =
      typeof body?.clientPhone === "string"
        ? body.clientPhone
        : typeof body?.client_phone === "string"
          ? body.client_phone
          : "";
    const projectName =
      typeof body?.projectName === "string"
        ? body.projectName
        : typeof body?.project_name === "string"
          ? body.project_name
          : "";
    const deadline =
      typeof body?.deadline === "string" || body?.deadline instanceof Date
        ? body.deadline
        : "";

    if (!clientName || !clientPhone || !projectName || !deadline) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    const formattedPhone = normalizePhone(clientPhone);
    if (!isValidIndoWhatsApp(formattedPhone)) {
      return NextResponse.json(
        { message: "Format nomor WhatsApp tidak valid" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        clientName,
        clientPhone: formattedPhone,
        projectName,
        deadline: new Date(deadline),
        status: "On Progress",
      },
    });

    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const magicLink = `${origin}/track/${project.uniqueToken}`;
    const deadlineDate = new Date(deadline);
    const deadlineStr = deadlineDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const message =
      `Halo, *${project.clientName}*! 👋\n\n` +
      `Selamat! Proyek Anda telah terdaftar di sistem *PAM Techno*.\n` +
      `Kami siap membantu mewujudkan ide digital Anda. 🚀\n\n` +
      `📋 **Detail Proyek:**\n` +
      `Nama Proyek: *${project.projectName}*\n` +
      `Deadline: ${deadlineStr}\n\n` +
      `🔗 **Pantau Progres:**\n` +
      `Silakan klik tautan berikut untuk melihat update pengerjaan secara real-time:\n` +
      `${magicLink}\n\n` +
      `Simpan pesan ini untuk kemudahan akses di masa mendatang.\n\n` +
      `Salam,\n` +
      `*PAM Techno Team*`;

    const sendResult = await sendWhatsAppFonnte({
      to: project.clientPhone,
      message,
    });

    if (!sendResult.ok) {
      console.error("WhatsApp magic link send failed:", sendResult);

      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json(
          {
            ...project,
            whatsapp: {
              sent: false,
              error: "Gateway not configured (DEV)",
              debugMessage: message,
            },
          },
          { status: 201 },
        );
      }
    }

    return NextResponse.json(
      {
        ...project,
        whatsapp: { sent: sendResult.ok },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Create project error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Sesi kadaluarsa, silakan login kembali" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Gagal membuat proyek baru" },
      { status: 500 },
    );
  }
}
