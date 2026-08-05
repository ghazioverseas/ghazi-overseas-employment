# Ghazi Overseas Employment Pakistan - Candidate Application Portal

Commercial-grade Candidate Application Portal & Admin Portal for **Ghazi Overseas Employment Pakistan**.

## Tech Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **Database**: Neon PostgreSQL & Drizzle ORM
- **Authentication**: Better Auth
- **File Storage**: Cloudflare R2
- **Validation**: Zod & React Hook Form
- **Testing**: Playwright

## Getting Started

1. Copy `.env.local.example` to `.env.local` and populate environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Drizzle migrations:
   ```bash
   npm run db:generate
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
5. Run Playwright end-to-end tests:
   ```bash
   npm run test:e2e
   ```
