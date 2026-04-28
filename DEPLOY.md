# 🚀 Deployment Guide

## Option 1: Vercel (Empfohlen)

### Vorbereitung
```bash
# 1. Repository erstellen (GitHub)
# 2. Code pushen
git init
git add .
git commit -m "Initial commit: Prompt Factory"
git branch -M main
git remote add origin https://github.com/DEIN_USERNAME/prompt-factory.git
git push -u origin main
```

### Auf Vercel deployen
1. Geh zu https://vercel.com
2. Login mit GitHub
3. "Add New Project" → Import your GitHub repo
4. Vercel erkennt Next.js automatisch
5. Deploy klicken!

**Fertig!** Deine App ist jetzt unter `https://prompt-factory.vercel.app` erreichbar (oder custom domain).

### Vorteile Vercel:
- ✅ Kostenlos für Hobby-Projekte
- ✅ Automatische HTTPS/SSL
- ✅ Auto-Deploy bei Git Push
- ✅ Edge Functions verfügbar
- ✅ Keine Server-Wartung

---

## Option 2: PM2 auf VPS (Nur für interne Tests)

```bash
# Production Build erstellen
npm run build

# PM2 installieren (falls nicht vorhanden)
npm install -g pm2

# App starten
pm2 start npm --name "prompt-factory" -- start

# PM2 Setup für Autostart
pm2 startup
pm2 save
```

⚠️ **Nicht empfohlen für öffentlichen Zugriff!** Nur für lokale Tests hinter Firewall/VPN.

---

## Datenbank in Production

Vercel verwendet standardmäßig SQLite im Serverless-Modus. Für Production empfiehlt sich:

- **Vercel Postgres** (einfach, integriert)
- **Neon** (kostenloses Tier, serverless Postgres)
- **Supabase** (kostenloses Tier, vollwertige DB)

Prisma Schema anpassen für Postgres:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Dann: `npx prisma db push` auf der Production-DB ausführen.

---

## Environment Variables auf Vercel

In Vercel Project Settings → Environment Variables:
```
DATABASE_URL=your-vercel-postgres-url
```

**Vercel Postgres erstellen:**
1. Vercel Dashboard → Storage → Create Database → Postgres
2. Database name: `prompt-factory`
3. Connect to your Vercel project
4. `DATABASE_URL` wird automatisch hinzugefügt!
5. In deinem Project: `npx prisma db push` ausführen (über Vercel CLI oder lokal)

### Alternative: Neon (kostenloses Postgres)
1. https://neon.tech → Sign up
2. New Project erstellen
3. Connection String kopieren
4. Als `DATABASE_URL` in Vercel eintragen

---

## Fragen?

Melde dich bei Viv! 🦄
