# Food Delivery — Frontend (Next.js)

Modern Next.js (App Router) storefront UI: browse shops & products, manage cart, place orders, and search order history.

## Requirements

- Node.js 20+
- Backend running (see backend README)

## Quick start

```bash
npm install

# Create env file
cp .env.example .env

# Run dev server
npm run dev
```

App: `http://localhost:3000`

## Environment variables

Create `.env` from `.env.example`.

| Variable | Required | Example |
|---|---:|---|
| `NEXT_PUBLIC_API_URL` | yes | `http://localhost:4000/api` |

## Routes

| Route | Description |
|---|---|
| `/shop` | Browse shops, filter/sort products, add to cart |
| `/cart` | Review cart + place an order |
| `/orders` | Find order history (email+phone or orderId) + reorder |
| `/login` | Demo login (stores JWT in localStorage) |

## Project structure

```
src/
├── app/                    # Next App Router pages
├── components/             # UI components (CSS Modules)
├── lib/                    # API client + domain calls
├── store/                  # Zustand stores
└── types/                  # Shared TS types
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm run lint:fix
npm run format
```
