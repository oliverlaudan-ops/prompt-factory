# Prompt Factory 🦄

Eine moderne Web-App zur Verwaltung deiner Prompt-Bibliothek.

## Features

- ✅ Prompts erstellen, bearbeiten und löschen
- ✅ Kategorisierung und Tags
- ✅ Favoriten-Funktion
- ✅ Suche und Filter (Coming Soon)
- ✅ Copy-to-Clipboard
- ✅ Responsive Design
- ✅ Dark Mode Support

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite mit Prisma ORM
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deploy:** Vercel-ready

## Installation

```bash
# Dependencies installieren
npm install

# Datenbank migrieren
npx prisma db push

# Development Server starten
npm run dev
```

Die App ist dann unter http://localhost:3000 verfügbar.

## Umgebung

Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
DATABASE_URL="file:./prisma/dev.db"
```

## Projektstruktur

```
prompt-factory/
├── prisma/
│   └── schema.prisma      # Datenbank-Schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── prompts/   # API Routes
│   │   └── page.tsx       # Hauptseite
│   ├── components/        # React Components
│   └── lib/              # Utilities
└── README.md
```

## Development

```bash
# Prisma Studio öffnen (DB Browser)
npx prisma studio

# Schema ändern und DB updaten
# 1. schema.prisma bearbeiten
# 2. npx prisma db push
```

## Roadmap

- [ ] Suchfunktion implementieren
- [ ] Filter nach Kategorie/Tags
- [ ] Prompt exportieren/importieren (JSON)
- [ ] Authentication (optional)
- [ ] Prompt-Varianten / Versioning
- [ ] API-Integrationen (Ollama, OpenAI, etc.)
- [ ] Sharing-Funktionen

## License

MIT - Feel free to use for your own prompt library!

---

Built with ❤️ by Viv & DrBoskonovic
