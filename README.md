# Food Delivery — Frontend

Built with **Next.js 14** (App Router), **TypeScript**, **Zustand**, **Axios**, **CSS Modules**.

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

App runs at **http://localhost:3000**

## Pages

| Route    | Description                              |
|----------|------------------------------------------|
| `/shop`  | Browse shops & add products to cart      |
| `/cart`  | Review cart, fill in details, submit     |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + Navbar
│   ├── page.tsx            # Redirects → /shop
│   ├── shop/
│   │   ├── page.tsx        # Shop page
│   │   └── page.module.css
│   └── cart/
│       ├── page.tsx        # Cart page
│       └── page.module.css
├── components/
│   ├── Navbar/
│   ├── ShopList/
│   ├── ProductGrid/
│   ├── CartItem/
│   └── OrderForm/          # With full validation
├── store/
│   └── cartStore.ts        # Zustand (persisted)
├── lib/
│   └── api.ts              # Axios instance + endpoints
├── types/
│   └── types.ts            # Shared TypeScript types
└── styles/
    └── globals.css         # CSS variables, reset, fonts
```

## Features

- Browse shops from sidebar, click to load products
- Add products to cart (persisted in localStorage via Zustand)
- Cart page: adjust quantity, remove items, see live total
- Order form: real-time validation on blur + on submit
  - Name (required, min 2 chars)
  - Email (required, valid format)
  - Phone (required, valid format)
  - Address (required, min 10 chars)
- Success state with auto-redirect after submit
