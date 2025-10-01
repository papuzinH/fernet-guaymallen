<!-- Copilot instructions for the `fernet-guaymallen` codebase -->
# Instrucciones rápidas para agentes de codificación AI

Objetivo: ayudar a un agente a ser productivo rápidamente en este monorepo/app React+Next (App Router) con Prisma y Supabase.

- Arquitectura general
  - Next.js 15 con App Router en `src/app/`. Las páginas y API routes viven en `src/app` (p.ej. `src/app/matches/[id]/page.tsx`).
  - UI compuesta con componentes reutilizables en `src/components/` y utilidades en `src/lib/` (p.ej. clientes Supabase, helpers).
  - Prisma como ORM; esquema en `prisma/schema.prisma` (SQLite por defecto en dev). Modelos principales: `Player`, `Match`, `Appearance`, `Tournament`, `Theme`.

- Flujos de desarrollo y comandos clave
  - Instalación: `npm install`
  - Dev server: `npm run dev` (usa turbopack por defecto)
  - Build/Start: `npm run build` / `npm run start`
  - Prisma (dev): `npm run db:migrate`, `npm run db:generate`, `npm run db:push`
  - Variables de entorno: busca `.env.example`/README para `DATABASE_URL`, `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

- Convenciones y patrones del código
  - TypeScript estricto con paths: `@/*` -> `./src/*` (ver `tsconfig.json`).
  - Componentes UI: usar los componentes en `src/components/ui/*` (Button, Card, Table, Tabs, Badge) para mantener estilos consistentes.
  - Fetching en páginas del cliente: muchas páginas usan `fetch('/api/...')` desde componentes client-side (p.ej. `src/app/matches/[id]/page.tsx`); preservar contratos JSON de las API.
  - Acceso a datos: cambiar Prisma provider a PostgreSQL para producción (actualmente sqlite dev). Ver `prisma/schema.prisma`.

- Integraciones y puntos de interés
  - Supabase: usado para Storage (logos) — cliente y helpers probablemente en `src/lib/supabase` (buscar). Asegurar keys en variables de entorno.
  - Prisma: `@prisma/client` está presente; asegurarse de ejecutar `prisma generate` después de cambios en el schema.

- Ejemplos concretos extraídos
  - Ruta de detalle de partido: `src/app/matches/[id]/page.tsx` — cliente usa `fetch('/api/matches/{id}')` y renderiza `Match` y `Appearance`.
  - Esquema de datos: `prisma/schema.prisma` define campos como `Match.result` (enum MatchResult), `Appearance.minutes`, `Player.position` (enum Position).

- Recomendaciones prácticas para el agente
  - Antes de cambiar modelos Prisma: actualizar `prisma/schema.prisma` -> `npm run db:migrate` -> `npm run db:generate`.
  - Mantener coherencia en componentes UI reutilizables (usar `src/components/ui/*`).
  - Para agregar endpoints API, crea archivos en `src/app/api/.../route.ts` siguiendo el patrón REST ya presente.
  - Evitar tocar `.prisma` dev DB binaria (`prisma/dev.db`) en commits; seguir migraciones en `prisma/migrations/`.

- Dónde leer más (archivos para inspeccionar)
  - `package.json` (scripts & deps)
  - `README.md` (setup y env vars)
  - `prisma/schema.prisma` (modelo de datos)
  - `src/app/` (rutas y páginas)
  - `src/components/` y `src/lib/` (UI y utilidades)

Si algo no está claro o quieres que el agente priorice tareas concretas (tests, endpoints, UI), dime qué priorizar y lo actualizo.
