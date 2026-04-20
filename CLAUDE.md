# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gallinapp is a poultry farm management SaaS platform (gestión avícola). It manages laying hens (ponedoras), broilers (engorde), and pullet rearing (levante) with features for expenses (gastos), sales (ventas), billing (facturación), subscriptions, and alerts. The product targets the Dominican Republic market (timezone: `America/Santo_Domingo`).

## Monorepo Structure

pnpm workspaces monorepo (`pnpm@10.4.1`). Internal packages use `workspace:^` protocol. Root `pnpm.overrides` pins React 19.1.0 globally to prevent duplication.

- **`apps/web`** — Landing page & user-facing web app (React 19, Vite 7, Tailwind CSS 4, React Router v6, Zustand, Firebase v12)
- **`apps/admin`** — Admin dashboard (React 18, Vite 6, Tailwind CSS 4, React Router v7, Zustand, Firebase v11)
- **`apps/mobile`** — Mobile app (React Native 0.81, Expo 54, Expo Router 6, Zustand, Firebase v12, Stripe, RevenueCat, Sentry, i18next)
- **`functions/`** — Firebase Cloud Functions v5 (Node 20, firebase-admin v12, CommonJS output to `lib/`). Uses `npm`, not pnpm.
- **`packages/types`** — Shared TypeScript domain types (`@gallinapp/types`)
- **`packages/assets`** — Shared SVG logos and images (`@gallinapp/assets`)

## Common Commands

### Development (from root)
```bash
pnpm dev:web          # Web app dev server (Vite)
pnpm dev:admin        # Admin dashboard dev server
pnpm dev:mobile       # Mobile app (Expo)
pnpm typecheck        # TypeScript checks across all packages
```

### Mobile (run from `apps/mobile/`)
```bash
pnpm start            # expo start
pnpm ios              # expo run:ios
pnpm android          # expo run:android
pnpm lint             # expo lint
pnpm build:dev        # EAS development build (all platforms)
pnpm build:production # EAS production build
pnpm update           # EAS OTA update (auto channel)
```

### Web/Admin (run from respective `apps/` directory)
```bash
pnpm dev              # Vite dev server
pnpm build            # tsc + vite build
pnpm lint             # ESLint (flat config, v9+)
```

### Cloud Functions (run from `functions/`)
```bash
npm run build         # Compile TypeScript to lib/
npm run build:watch   # Watch mode
npm run serve         # Local emulator (build + firebase emulators)
npm run deploy        # Deploy to Firebase
```

### Mobile Tests (run from `apps/mobile/`)
```bash
npx jest                           # Run all tests
npx jest --testPathPattern=<name>  # Run single test file
```

## Architecture Notes

### Type Sharing
All domain types live in `packages/types/` and are imported as `@gallinapp/types`. TypeScript paths are configured in root `tsconfig.base.json`. Each app resolves the package differently:
- Web: Vite alias to `../../packages/types/index.ts` (also aliases `@gallinapp/assets`)
- Admin: No workspace alias — uses TypeScript paths only
- Mobile: Babel module-resolver + Metro config with symlink support (`unstable_enableSymlinks`)
- Functions: TypeScript paths

### Path Aliases
- Web/Admin: `@/` → `./src/` (configured in both tsconfig and vite.config)
- Mobile: `@/` → `./src/`, `@components/` → `./components/`, `@app/` → `./app/` (babel module-resolver)

### State Management
All apps use Zustand stores (in `stores/` directories). Key patterns:
- **Mobile stores** are persisted with `AsyncStorage` via `zustand/middleware/persist` (versioned migrations, e.g. v3)
- **Mobile auth** uses dual persistence: Firebase Auth (native session) + Zustand store (for offline reads and granular state)
- **Web** also uses React Context for auth (`AuthContext`)
- Stores delegate business logic to a services layer — stores call services, not Firestore directly

