import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json(
        { message: "Token wajib diisi" },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
    });

    if (project) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json(
        { valid: false, message: "Token tidak valid" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Validate token error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

