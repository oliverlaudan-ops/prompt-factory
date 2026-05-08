"use client";

import { Prompt } from "@prisma/client";
import { useState } from "react";
import { Copy, Star, StarOff, Edit, Trash2 } from "lucide-react";
import EditPromptModal from "./edit-prompt-modal";

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [isFavorite, setIsFavorite] = useState(prompt.isFavorite);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdatingFavorite) return;
    
    const newFavoriteStatus = !isFavorite;
    setIsUpdatingFavorite(true);
    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt.title,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          tags: prompt.tags,
          isFavorite: newFavoriteStatus,
        }),
      });

      if (response.ok) {
        setIsFavorite(newFavoriteStatus);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(`Fehler beim Markieren als Favorit: ${data.error || "Unbekannter Fehler"}`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Netzwerkfehler - bitte versuche es erneut");
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Möchtest du diesen Prompt wirklich löschen?")) return;

    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Fehler beim Löschen des Prompts");
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      alert("Netzwerkfehler - bitte versuche es erneut");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const tags = prompt.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) || [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {prompt.title}
        </h3>
        <button
          onClick={handleToggleFavorite}
          disabled={isUpdatingFavorite}
          className={`text-slate-400 hover:text-yellow-500 transition-colors ${isUpdatingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isFavorite ? (
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          ) : (
            <StarOff className="w-5 h-5" />
          )}
        </button>
      </div>

      {prompt.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          {prompt.description}
        </p>
      )}

      <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 mb-3">
        <p className="text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap line-clamp-4">
          {prompt.content}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Kopiert!" : "Kopieren"}
          </button>
        <button
          onClick={handleEdit}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
        >
          <Edit className="w-4 h-4" />
          Bearbeiten
        </button>
        </div>
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditPromptModal
          prompt={prompt}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
