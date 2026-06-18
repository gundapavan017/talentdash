# TalentDash — Frontend Engineering Trial

India's career intelligence platform. Level-based compensation data for tech professionals.

## Live URL
https://your-vercel-url.vercel.app

## Tech Stack
- Next.js 16 (App Router, React Server Components)
- TypeScript (strict mode)
- Tailwind CSS (no component libraries)
- Mock data (55 salary records, 12 companies)

## Pages
- `/` — Homepage
- `/salaries` — Filterable salary table
- `/companies/[slug]` — Company profile (12 static pages)
- `/compare` — Side-by-side offer comparison

## How to run locally

1. Clone the repo
   git clone https://github.com/YOUR_USERNAME/talentdash.git
   cd talentdash

2. Install dependencies
   npm install

3. Start dev server
   npm run dev

4. Open http://localhost:3000

## Architecture Decisions

**Static vs Dynamic:**
- Company pages use generateStaticParams() — pre-built at deploy time, fastest load
- Salary table is dynamic (server-rendered per URL) — needed for filter/sort via searchParams
- Compare page is client component — justified because it manages interactive state

**Why server components for the table:**
The table rows render server-side. Zero client JS ships for the table itself.
Only the filter controls (SalaryFiltersClient) are client components.

**What I would build next:**
- Real PostgreSQL database via Neon + Prisma
- Backend API routes (POST /api/ingest-salary, GET /api/salaries)
- ISR revalidation after new salary submissions