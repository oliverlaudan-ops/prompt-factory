import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const prompts = await prisma.prompt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Export-Format erstellen
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      prompts: prompts.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        content: p.content,
        category: p.category,
        tags: p.tags,
        isFavorite: p.isFavorite,
        isPublic: p.isPublic,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      metadata: {
        totalPrompts: prompts.length,
        favoriteCount: prompts.filter((p) => p.isFavorite).length,
        categories: Array.from(new Set(prompts.map((p) => p.category).filter(Boolean))),
      },
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Error exporting prompts:", error);
    return NextResponse.json(
      { error: "Fehler beim Exportieren" },
      { status: 500 }
    );
  }
}
