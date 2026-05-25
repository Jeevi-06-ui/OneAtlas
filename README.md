# OneAtlas Runtime Builder

OneAtlas Runtime Builder is a production-grade AI-native runtime application platform built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui-style primitives, Prisma, Neon PostgreSQL, Zustand, Zod, React Hook Form, nanoid, and Lucide React.

It turns app prompts into template-matched runtime schemas, renders those schemas as editable builder interfaces, applies conversational schema mutations, stores version snapshots, supports undo, and creates immutable frozen preview links.

## Setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run db:generate
npm run db:push; npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/oneatlas?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Use a Neon PostgreSQL connection string for `DATABASE_URL`. `NEXT_PUBLIC_APP_URL` is used when generating frozen preview URLs.

## Architecture

```txt
app/
  (marketing)/          Landing and templates experience
  (builder)/            Runtime builder and frozen preview pages
  api/                  Generation, edit, history, undo, preview APIs
components/
  builder/              3-panel builder shell and editing controls
  runtime-renderer/     Schema renderer and component registry
  layout/               Header, footer, container, theme controls
  ui/                   Reusable shadcn/ui-style primitives
data/                   Template and marketing configuration
hooks/                  Reusable client hooks
lib/                    Prisma, validators, API helpers, utilities
prisma/                 Schema, migration SQL, seed script
services/               Matching, schema factory, mutation, preview services
store/                  Zustand slices
types/                  Shared runtime, API, template, mutation types
utils/                  Runtime schema lookup helpers
```

The codebase keeps runtime contracts in `/types`, pure behavior in `/services`, persistence in `/prisma` and `/lib/prisma.ts`, and rendering in `/components/runtime-renderer`.

## Runtime Schema

Runtime schemas are JSON contracts that describe:

- App metadata, theme, sidebar, and navigation
- Sections with layout and column behavior
- Runtime components: metrics, charts, tables, forms, and cards
- Editable props used by the builder sidebars

The renderer uses a component registry pattern in `components/runtime-renderer/component-registry.tsx`, so new runtime component types can be added without turning the renderer into a large switch statement.

## Mutation Engine

Conversational editing is handled by:

- `services/mutation-parser.ts` for rule-based NLP parsing
- `services/mutation-engine.ts` for pure schema mutations
- `POST /api/apps/[id]/edit` for transactional persistence

Supported mutations include:

- `add_field`
- `remove_field`
- `rename_field`
- `reorder_components`
- `update_component_prop`

Every successful persisted edit updates the app, creates a `SchemaVersion`, and writes a `MutationLog` in a single Prisma transaction.

## Preview Snapshot System

`POST /api/apps/[id]/preview` freezes the current schema into `PreviewSnapshot` with a nanoid token and expiry. The preview page at `/preview/[token]` renders the stored schema snapshot, not the live app schema.

Live schema edits never affect existing preview links because snapshots store complete JSON copies.

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/generate` | `POST` | Validate prompt, match template, create app, create initial version |
| `/api/apps/[id]/edit` | `POST` | Parse instruction, mutate schema, version snapshot, log mutation |
| `/api/apps/[id]/history` | `GET` | Return mutation history |
| `/api/apps/[id]/save` | `POST` | Persist manual property edits from the builder |
| `/api/apps/[id]/undo` | `POST` | Restore previous schema snapshot |
| `/api/apps/[id]/preview` | `POST` | Create immutable preview snapshot |
| `/api/preview/[token]` | `GET` | Return frozen preview schema |

## Prisma

Models:

- `Template`
- `App`
- `SchemaVersion`
- `MutationLog`
- `PreviewSnapshot`

Prisma migration SQL lives in `prisma/migrations/20260525000000_init/migration.sql`. The seed script loads six templates from `data/templates.ts`: CRM Workspace, HR Dashboard, Admin Panel, Analytics Workspace, Inventory System, and Support Workspace.

## Trial Alignment (OneAtlas.dev)

This repository targets the **Full Stack** trial workflow:

- Prompt → template match → schema instantiation → builder render
- Conversational mutations with version snapshots, undo, and persisted mutation history
- Frozen preview URLs that do not change when the live schema is edited
- Template-specific runtime experiences via unique `schemaDefaults` per template
- Marketing surfaces: `/`, `/templates`, `/enterprise`, `/security`, `/pricing`, `/docs`, `/blog`, `/support`

Generate with a forced template:

```powershell
curl -X POST http://localhost:3000/api/generate `
  -H "Content-Type: application/json" `
  -d '{\"prompt\":\"Build an admin panel for user access control\",\"templateSlug\":\"admin-panel\"}'
```

## Deployment

1. Create a Neon PostgreSQL database.
2. Add `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` to Vercel.
3. Run `npm run db:migrate` during deployment or from a trusted CI step.
4. Run `npm run db:seed` once for initial templates.
5. Deploy the Next.js app to Vercel.

## Quality Checks

```powershell
npm run lint
npm run build
```

## Future Improvements

- Add authenticated workspaces and team-level template libraries
- Add model-provider adapters for OpenAI, Anthropic, and local routers
- Add visual diffing for schema versions
- Add component drag-and-drop with persisted reorder mutations
- Add export targets for generated app code and workflow automation
