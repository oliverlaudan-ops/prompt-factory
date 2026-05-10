"use client";

import { Prompt } from "@prisma/client";
import { useState, useMemo } from "react";
import { X, Copy, Check, Sparkles } from "lucide-react";

interface UsePromptModalProps {
  prompt: Prompt;
  onClose: () => void;
}

export default function UsePromptModal({ prompt, onClose }: UsePromptModalProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Variablen aus Content extrahieren ({{VARIABLE_NAME}} Pattern)
  const extractedVariables = useMemo(() => {
    const matches = prompt.content.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    
    const unique = Array.from(new Set(matches));
    return unique.map(m => m.replace(/[\{\}]/g, '').trim());
  }, [prompt.content]);

  // Content mit Variablen ersetzen
  const applyVariables = () => {
    let content = prompt.content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, value);
    });
    
    setResult(content);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
    setResult(null);
  };

  const allFilled = extractedVariables.every(key => variables[key]?.trim());

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Prompt verwenden
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {prompt.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Variablen-Formular */}
          {extractedVariables.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Variablen ausfüllen ({extractedVariables.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {extractedVariables.map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={variables[key] || ""}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      placeholder={`${key} eingeben...`}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={applyVariables}
                disabled={!allFilled}
                className="mt-4 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
              >
                Prompt generieren
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                ℹ️ Dieser Prompt enthält keine Variablen. Du kannst ihn direkt kopieren.
              </p>
            </div>
          )}

          {/* Ergebnis */}
          {result && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Generierter Prompt
                </h3>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg transition-colors ${
                    copied
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Kopiert!" : "Kopieren"}
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
