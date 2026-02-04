import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppFonnte } from "@/lib/whatsapp";
import { requireAdminSession } from "@/lib/api/admin";

function normalizePhone(input: string): string {
  let phone = input.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "62" + phone.slice(1);
  if (!phone.startsWith("62")) phone = "62" + phone;
  return phone;
}

function isValidIndoWhatsApp(phone: string): boolean {
  return /^62\d{8,15}$/.test(phone);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        logs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    const latestLog = project.logs[0];
    if (
      latestLog &&
      latestLog.percentage === 100 &&
      project.status !== "Done"
    ) {
      await prisma.project.update({
        where: { id: project.id },
        data: { status: "Done" },
      });
      project.status = "Done";
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json().catch(() => ({}));

    const clientName =
      typeof body?.clientName === "string" ? body.clientName : undefined;
    const projectName =
      typeof body?.projectName === "string" ? body.projectName : undefined;

    const rawPhone =
      typeof body?.clientPhone === "string"
        ? body.clientPhone
        : typeof body?.client_phone === "string"
          ? body.client_phone
          : undefined;

    const deadline = body?.deadline;
    const status = typeof body?.status === "string" ? body.status : undefined;

    const phoneChanged = Boolean(body?.phoneChanged);
    const sendNotificationToNewPhone = Boolean(
      body?.sendNotificationToNewPhone,
    );

    const normalizedPhone = rawPhone ? normalizePhone(rawPhone) : undefined;
    if (normalizedPhone && !isValidIndoWhatsApp(normalizedPhone)) {
      return NextResponse.json(
        { message: "Format nomor WhatsApp tidak valid" },
        { status: 400 },
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        clientName,
        clientPhone: normalizedPhone,
        projectName,
        deadline: deadline ? new Date(deadline) : undefined,
        status,
      },
    });

    if (
      phoneChanged &&
      sendNotificationToNewPhone &&
      updatedProject.clientPhone
    ) {
      const origin =
        request.headers.get("origin") || new URL(request.url).origin;
      const magicLink = `${origin}/track/${updatedProject.uniqueToken}`;
      const message =
        `Halo, *${updatedProject.clientName}*! 👋\n\n` +
        `Informasi kontak Anda telah berhasil diperbarui di sistem *PAM Techno*.\n\n` +
        `🔗 **Akses Proyek Anda:**\n` +
        `Gunakan tautan berikut untuk tetap memantau progres proyek Anda:\n` +
        `${magicLink}\n\n` +
        `Jika Anda tidak merasa melakukan perubahan ini, silakan hubungi kami segera.\n\n` +
        `Salam,\n` +
        `*PAM Techno Team*`;

      const sendResult = await sendWhatsAppFonnte({
        to: updatedProject.clientPhone,
        message,
      });

      if (!sendResult.ok) {
        console.error("WhatsApp phone-update send failed:", sendResult);
        if (process.env.NODE_ENV !== "production") {
          console.log("DEV_MODE: WhatsApp phone update message:\n" + message);
        }
      }
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 },
    );
  }
}
