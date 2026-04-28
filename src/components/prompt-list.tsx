"use client";

import { Prompt } from "@prisma/client";
import PromptCard from "./prompt-card";

interface PromptListProps {
  prompts: Prompt[];
}

export default function PromptList({ prompts }: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Noch keine Prompts
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Erstelle deinen ersten Prompt und baue deine Bibliothek auf!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
