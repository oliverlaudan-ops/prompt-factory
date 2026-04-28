import { prisma } from "@/lib/prisma";
import PromptList from "@/components/prompt-list";
import CreatePromptButton from "@/components/create-prompt-button";

async function getPrompts() {
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: "desc" },
  });
  return prompts;
}

export default async function Home() {
  const prompts = await getPrompts();

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
                Deine persönliche Prompt-Bibliothek
              </p>
            </div>
            <CreatePromptButton />
          </div>
        </header>

        <PromptList prompts={prompts} />
      </div>
    </main>
  );
}
