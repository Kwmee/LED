# LED Wall Configurator

MVP foundation for an LED wall planning tool built with Next.js App Router, React, TypeScript, TailwindCSS, React Konva, and Supabase.

## Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- React Konva
- Supabase

## Local run

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

4. Apply Supabase schema and seed files:

- `supabase/schema.sql`
- `supabase/seed.sql`

## Included MVP features

- Screen dimension input
- Panel and processor preset selection
- Resolution, pixel load, panel grid, and required port calculations
- Automatic column-based port distribution
- React Konva LED wall visualization with port colors and zoom
- Save-project API route ready for Supabase
