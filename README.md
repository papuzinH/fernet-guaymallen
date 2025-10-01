# Fernet con Guaymallén - App de Fútbol

Aplicación web para gestionar equipos de fútbol, partidos, jugadores y estadísticas.

## Tecnologías
- Next.js 15 con App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- Supabase (Storage)
- shadcn/ui

## Instalación

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura variables de entorno (ver `.env.example`)

## Configuración de Base de Datos

### Desarrollo (SQLite)
- El proyecto usa SQLite por defecto para desarrollo.
- Ejecuta: `npm run db:migrate` para crear la base de datos.

### Producción (PostgreSQL)
1. Crea un proyecto en Supabase o configura PostgreSQL.
2. Actualiza `DATABASE_URL` en `.env`.
3. Cambia el provider en `prisma/schema.prisma` a "postgresql".
4. Ejecuta: `npx prisma migrate deploy` para aplicar migraciones.

## Configuración de Supabase Storage
1. Crea un bucket llamado `logos` en Supabase Storage.
2. Configura políticas para permitir uploads públicos.
3. Actualiza `SUPABASE_URL` y `SUPABASE_ANON_KEY` en `.env`.

## Variables de Entorno

Crea un archivo `.env.local` con:

```
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
ADMIN_SECRET="your-admin-secret"
```

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run db:migrate` - Ejecuta migraciones de Prisma
- `npm run db:generate` - Genera cliente de Prisma

## Despliegue

1. Configura las variables de entorno en tu plataforma de despliegue (Vercel, Netlify, etc.).
2. Asegúrate de que la base de datos esté configurada.
3. Ejecuta `npm run build` para verificar que todo compile.
4. Despliega normalmente.

## Funcionalidades

- **Home**: Dashboard con estadísticas del equipo
- **Admin/Import**: Subir datos via CSV
- **Admin/Theme**: Configurar colores y logo del equipo
- APIs seguras para gestión de datos

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/          # APIs de Next.js
│   ├── admin/        # Páginas de administración
│   └── ...           # Páginas públicas
├── components/       # Componentes reutilizables
├── lib/              # Utilidades (Supabase, etc.)
└── ...
prisma/
├── schema.prisma     # Esquema de base de datos
└── migrations/       # Migraciones
```
