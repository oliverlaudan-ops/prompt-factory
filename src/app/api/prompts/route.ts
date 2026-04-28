import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, content, category, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Titel und Content sind erforderlich" },
        { status: 400 }
      );
    }

    const prompt = await prisma.prompt.create({
      data: {
        title,
        description: description || null,
        content,
        category: category || null,
        tags: tags || null,
      },
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Prompts" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Prompts" },
      { status: 500 }
    );
  }
}
