# Build Task: raspberry-pi-project-generator

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: raspberry-pi-project-generator
HEADLINE: Generate personalized Raspberry Pi project ideas
WHAT: Generates personalized Raspberry Pi project ideas based on your skill level, available components, and interests. Input your experience and hardware, get step-by-step project guides with code examples and wiring diagrams.
WHY: Makers waste hours browsing forums and YouTube for project inspiration that matches their actual setup. Most tutorials assume different components or skill levels, leading to abandoned projects and frustration.
WHO PAYS: Hobbyist makers and electronics enthusiasts who own Raspberry Pi devices but struggle to find projects that match their current components and experience level. Often stuck between beginner tutorials and advanced builds.
NICHE: maker-tools
PRICE: $$7/mo

ARCHITECTURE SPEC:
A Next.js web app with a multi-step form that collects user skill level, available components, and interests to generate personalized Raspberry Pi project recommendations. Uses AI to create custom project guides with code examples and wiring diagrams, gated behind a subscription paywall.

PLANNED FILES:
- app/page.tsx
- app/generator/page.tsx
- app/project/[id]/page.tsx
- app/api/generate-project/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/ProjectForm.tsx
- components/ProjectCard.tsx
- components/WiringDiagram.tsx
- components/PaywallModal.tsx
- lib/openai.ts
- lib/lemonsqueezy.ts
- lib/database.ts
- types/project.ts

DEPENDENCIES: next, react, tailwindcss, openai, @lemonsqueezy/lemonsqueezy.js, prisma, @prisma/client, next-auth, lucide-react, react-hook-form, zod

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}
- NO HEAVY ORMs: Do NOT use Prisma, Drizzle, TypeORM, Sequelize, or Mongoose. If the tool needs persistence, use direct SQL via `pg` (Postgres) or `better-sqlite3` (local), or just filesystem JSON. Reason: these ORMs require schema files and codegen steps that fail on Vercel when misconfigured.
- INTERNAL FILE DISCIPLINE: Every internal import (paths starting with `@/`, `./`, or `../`) MUST refer to a file you actually create in this build. If you write `import { Card } from "@/components/ui/card"`, then `components/ui/card.tsx` MUST exist with a real `export const Card` (or `export default Card`). Before finishing, scan all internal imports and verify every target file exists. Do NOT use shadcn/ui patterns unless you create every component from scratch — easier path: write all UI inline in the page that uses it.
- DEPENDENCY DISCIPLINE: Every package imported in any .ts, .tsx, .js, or .jsx file MUST be
  listed in package.json dependencies (or devDependencies for build-only). Before finishing,
  scan all source files for `import` statements and verify every external package (anything
  not starting with `.` or `@/`) appears in package.json. Common shadcn/ui peers that MUST
  be added if used:
  - lucide-react, clsx, tailwind-merge, class-variance-authority
  - react-hook-form, zod, @hookform/resolvers
  - @radix-ui/* (for any shadcn component)
- After running `npm run build`, if you see "Module not found: Can't resolve 'X'", add 'X'
  to package.json dependencies and re-run npm install + npm run build until it passes.

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.
