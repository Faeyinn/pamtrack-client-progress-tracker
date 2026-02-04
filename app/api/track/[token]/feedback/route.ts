import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const resolvedParams = await params;
    const { token } = resolvedParams;
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: "Feedback message is required" },
        { status: 400 },
      );
    }

    // Find the project matching the unique token
    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    // Create the feedback associated with the project
    const feedback = await prisma.clientFeedback.create({
      data: {
        message,
        projectId: project.id,
      },
    });

    return NextResponse.json({
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
