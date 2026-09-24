# NodeWave Delivery API

Bun + Hono + Prisma + PostgreSQL API for the assessment.

## Local setup

1. Copy `.env.example` to `.env` and point `DATABASE_URL` at PostgreSQL.
2. Run `bun install`, `bunx prisma generate`, `bunx prisma migrate dev --name init`, and `bun run db:seed`.
3. Start with `bun run dev`.

Seeded password for all users: `password`.

The API enforces project isolation, client masking, dependency checks, executor-only completion, optimistic version checks (`409`), soft-delete-ready schema, and immutable task audit records.
