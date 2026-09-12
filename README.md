# Index Four

**Live demo:** [my-catlog.netlify.app](https://my-catlog.netlify.app)

A multi-page e-commerce product catalog built with React, React Router, and
[FakeStoreAPI](https://fakestoreapi.com) — redesigned around a single idea:
**every product lives on one of four color-coded channels**, and that color
is used as real navigation, not decoration.

This is v2 of the project. See [`DESIGN.md`](./DESIGN.md) for the full
design rationale and what changed from v1, and the section below for the
short version.

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

```bash
npm run build      # production build
npm run preview    # preview the build
npm test           # run the unit test suite (Vitest)
npm run lint        # ESLint
```

## The idea, in short

FakeStoreAPI has exactly four categories. Instead of treating that as a
plain filter list, each category is named and colored like a broadcast
channel — **Circuit** (electronics), **Ember** (jewelery), **Moss** (men's
clothing), **Clay** (women's clothing) — and that color follows you through
the app:

- A four-segment **spectrum rail** sits under the header on every page and
  always shows which channel you're on.
- Filtering to a category **tints the whole page** with a soft ambient wash
  in that channel's color (`--channel` CSS variable, read by the rail, focus
  rings, buttons, and card hover states).
- Product cards glow in their own channel's color on hover instead of a
  generic white highlight.
- The product detail spec sheet lists the channel as a real attribute,
  alongside category and reference number.

The goal was a signature element that's *functional* — real wayfinding —
rather than a decorative flourish bolted onto a generic template.

## Features

- **Routing** — `/`, `/products`, `/products/:id`, `/cart`, and `/checkout`,
  via React Router.
- **Filtering & sorting** — by category (channel) and by price/rating.
  Filters live in the URL query string, so results are shareable.
- **Cart state** — `CartContext` on `useReducer`, quantity clamped 1–99,
  persisted to `localStorage`. The reducer is a pure module
  (`src/context/cartReducer.js`) so it's unit-tested without rendering React.
- **A real checkout flow** — shipping form with inline validation, an order
  review step, and a confirmation screen. Clearly labeled as a demo: no
  payment is processed and nothing is sent to a server.
- **Loading / empty / error / 404 states** — skeleton grids, a friendly
  empty state, a retry action on API failure, and an "off-channel" 404.
- **Dark mode** — respects the visitor's OS preference on first visit, then
  remembers an explicit choice.
- **Accessibility** — skip-to-content link, visible focus rings on every
  interactive element, `aria-live` toasts, reduced-motion support, and
  labeled icon-only buttons throughout.
- **Tests** — Vitest unit tests for the cart reducer and formatting
  utilities (`npm test`).

## Design system

| Token | Light | Dark | Used for |
|---|---|---|---|
| `bg` / `ink` | `#F7F6F2` / `#101014` | `#0C0C0F` / `#F0EFEA` | page background / text |
| `circuit` | `#3D5AFE` | brighter variant | Electronics channel |
| `ember` | `#BE822C`-range | brighter variant | Jewelery channel |
| `moss` | `#547455`-range | brighter variant | Men's clothing channel |
| `clay` | `#B55A4C`-range | brighter variant | Women's clothing channel |

Type: **Instrument Serif** (display, used sparingly — hero, product name,
big numerals) paired with **Inter** (UI text) and **JetBrains Mono** (prices,
reference numbers, eyebrow labels) — a serif/sans/mono system that reads
like a printed spec sheet rather than a generic marketing page.

## Project structure

```
src/
  api/            fetch wrapper around FakeStoreAPI
  hooks/          data-fetching + channel-color hooks
  data/           channel (category) metadata — the spectrum system
  context/        cart, theme, toast, fly-to-cart providers + pure cart reducer
  components/     shared UI (product card, spectrum rail, header, etc.)
  pages/          route-level views, including the checkout flow
  utils/          formatting helpers
  __tests__/      Vitest unit tests
```

## Honest limitations

This is a portfolio/demo project, not a production storefront:

- Product data and images come from FakeStoreAPI as-is (unstyled photography,
  generic copy) — the design works around that rather than replacing it.
- Checkout is a real *flow* (validation, review, confirmation) but does not
  process payment or persist orders anywhere.
- No CI pipeline is wired up yet; `npm test` and `npm run lint` are meant to
  be run locally or added to GitHub Actions.
