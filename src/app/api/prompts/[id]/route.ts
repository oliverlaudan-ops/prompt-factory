import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single prompt
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;
    
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if user has access (owner or public)
    if (prompt.userId !== session?.user?.id && !prompt.isPublic) {
      return NextResponse.json(
        { error: "Kein Zugriff auf diesen Prompt" },
        { status: 403 }
      );
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden des Prompts" },
      { status: 500 }
    );
  }
}

// PUT update prompt
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nicht autorisiert. Bitte melde dich an." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, content, category, tags, isFavorite, isPublic } = body;

    // Check if prompt exists and belongs to user
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      return NextResponse.json(
        { error: "Prompt nicht gefunden" },
        { status: 404 }
      );
    }

    if (existingPrompt.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Keine Berechtigung, diesen Prompt zu bearbeiten" },
        { status: 403 }
      );
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        title,
        description,
        content,
        category,
        tags,
        isFavorite,
        isPublic,
      },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Prompts" },
      { status: 500 }
    );
  }
}

// DELETE prompt
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nicht autorisiert. Bitte melde dich an." },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if prompt exists and belongs to user
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      return NextResponse.json(
        { error: "Prompt nicht gefunden" },
        { status: 404 }
      );
    }

    if (existingPrompt.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Keine Berechtigung, diesen Prompt zu löschen" },
        { status: 403 }
      );
    }
    
    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Prompts" },
      { status: 500 }
    );
  }
}
