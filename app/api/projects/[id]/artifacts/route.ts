import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/admin";
import { isArtifactType, isProjectPhase } from "@/lib/project-phase";
import { supabase } from "@/lib/supabase";
import type {
  ArtifactType as PrismaArtifactType,
  ProjectPhase as PrismaProjectPhase,
} from "@prisma/client";

function isHttpUrl(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId } = await params;

    const artifacts = await prisma.discussionArtifact.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    const payload = artifacts.map((a) => {
      // Logic to determine file URL:
      // 1. If we have fileData (legacy), use the API endpoint.
      // 2. If we have fileName AND sourceLinkUrl (new), use sourceLinkUrl (Supabase).
      let fileUrl = null;
      if (a.fileData) {
        fileUrl = `/api/projects/${projectId}/artifacts/${a.id}/file`;
      } else if (a.fileName && a.sourceLinkUrl) {
        fileUrl = a.sourceLinkUrl;
      }

      // Logic to determine "Source Link" (External Link):
      // Only if it's NOT a file (no fileName).
      const sourceLinkUrl = !a.fileName ? a.sourceLinkUrl : null;

      return {
        id: a.id,
        projectId: a.projectId,
        title: a.title,
        description: a.description,
        phase: a.phase,
        type: a.type,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        sourceLinkUrl: sourceLinkUrl,
        fileName: a.fileName,
        mimeType: a.mimeType,
        fileSize: a.fileSize,
        fileUrl: fileUrl,
      };
    });

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Get artifacts error:", error);
    return NextResponse.json(
      { message: "Failed to fetch artifacts" },
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

    let title = "";
    let description: string | null = null;
    let phase: string | null = null;
    let type: string | null = null;
    let sourceLinkUrl: string | null = null;
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      title =
        typeof form.get("title") === "string" ? String(form.get("title")) : "";
      description =
        typeof form.get("description") === "string"
          ? String(form.get("description"))
          : null;
      phase =
        typeof form.get("phase") === "string"
          ? String(form.get("phase"))
          : null;
      type =
        typeof form.get("type") === "string" ? String(form.get("type")) : null;
      sourceLinkUrl =
        typeof form.get("sourceLinkUrl") === "string"
          ? String(form.get("sourceLinkUrl"))
          : null;
      const maybeFile = form.get("file");
      file = maybeFile instanceof File ? maybeFile : null;
    } else {
      const body = await request.json().catch(() => ({}));
      title = typeof body?.title === "string" ? body.title : "";
      description =
        typeof body?.description === "string" ? body.description : null;
      phase = typeof body?.phase === "string" ? body.phase : null;
      type = typeof body?.type === "string" ? body.type : null;
      sourceLinkUrl =
        typeof body?.sourceLinkUrl === "string" ? body.sourceLinkUrl : null;
    }

    if (!title.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }

    if (!phase || !isProjectPhase(phase)) {
      return NextResponse.json(
        { message: "Valid project phase is required" },
        { status: 400 },
      );
    }

    if (type && !isArtifactType(type)) {
      return NextResponse.json(
        { message: "Invalid artifact type" },
        { status: 400 },
      );
    }

    const phaseValue = phase as PrismaProjectPhase;
    const typeValue =
      type && isArtifactType(type) ? (type as PrismaArtifactType) : null;

    const hasFile = Boolean(file && file.size > 0);
    const hasLink = Boolean(sourceLinkUrl && isHttpUrl(sourceLinkUrl));

    if (!hasFile && !hasLink) {
      return NextResponse.json(
        { message: "Provide either a file upload or a valid link URL" },
        { status: 400 },
      );
    }

    let storagePublicUrl: string | null = null;

    // Supabase Storage Upload
    if (hasFile && file) {
      const fileBuffer = await file.arrayBuffer();
      const fileName = `${projectId}/docs/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

      const { error: uploadError } = await supabase.storage
        .from("project-assets")
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase artifact upload error:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload file to storage" },
          { status: 500 },
        );
      }

      const { data } = supabase.storage
        .from("project-assets")
        .getPublicUrl(fileName);
      storagePublicUrl = data.publicUrl;
    }

    const created = await prisma.discussionArtifact.create({
      data: {
        projectId,
        title: title.trim(),
        description: description?.trim() || null,
        phase: phaseValue,
        type: typeValue,
        // If it's a file, we store the Supabase URL in sourceLinkUrl to avoid schema changes for now.
        // If it's a link, we store the link.
        sourceLinkUrl: hasFile
          ? storagePublicUrl
          : hasLink
            ? sourceLinkUrl
            : null,

        // Metadata
        fileName: hasFile ? file?.name : null,
        mimeType: hasFile ? file?.type : null,
        fileSize: hasFile ? file?.size : null,
        fileData: null, // No longer storing BLOB
      },
    });

    // Construct response payload to match GET logic
    let fileUrl = null;
    let responseLinkUrl = null;

    if (created.fileName && created.sourceLinkUrl) {
      fileUrl = created.sourceLinkUrl;
    } else {
      responseLinkUrl = created.sourceLinkUrl;
    }

    return NextResponse.json(
      {
        id: created.id,
        projectId: created.projectId,
        title: created.title,
        description: created.description,
        phase: created.phase,
        type: created.type,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        sourceLinkUrl: responseLinkUrl,
        fileName: created.fileName,
        mimeType: created.mimeType,
        fileSize: created.fileSize,
        fileUrl: fileUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Create artifact error:", error);
    return NextResponse.json(
      { message: "Failed to create artifact" },
      { status: 500 },
    );
  }
}
