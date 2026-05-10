"use client";

import { Prompt } from "@prisma/client";
import { useState, useMemo } from "react";
import PromptCard from "./prompt-card";

interface PromptListProps {
  prompts: Prompt[];
  userId?: string;
}

export default function PromptList({ prompts, userId }: PromptListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "title" | "category">("date");

  // Alle einzigartigen Kategorien extrahieren
  const categories = useMemo(() => {
    const cats = prompts.map((p) => p.category).filter(Boolean);
    return ["all", ...Array.from(new Set(cats))];
  }, [prompts]);

  // Gefilterte und sortierte Prompts
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    // Suche (Volltext über Titel, Beschreibung, Content)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query)
      );
    }

    // Kategorie-Filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Favoriten-Filter
    if (showFavoritesOnly) {
      result = result.filter((p) => p.isFavorite);
    }

    // Sortierung
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [prompts, searchQuery, selectedCategory, showFavoritesOnly, sortBy]);

  if (prompts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Noch keine Prompts
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {userId
            ? "Erstelle deinen ersten Prompt und baue deine Bibliothek auf!"
            : "Melde dich an, um Prompts zu erstellen."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Such- und Filter-Leiste */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-4">
        {/* Suchleiste */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Suche Prompts (Titel, Beschreibung, Inhalt)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter-Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Kategorie-Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Kategorie:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Alle Kategorien" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Favoriten-Filter */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              showFavoritesOnly
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            <span>{showFavoritesOnly ? "⭐" : "☆"}</span>
            <span>Nur Favoriten</span>
          </button>

          {/* Sortierung */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Sortieren:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "title" | "category")}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Neueste zuerst</option>
              <option value="title">Titel (A-Z)</option>
              <option value="category">Kategorie</option>
            </select>
          </div>
        </div>

        {/* Ergebnis-Anzeige */}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {filteredPrompts.length} von {prompts.length} Prompts angezeigt
          {(searchQuery || selectedCategory !== "all" || showFavoritesOnly) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setShowFavoritesOnly(false);
              }}
              className="ml-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      {/* Prompt Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
            Keine Prompts gefunden
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Passe deine Suche oder Filter an, um mehr Ergebnisse zu sehen.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}
