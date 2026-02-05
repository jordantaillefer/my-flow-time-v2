# My Flow Time v2

## Project structure

Monorepo pnpm with 3 packages:

- `apps/api` - Hono API on Cloudflare Workers + Drizzle ORM + D1
- `apps/web` - React 19 + Vite + shadcn/ui + TanStack Router
- `packages/shared` - Shared types

## Commands

- `pnpm dev` - Start all dev servers in parallel
- `pnpm typecheck` - Typecheck all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format with Prettier

### API

- `pnpm --filter api dev` - Start API dev server (port 8787)
- `pnpm --filter api db:generate` - Generate Drizzle migrations
- `pnpm --filter api db:migrate:local` - Apply migrations locally
- `pnpm --filter api cf-typegen` - Generate Cloudflare Workers types (run after changing wrangler.jsonc)
- `pnpm --filter api test` - Run API tests

### Web

- `pnpm --filter web dev` - Start web dev server (port 5173, proxies /api to 8787)
- `pnpm --filter web build` - Build for production

## Architecture

- **tRPC** for end-to-end type-safe API (endpoint: /api/trpc)
- **Better Auth** for authentication (endpoint: /api/auth)
- **TanStack Router** for file-based routing (src/routes/)
- **shadcn/ui** for UI components (src/components/ui/)
- **React Hook Form + Zod** for forms
- **TanStack Table** for data tables
- **PWA** with offline-first strategy (NetworkFirst for API, CacheFirst for assets)

## Paradigm

**Functional Core, Imperative Shell**: pure business logic functions (core), side effects in hooks/handlers (shell).
