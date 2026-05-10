"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import ExportImportModal from "./export-import-modal";

export default function ExportImportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
      >
        <Database className="w-4 h-4" />
        Export/Import
      </button>

      {isModalOpen && (
        <ExportImportModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
