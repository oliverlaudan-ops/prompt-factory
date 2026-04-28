"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreatePromptModal from "./create-prompt-modal";

export default function CreatePromptButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Neuer Prompt
      </button>

      <CreatePromptModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
