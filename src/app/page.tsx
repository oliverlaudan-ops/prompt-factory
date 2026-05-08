import { prisma } from "@/lib/prisma";
import PromptList from "@/components/prompt-list";
import CreatePromptButton from "@/components/create-prompt-button";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/lib/auth";
import Link from "next/link";

async function getPrompts(userId?: string) {
  noStore(); // Disable caching for this data fetch
  
  if (userId) {
    // Logged in: show only user's own prompts
    const prompts = await prisma.prompt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return prompts;
  }
  
  // Not logged in: show public prompts only
  const prompts = await prisma.prompt.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
  });
  return prompts;
}

export default async function Home() {
  const session = await auth();
  const prompts = await getPrompts(session?.user?.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prompt Factory
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {session 
                  ? `Willkommen zurück, ${session.user.name || session.user.email}!` 
                  : "Deine persönliche Prompt-Bibliothek"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <Link
                  href="/api/auth/signout"
                  className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Abmelden
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Anmelden
                </Link>
              )}
              <CreatePromptButton />
            </div>
          </div>
        </header>

        {!session && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300">
              📢 <strong>Hinweis:</strong> Melde dich an, um deine eigene Prompt-Bibliothek zu verwalten. 
              Ohne Login siehst du nur öffentliche Prompts.
            </p>
          </div>
        )}

        <PromptList prompts={prompts} userId={session?.user?.id} />
      </div>
    </main>
  );
}
