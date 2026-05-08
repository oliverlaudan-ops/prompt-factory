"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import CreatePromptModal from "./create-prompt-modal";

export default function CreatePromptButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Neuer Prompt
      </button>

      {session && <CreatePromptModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
