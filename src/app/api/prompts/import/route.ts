import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface ImportPrompt {
  id?: string;
  title: string;
  description?: string | null;
  content: string;
  category?: string | null;
  tags?: string | null;
  isFavorite?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.prompts || !Array.isArray(body.prompts)) {
      return NextResponse.json(
        { error: "Ungültiges Format: 'prompts' Array fehlt" },
        { status: 400 }
      );
    }

    const importPrompts = body.prompts as ImportPrompt[];
    const results = {
      success: [] as string[],
      skipped: [] as string[],
      errors: [] as { title: string; error: string }[],
    };

    for (const promptData of importPrompts) {
      try {
        // Prüfen ob Prompt mit gleicher ID oder gleichem Titel bereits existiert
        const existingById = promptData.id 
          ? await prisma.prompt.findUnique({ where: { id: promptData.id } })
          : null;
        
        const existingByTitle = await prisma.prompt.findFirst({
          where: {
            userId: session.user.id,
            title: promptData.title,
          },
        });

        const existing = existingById || existingByTitle;

        if (existing) {
          results.skipped.push(promptData.title);
          continue;
        }

        // Neuen Prompt erstellen
        const created = await prisma.prompt.create({
          data: {
            userId: session.user.id,
            title: promptData.title,
            description: promptData.description,
            content: promptData.content,
            category: promptData.category,
            tags: promptData.tags,
            isFavorite: promptData.isFavorite ?? false,
            isPublic: promptData.isPublic ?? false,
          },
        });

        results.success.push(promptData.title);
      } catch (error: any) {
        results.errors.push({
          title: promptData.title || "Unbekannt",
          error: error.message || "Unbekannter Fehler",
        });
      }
    }

    return NextResponse.json({
      message: "Import abgeschlossen",
      results,
    });
  } catch (error: any) {
    console.error("Error importing prompts:", error);
    return NextResponse.json(
      { error: `Fehler beim Importieren: ${error.message}` },
      { status: 500 }
    );
  }
}