### Multi-Tenant Farm Model
`farmId` is the core tenant key. Mobile's `useFarmStore` provides the current farm context, which services consume implicitly. The `FarmRole` (per-farm collaboration role) is distinct from `globalRole` (SaaS-wide admin role used in `apps/admin`).

### Authentication
- **Web/Admin**: Firebase Email/Password + Firestore user document at `users/{uid}`
- **Admin**: Checks `users/{uid}.globalRole` field (ADMIN, SUPER_ADMIN, SUPPORT, ANALYST)
- **Mobile**: Firebase Auth + AsyncStorage-persisted Zustand store. `authInitialized` flag prevents race conditions on cold start

### Firebase Configuration
- **Web/Admin**: `VITE_FIREBASE_*` env vars, initialized in `src/lib/firebase.ts`
- **Mobile**: `EXPO_PUBLIC_FIREBASE_*` env vars (set in EAS Dashboard), initialized in `src/components/config/firebase.ts` with config validation and `isConfigValid` flag
- **Project ID**: `gallinapp-ac9d8`
- **Firestore rules**: `firestore.rules` at root

### Mobile App Structure
- File-based routing via Expo Router (`app/` directory) with Drawer navigation
- Auth guard in root `_layout.tsx` — drawer disabled on `/auth` routes
- Custom `AnimatedTabBar` in `(tabs)/_layout.tsx`; tabs hidden until farm data loads
- Services layer (`src/services/`) — ~56 services for business logic
- Infrastructure layer (`src/infrastructure/repositories/`) for data access abstractions
- Feature modules (`src/modules/`)
- i18n via i18next (`src/i18n/`)
- Error reporting via Sentry
- Production babel config strips `console.log` (keeps `error`/`warn`)

### Cloud Functions Structure
Organized by feature domain in `functions/src/`:
- `admin/` — User & notification management
- `ventas-pro/` — Sales, fiscal documents (NCF generation)
- `alerts/` — Monitoring system
- `webhooks/` — Stripe, RevenueCat, health checks
- `middleware/` — Rate limiting, security (exported for internal use)

Scheduled functions use `America/Santo_Domingo` timezone:
- `scheduledRateLimitCleanup` — Daily 3 AM
- `scheduledWebhookLogsCleanup` — Weekly Sunday 4 AM
- `scheduledNCFExpirationCheck` — Daily 8 AM

### UI Components
- **Web**: Hand-rolled Radix primitives + CVA + `clsx`/`tailwind-merge`. Framer Motion for animations. No shadcn/ui.
- **Admin**: shadcn/ui-adjacent pattern (Radix components + CVA utility functions)
- **Mobile**: Custom React Native components, `@expo/vector-icons` (Ionicons), theme provider with dark mode

### Deployment
- **Web**: Vercel (`vercel.json` at root — `pnpm --filter web build`, output: `dist`, framework: `vite`)
- **Mobile**: EAS Build + EAS Update (channels: development, preview, production). Version management is remote (`appVersionSource: "remote"`). Production builds auto-increment.
- **Functions**: Firebase CLI (`npm run deploy` from `functions/`)

### Metro Configuration (Mobile)
Metro is configured for monorepo support: watches the workspace root, supports symlinks, and blocks `.git` and macOS `._*` metadata files. The root `.npmrc` hoists `metro*`, `expo*`, and `react*` packages for compatibility. Metro disables hierarchical lookup to prevent duplicate React instances.

## Important Gotchas

- `functions/` uses **npm** (not pnpm) — it has its own `node_modules` and isn't part of the pnpm workspace
- **Admin uses React 18** while Web and Mobile use React 19 — be mindful of API differences
- Mobile babel config **must** have `react-native-reanimated/plugin` as the **last** plugin
- Mobile Firebase config validates env vars at init — missing vars won't crash but `isConfigValid` will be `false`

## Language

The codebase, commit messages, documentation, and domain terminology are primarily in **Spanish**. Variable names and code structure use English conventions, but domain terms (ponedoras, engorde, levante, gastos, ventas, facturación, lotes, galpones) remain in Spanish throughout types and business logic.
