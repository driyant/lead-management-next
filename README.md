# Lead Management

A dashboard for creating and viewing lead data. The application uses the Next.js App Router, Chakra UI, and a backend API configured through environment variables.

## Prerequisites

- Node.js 22 or later
- pnpm 11.13.1
- A backend API that provides lead endpoints

Enable Corepack if pnpm is not already available:

```bash
corepack enable
```

## Run locally

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/driyant/lead-management-next.git
   cd lead-management-next
   ```

2. Install dependencies. This command also enables the Husky hooks:

   ```bash
   pnpm install
   ```

3. Create an environment file from the template:

   ```bash
   cp .env.example .env
   ```

4. Set the backend URL in `.env`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL for the lead API. This value is bundled at build time. |

`.env.example` is safe to share as a template and must be updated when a new variable is introduced. `.env`, `.env.local`, and other local environment files must never contain committed secrets.

For a production build, use `.env` or set variables in the deployment environment. Do not define the same key in `.env.local`, because Next.js prioritizes it over `.env`.

## Available commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Starts the development server. |
| `pnpm test` | Runs unit tests and enforces the minimum 80% coverage threshold. |
| `pnpm test:watch` | Runs unit tests in watch mode without a coverage report. |
| `pnpm run build` | Runs tests, then creates the Next.js production build. |
| `pnpm start` | Starts the production server after a successful build. |
| `pnpm run ci` | Runs the same test and production build pipeline used by CI. |

## Testing and coverage

Tests are stored in `__tests__` directories that mirror the source file location:

```text
src/app/
├── __tests__/
│   ├── layout.test.tsx
│   ├── page.test.tsx
│   ├── providers.test.tsx
│   └── utils.test.ts
└── components/
    └── __tests__/
        ├── Dashboard.test.tsx
        └── LoadingSkeleton.test.tsx
```

`pnpm test` fails when any test fails or when statements, branches, functions, or lines fall below 80% coverage.

## Commit and push rules

Husky is enabled after `pnpm install`.

1. Every commit must follow [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git commit -m "feat: add lead filter"
   git commit -m "fix: normalize email input"
   git commit -m "test: add dashboard coverage"
   ```

   Messages such as `update code` are rejected by the `commit-msg` hook.

2. When `git push` runs, the `pre-push` hook automatically runs:

   ```bash
   pnpm test
   ```

   The push is blocked when tests or coverage thresholds fail. Do not use `--no-verify`, as it bypasses the local quality gate.

## GitHub CI

The workflow at `.github/workflows/ci.yml` runs on every push and pull request:

```text
pnpm install --frozen-lockfile
pnpm run ci
```

Configure a protection rule for the production branch in GitHub:

1. Open **Settings** → **Rules** → **Rulesets**.
2. Create a ruleset for `main` or the production branch.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass**.
5. Select the **CI / Test and build** status check.

With this rule, a pull request cannot be merged into the production branch if CI tests or the build fail.

## Deploy to Vercel

1. Import this repository in [Vercel](https://vercel.com/new).
2. Confirm that Vercel detects **pnpm** from the `packageManager` field in `package.json`.
3. Keep the default Build Command:

   ```bash
   pnpm run build
   ```

   This script always runs `pnpm test` before `next build`; deployment fails when tests or coverage requirements are not met.

4. In **Project Settings** → **Environment Variables**, create `NEXT_PUBLIC_API_URL` for each required environment:
   - **Production**: the production backend URL.
   - **Preview**: the staging or preview backend URL.
   - **Development**: the local or development backend URL.
5. Deploy. Review the deployment log if the build fails to identify a test, coverage, type-check, or environment-variable issue.

> `NEXT_PUBLIC_*` values are bundled at build time. Changing one requires a new deployment.
