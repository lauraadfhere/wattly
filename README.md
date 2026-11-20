# Wattly English

Inclusive English-learning platform (prototype) aligned with `Wattly_Project_Overview.md`.

**Tagline:** Speak English with confidence — from your very first A to fluent Z.

## Stack

- Next.js 16 + TypeScript + Tailwind + Yarn
- next-intl (`en` / `fr` / `es`)
- Appwrite Auth + TablesDB (`wattly` database)
- Cloudflare Worker deploy via OpenNext (`wrangler.jsonc` name: **wattly**)

## Local setup

```bash
yarn install
yarn appwrite:setup
yarn demo:user
yarn dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

### Demo access

On `/login`, click **Demo access** — it auto-fills and signs in as:

- Email: `demo@wattly.app`
- Password: `demowattly`

## Core routes

| Route | Purpose |
|---|---|
| `/login` `/signup` | Auth |
| `/onboarding` | Goals + optional supports |
| `/dashboard` | Learner home |
| `/teachers` | Teacher discovery |
| `/practice` | AI practice hub |
| `/lessons` `/levels` `/assessment` `/courses` | Curriculum stubs |

## Cloudflare deploy

Worker name: **`wattly`** (matches Cloudflare dashboard).

```bash
# One-time: put account token in .env.cloudflare (see .env.cloudflare.example)
yarn cf:sync-vars
yarn deploy
```

Git-connected Workers Builds should use:

- **Build command:** `yarn && yarn build:cf`
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/`
- **Build variables:** `NEXT_PUBLIC_APPWRITE_*` (synced by `yarn cf:sync-vars` / `wrangler.jsonc`)

## Product source of truth

- `PRODUCT.md` — durable product record
- `../Wattly_Project_Overview.md` — full concept / MVP specification
