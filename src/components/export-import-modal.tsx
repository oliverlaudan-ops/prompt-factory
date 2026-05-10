"use client";

import { useState } from "react";
import { X, Download, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface ExportImportModalProps {
  onClose: () => void;
}

export default function ExportImportModal({ onClose }: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [importData, setImportData] = useState<string | null>(null);

  // Export herunterladen
  const handleExport = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch("/api/prompts/export");
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Export fehlgeschlagen");
      }

      const data = await response.json();
      
      // JSON als Datei herunterladen
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prompt-factory-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setResult({
        type: "success",
        message: `Export erfolgreich! ${data.prompts.length} Prompts wurden heruntergeladen.`,
      });
    } catch (error: any) {
      setResult({
        type: "error",
        message: error.message || "Export fehlgeschlagen",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Datei-Upload verarbeiten
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.prompts || !Array.isArray(data.prompts)) {
          throw new Error("Ungültiges Format: 'prompts' Array fehlt");
        }

        setImportData(JSON.stringify(data));
        setResult({
          type: "success",
          message: `${data.prompts.length} Prompts zum Importieren bereit.`,
        });
      } catch (error: any) {
        setResult({
          type: "error",
          message: `Ungültige Datei: ${error.message}`,
        });
      }
    };
    reader.readAsText(file);
  };

  // Import durchführen
  const handleImport = async () => {
    if (!importData) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const data = JSON.parse(importData);
      
      const response = await fetch("/api/prompts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Import fehlgeschlagen");
      }

      const summary = [];
      if (result.results.success.length > 0) {
        summary.push(`✅ ${result.results.success.length} importiert`);
      }
      if (result.results.skipped.length > 0) {
        summary.push(`⚠️ ${result.results.skipped.length} übersprungen (existieren bereits)`);
      }
      if (result.results.errors.length > 0) {
        summary.push(`❌ ${result.results.errors.length} Fehler`);
      }

      setResult({
        type: "success",
        message: `Import abgeschlossen! ${summary.join(", ")}`,
      });

      // Nach erfolgreichem Import Seite neu laden
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      setResult({
        type: "error",
        message: error.message || "Import fehlgeschlagen",
      });
    } finally {
      setIsProcessing(false);
    }
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

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Export / Import
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveTab("export");
              setResult(null);
              setImportData(null);
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "export"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button
            onClick={() => {
              setActiveTab("import");
              setResult(null);
              setImportData(null);
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "import"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Import
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "export" ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Backup erstellen
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Lade alle deine Prompts als JSON-Datei herunter. Perfekt für Backups 
                  oder zum Übertragen in ein anderes Konto.
                </p>
              </div>

              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {isProcessing ? "Wird vorbereitet..." : "Export herunterladen"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Prompts importieren
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Wähle eine JSON-Backup-Datei aus. Bereits existierende Prompts 
                  (gleicher Titel) werden übersprungen.
                </p>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  JSON-Datei auswählen
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-slate-100 dark:file:bg-slate-700
                    file:text-slate-700 dark:file:text-slate-300
                    hover:file:bg-slate-200 dark:hover:file:bg-slate-600
                    cursor-pointer"
                />
              </label>

              <button
                onClick={handleImport}
                disabled={!importData || isProcessing}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {isProcessing ? "Wird importiert..." : "Import starten"}
              </button>
            </div>
          )}

          {/* Ergebnis-Anzeige */}
          {result && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                result.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              {result.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                result.type === "success"
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}>
                {result.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
