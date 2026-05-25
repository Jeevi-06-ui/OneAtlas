# OneAtlas Deployment Guide

This guide covers GitHub upload, Neon PostgreSQL connectivity, and deploying the same Next.js app to **Vercel** (recommended for the frontend) and **Render** (optional alternative). The project structure stays unchanged — only environment variables and build commands differ per host.

## Prerequisites

- GitHub account
- [Neon](https://neon.tech) project with a connection string (you already have `DATABASE_URL` in `.env`)
- Node.js 20+ locally

## 1. Push to GitHub (without breaking the repo)

From the project root:

```powershell
cd D:\ONEATLASFINAL

# Confirm secrets are NOT tracked
git status

# Stage and commit (skip .env — it is gitignored)
git add .
git commit -m "OneAtlas runtime builder: template-driven apps, builder, and APIs"

# Create repo on GitHub (website: New repository → oneatlas-runtime)
# Then connect:
git remote add origin https://github.com/YOUR_USERNAME/oneatlas-runtime.git
git branch -M main
git push -u origin main
```

**Important:** Never commit `.env` or `.env.local`. Only commit `.env.example` with placeholder values.

## 2. Neon database (real-time connectivity)

Your app uses Prisma → Neon over PostgreSQL. The connection string format:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"
```

### Local (already configured)

```powershell
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### After every schema change

```powershell
npm run db:push
npm run db:seed
```

For production, prefer migrations:

```powershell
npm run db:migrate
npm run db:seed
```

Neon stays “live” — each API request (`/api/generate`, `/api/apps/...`) reads/writes through Prisma in real time. No extra Redis is required for the core trial workflow.

## 3. Deploy on Vercel (recommended)

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. **Environment variables** (Production + Preview):

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | Your Neon connection string (use the **pooled** host if available) |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (set after first deploy, then redeploy) |
   | `SESSION_SECRET` | Random string, at least 32 characters (e.g. `openssl rand -base64 32`) |

4. **Build command:** `npm run build` (default)
5. **Install command:** `npm install` (default)
6. Deploy.

### Run migrations on Vercel

Option A — Vercel build hook (add to `package.json` scripts only if you want automated migrate):

```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

Option B — run once from your machine against production Neon:

```powershell
$env:DATABASE_URL="your-neon-url"
npm run db:migrate
npm run db:seed
```

7. Open `https://your-app.vercel.app` → generate an app → confirm builder loads from Neon.

## 4. Deploy on Render (optional)

Render can host the same Next.js app as a **Web Service**.

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service** → Connect GitHub repo.
2. Settings:
   - **Runtime:** Node
   - **Build command:** `npm install && npm run db:generate && npm run build`
   - **Start command:** `npm run start`
   - **Instance:** Free or Starter
3. **Environment** (same as Vercel):

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon connection string |
   | `NEXT_PUBLIC_APP_URL` | `https://your-service.onrender.com` |
   | `NODE_VERSION` | `20` |

4. After first deploy, run migrations against Neon (from local machine or Render shell):

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. Health check path: `/` (default).

> **Note:** You do not need separate Render + Vercel for one app. Pick **one** frontend host (Vercel is faster for Next.js 15). Use Neon as the single database for both if you experiment with both.

## 5. Verify production end-to-end

1. Homepage → **Start Building** → submit prompt → lands on `/builder/[id]`.
2. **Share** → copies builder or preview URL.
3. **Preview** → creates frozen snapshot; open `/preview/[token]`.
4. Table **Add Customer** (etc.) → applies schema mutation via API.
5. **Deploy** → downloads `*-schema-vN.json`.

## 6. Troubleshooting

| Issue | Fix |
| --- | --- |
| `APP_GENERATION_FAILED` | Check `DATABASE_URL` in host env vars; run `db:push` / `db:migrate` |
| Preview URL wrong | Set `NEXT_PUBLIC_APP_URL` to public HTTPS URL and redeploy |
| Build fails on Prisma | Ensure `npm run db:generate` runs before `next build` |
| Empty templates | Run `npm run db:seed` against production Neon |

## 7. What stays the same in the codebase

- No folder restructure required for deploy
- Same `app/`, `api/`, `prisma/`, `services/` layout
- Only env vars and hosting platform config change

See also [README.md](./README.md) for local setup and API routes.
