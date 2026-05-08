import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single prompt
export async function GET(request: Request, { params }: RouteParams) {
  try {
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
    const { id } = await params;
    const body = await request.json();
    const { title, description, content, category, tags, isFavorite } = body;

    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        title,
        description,
        content,
        category,
        tags,
        isFavorite,
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
    const { id } = await params;
    
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
