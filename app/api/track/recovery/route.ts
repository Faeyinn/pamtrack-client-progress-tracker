import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppFonnte } from "@/lib/whatsapp";

function normalizePhone(input: string): string {
  let phone = input.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "62" + phone.slice(1);
  if (!phone.startsWith("62")) phone = "62" + phone;
  return phone;
}

function isValidIndoWhatsApp(phone: string): boolean {
  // Basic sanity check: 62 + 8..15 digits
  return /^62\d{8,15}$/.test(phone);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawPhone = typeof body?.phone === "string" ? body.phone : "";
    if (!rawPhone) {
      return NextResponse.json(
        { message: "Nomor WhatsApp wajib diisi" },
        { status: 400 },
      );
    }

    const searchPhone = normalizePhone(rawPhone);
    if (!isValidIndoWhatsApp(searchPhone)) {
      return NextResponse.json(
        { message: "Format nomor WhatsApp tidak valid" },
        { status: 400 },
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        clientPhone: searchPhone,
      },
      orderBy: { createdAt: "desc" },
    });

    if (projects.length === 0) {
      // Returning 200 avoids noisy "Failed to load resource" logs for a user-input case.
      return NextResponse.json({
        success: false,
        message: "Nomor WhatsApp tidak terdaftar dalam sistem kami.",
      });
    }

    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const links = projects.map((p) => ({
      projectName: p.projectName,
      url: `${origin}/track/${p.uniqueToken}`,
    }));

    const clientName = projects[0]?.clientName || "";

    // Updated Professional Message Template
    const lines = [
      `Halo, *${clientName ? clientName : "Klien"}*! 👋`,
      "",
      "Berikut adalah tautan untuk memantau progres proyek Anda di *PAM Techno*:",
      "",
      ...links.map((l) => `🔹 *${l.projectName}*\n${l.url}`),
      "",
      "🔒 *Keamanan:* Tautan ini bersifat pribadi. Mohon untuk tidak membagikannya kepada pihak lain.",
      "",
      "Terima kasih telah mempercayakan proyek Anda kepada kami.",
      "",
      "Salam,",
      "*PAM Techno Team*",
    ];
    const message = lines.join("\n");

    const sendResult = await sendWhatsAppFonnte({ to: searchPhone, message });
    if (!sendResult.ok) {
      console.error("WhatsApp recovery send failed:", sendResult);

      // Developer-friendly fallback in non-production or for debugging
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          success: true,
          message:
            "(DEV) WhatsApp gateway belum dikonfigurasi. Link recovery disediakan di response.",
          debug: { phone: searchPhone, links, message },
        });
      }

      return NextResponse.json(
        { message: "Gagal mengirim WhatsApp. Silakan coba lagi." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Link akses telah dikirim ke WhatsApp Anda",
    });
  } catch (error) {
    console.error("Recovery error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
