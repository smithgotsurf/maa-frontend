# MAA Frontend

Meadow Athletic Association — marketing/info website. React SPA deployed to GitHub Pages. No registration, cart, or admin — those live elsewhere.

## Dev commands

- `npm run dev` — start Vite dev server (port 5174)
- `npm run build` — TypeScript check + production build
- `npm run lint` — ESLint
- `npm run format` — Prettier (write)
- `npm run format:check` — Prettier (check only)

## Tech stack

- React 19, Vite 6, react-router-dom v7 (HashRouter)
- TypeScript 5 (strict mode)
- Tailwind CSS 4 + DaisyUI 5 (custom "maa" theme)
- ESLint (flat config) + Prettier
- No tests — prototype-grade code
- Deployed to GitHub Pages via `.github/workflows/deploy.yml`; HashRouter + `base: '/maa-frontend/'` in vite.config.ts

## Project structure

```
src/
  main.tsx          — HashRouter, route definitions
  App.tsx           — layout shell (navbar, mobile drawer, Outlet, Footer)
  content.ts        — shared site content/copy
  utils.tsx         — shared utilities (Ic icon helper, icons map, B_URL, PAGE_PATHS)
  index.css         — Tailwind + DaisyUI theme configuration
  components/
    Footer.tsx
    ContactSection.tsx
  pages/
    home/      — index.tsx + copy.ts + programs.ts
    about/     — index.tsx + copy.ts + board.ts
    faq/       — index.tsx + questions.tsx
    fields/    — index.tsx
    sponsors/  — index.tsx + tiers.tsx
public/static/       — images, logo, sponsorship PDF
```

Each page is a folder with `index.tsx` (default-exported component) plus sibling files for copy/data (e.g. `copy.ts`, `programs.ts`, `board.ts`, `questions.tsx`, `tiers.tsx`). Keep page-specific content in those siblings; only put genuinely shared content in `src/content.ts`.

## Routing

Routes defined in `main.tsx` inside a HashRouter. `App.tsx` renders the layout with `<Outlet />` for page content. All routes are children of the App layout route.

| Route | Component |
|-------|-----------|
| `/` | HomePage |
| `/about` | AboutPage |
| `/faq` | FaqPage |
| `/field-rentals` | FieldsPage |
| `/sponsorship` | SponsorsPage |

Nav uses `NavLink` with `isActive` for highlighting. Logo links to `/`; no "Home" nav item. Path constants are in `utils.tsx` as `PAGE_PATHS`.

## Coding conventions

- TypeScript strict mode — all components and functions typed
- DaisyUI component classes for UI elements (btn, card, badge, etc.)
- Tailwind utility classes for layout and spacing
- Shared icons/helpers live in `utils.tsx`; shared layout in `components/`
- Page components are default exports from `pages/<name>/index.tsx`

## Styling

- DaisyUI custom theme "maa" defined in `src/index.css`
- Brand colors: primary (Vegas Gold `#C5A04E`), secondary (dark gold `#A68636`), neutral (black `#1A1A1A`)
- `text-primary` for brand gold; `text-secondary` for darker gold (prices, links)
- Fonts: Playfair Display (headings via `font-serif`) + Source Sans 3 (body via `font-sans`). Both loaded from Google Fonts in `index.html` — ensure needed weights are included when using new weights
- Body background overridden to `base-200` (`#F5F4F0`) in `index.css`; use `bg-white`/`bg-base-100` for cards/containers that need to stand out from the page
- Antialiased font smoothing set on body in `index.css`
- No custom CSS files — all styling via Tailwind utilities + DaisyUI components
- DaisyUI `btn` class overrides font-size/weight/color — when matching specific designs, set these explicitly on btn elements
- Reference design (prototype): https://smithgotsurf.github.io/maa-prototype/
