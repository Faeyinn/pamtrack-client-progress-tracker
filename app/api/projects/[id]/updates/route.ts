import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";
import { isProjectPhase } from "@/lib/project-phase";
import { supabase } from "@/lib/supabase";
import type { ProjectPhase as PrismaProjectPhase } from "@prisma/client";

type IncomingLink = { label: string; url: string };

function isHttpUrl(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId } = await params;

    const updates = await prisma.progressUpdate.findMany({
      where: { projectId },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        links: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const payload = updates.map((u) => ({
      id: u.id,
      projectId: u.projectId,
      description: u.description,
      phase: u.phase,
      createdAt: u.createdAt,
      images: u.images.map((img) => ({
        id: img.id,
        url: img.fileUrl,
        fileName: img.fileName,
        mimeType: img.mimeType,
      })),
      links: u.links.map((l) => ({ id: l.id, label: l.label, url: l.url })),
    }));

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Get updates error:", error);
    return NextResponse.json(
      { message: "Failed to fetch updates" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId } = await params;

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Use multipart/form-data" },
        { status: 400 },
      );
    }

    const form = await request.formData();
    const description =
      typeof form.get("description") === "string"
        ? String(form.get("description")).trim()
        : "";
    const phaseRaw =
      typeof form.get("phase") === "string" ? String(form.get("phase")) : "";

    const linksRaw =
      typeof form.get("links") === "string" ? String(form.get("links")) : "[]";
    let links: IncomingLink[] = [];
    try {
      const parsed = JSON.parse(linksRaw);
      if (Array.isArray(parsed)) {
        links = parsed
          .filter((x): x is Record<string, unknown> => isRecord(x))
          .map((x) => ({
            label: typeof x.label === "string" ? x.label : "Link",
            url: typeof x.url === "string" ? x.url : "",
          }))
          .filter((l) => l.label.trim() && isHttpUrl(l.url));
      }
    } catch {
      links = [];
    }

    const phase = phaseRaw ? phaseRaw : null;
    if (phase && !isProjectPhase(phase)) {
      return NextResponse.json({ message: "Invalid phase" }, { status: 400 });
    }

    const phaseValue = (phase as PrismaProjectPhase) || "DEVELOPMENT";

    if (!description) {
      return NextResponse.json(
        { message: "Description is required" },
        { status: 400 },
      );
    }

    const imageFiles = form
      .getAll("images")
      .filter((x): x is File => x instanceof File && x.size > 0);

    // Upload images to Supabase first
    const uploadedImages = await Promise.all(
      imageFiles.map(async (f, index) => {
        const fileBuffer = await f.arrayBuffer();
        const fileName = `${projectId}/${Date.now()}-${f.name.replace(/\s+/g, "-")}`;

        const { error: uploadError } = await supabase.storage
          .from("project-assets")
          .upload(fileName, fileBuffer, {
            contentType: f.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw new Error("Gagal mengupload gambar ke storage");
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("project-assets").getPublicUrl(fileName);

        return {
          fileName: f.name,
          mimeType: f.type,
          fileSize: f.size,
          fileUrl: publicUrl,
          sortOrder: index,
        };
      }),
    );

    const created = await prisma.progressUpdate.create({
      data: {
        projectId,
        description,
        phase: phaseValue,
        links: {
          create: links.map((l) => ({ label: l.label.trim(), url: l.url })),
        },
        images: {
          create: uploadedImages,
        },
      },
      include: { images: { orderBy: { sortOrder: "asc" } }, links: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        projectId: created.projectId,
        description: created.description,
        phase: created.phase,
        createdAt: created.createdAt,
        images: created.images.map((img) => ({
          id: img.id,
          url: img.fileUrl,
          fileName: img.fileName,
          mimeType: img.mimeType,
        })),
        links: created.links.map((l) => ({
          id: l.id,
          label: l.label,
          url: l.url,
        })),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Create update error:", error);
    return NextResponse.json(
      { message: "Failed to create update" },
      { status: 500 },
    );
  }
}
