# MAA Frontend v1 — Marketing Site Migration

## Overview

`maa-frontend` is the production successor to `maa-prototype`. The first version is **info / marketing only** — no player registration, no login, no admin. The work is largely a deliberate port of the prototype's marketing pages with one rewrite (the home page) and a small organizational refactor (every page is its own directory with co-located content).

A future iteration will add registration features and a .NET backend. Both are explicitly out of scope here.

## Goals

- Stand up `maa-frontend` as a deployable site on GitHub Pages.
- Port the five marketing pages (Home, About, FAQ, Field Rentals, Sponsorship) into a clean page-directory layout with extracted content files.
- Rewrite the home page to work without an active season, with structure flexible enough to evolve.
- Drop all registration / cart / admin / auth code and supporting infrastructure (context, hooks, waivers, shared types).
- Stay on the same stack as the prototype to keep the port mechanical and the result familiar.

## Non-goals (v1)

- Player registration, cart, login, admin
- Custom domain (using the `github.io` URL for now)
- Tests (prototype has none; v1 stays consistent)
- AWS hosting (deferred until nonprofit credits / `bbx-frontend` pattern decision)
- Backend integration

## Stack

Identical to `maa-prototype`:

- React 19 + TypeScript 5 (strict mode)
- Vite 6
- react-router-dom v7 (HashRouter)
- Tailwind CSS 4 + DaisyUI 5 (custom "maa" theme)
- ESLint flat config + Prettier
- No tests

`HashRouter` is the v1 choice because GH Pages requires either it or a 404.html redirect, and HashRouter is simpler. When the site moves to AWS, swap to `BrowserRouter`.

Vite `base: '/maa-frontend/'` so GH Pages serves the build at `https://<user>.github.io/maa-frontend/`.

## Project layout

```
maa-frontend/
  index.html
  package.json
  vite.config.ts
  tsconfig.json, tsconfig.app.json
  eslint.config.js
  .prettierrc, .gitignore, .gitattributes
  .github/workflows/        — GH Pages deploy
  public/
    static/                 — only the assets the five kept pages use
  src/
    main.tsx                — HashRouter, route table (5 routes)
    App.tsx                 — layout shell: navbar, mobile drawer, <Outlet/>
    index.css               — Tailwind 4 + DaisyUI 5 + "maa" theme
    utils.tsx               — Ic helper, icons map, B_URL, PAGE_PATHS (5 paths)
    pages/
      home/
        index.tsx
        programs.ts         — seasons → items → ages
        copy.ts             — hero copy, intro/outro prose
      about/
        index.tsx
        board.ts            — unified BoardMember[] with optional role
        copy.ts             — about prose, contact info
      faq/
        index.tsx
        questions.tsx       — .tsx because answers contain JSX
      fields/
        index.tsx           — content small enough to leave inline
      sponsors/
        index.tsx
        tiers.tsx           — .tsx because tier cards contain icons/JSX
  docs/plans/v1-marketing-site/
    design.md               — this document
```

Notable absences vs. the prototype: no `context/`, no `hooks/`, no `types/index.ts`, no `Registration.tsx`, no `AdminPage.tsx`, no `data.ts`, no `waivers/`. Page-specific types live in the file that owns them (e.g., `BoardMember` in `about/board.ts`). If shared types emerge later, promote them then.

## Routing

All routes are children of the `App` layout route inside a `HashRouter`.

| Route            | Component                       |
|------------------|---------------------------------|
| `/`              | `pages/home/index.tsx`          |
| `/about`         | `pages/about/index.tsx`         |
| `/faq`           | `pages/faq/index.tsx`           |
| `/field-rentals` | `pages/fields/index.tsx`        |
| `/sponsorship`   | `pages/sponsors/index.tsx`      |

Navbar shows the logo (links to `/`) plus four nav items: About, FAQ, Field Rentals, Sponsorship. No Register / Admin items.

## Page-by-page plan

### Home (`pages/home/`)

The prototype home has two branches: with-active-season (renders programs from `activeSeason`, "Register Now" CTA) and without-active-season (renders a hardcoded `SPORTS` array under "What We Offer"). The v1 home is a flexible rewrite based on the without-active-season branch.

**Composition** (`index.tsx`):

```tsx
<Hero {...hero}/>
<Intro {...intro}/>
<ProgramsOffered seasons={programs}/>
<Outro {...outro}/>
```

- `<Hero/>` — full-width banner with background image, headline, subhead. Same visual treatment as today; copy comes from `copy.ts`.
- `<Intro/>` — flexible prose section above "What We Offer". Content from `copy.ts`.
- `<ProgramsOffered/>` — three-column grid (Spring / Fall / Winter) of program cards, same visual as today's no-active-season branch. Driven from `programs.ts`.
- `<Outro/>` — flexible prose section below "What We Offer". Content from `copy.ts`.

**Content files:**

- `programs.ts` exports a typed `Season[]`. Each season has a `label` and an `items` array of `{ name: string; ages: string[] }`. Initial data ports from the prototype's `SPORTS` constant.
- `copy.ts` exports the hero (`headline`, `subhead`, `backgroundImage`) and the intro/outro prose. Initial intro/outro copy is placeholder until the user iterates on it.

The section components live inline in `home/index.tsx` initially — they're small enough that splitting them into sibling files is over-engineering. Promote to siblings if any one grows past ~30 lines or gets reused.

### About (`pages/about/`)

Port the prototype's About page mostly as-is, with two extractions:

**`board.ts`** unifies the prototype's two arrays (`board` officers and `members`) into one list:

```ts
export type BoardMember = { name: string; role?: string };

export const board: BoardMember[] = [
  { name: 'Karla Parnell',     role: 'President' },
  { name: 'Justin Massengill', role: 'Vice President' },
  { name: 'Parker Johnson',    role: 'Secretary' },
  { name: 'Tiffany Adams',     role: 'Treasurer' },
  { name: 'Blake Adams' },
  { name: 'David Allen' },
  // …rest of the membership
];
```

The page renders two visual sections derived from this list: officer cards (`board.filter(m => m.role)`) and member badges (`board.filter(m => !m.role)`). Promotions and departures touch one entry instead of moving rows between two arrays.

**`copy.ts`** holds the about prose paragraph(s) and contact info (email, Facebook URL).

### FAQ (`pages/faq/`)

The prototype's FAQ has ~100 lines of inline question/answer JSX, including a local `<Sh>` helper for season subheaders and a few follow-up links between answers. Extract the Q&A array to `questions.tsx`:

- File is `.tsx` because answers contain JSX.
- Move the `<Sh>` helper into `questions.tsx`; it's used only by answers.
- Keep the existing follow-up shape: `link?: { l: string; p: string }` (label + path key).
- `index.tsx` retains the page chrome — heading, accordion toggle state, render loop.

### Field Rentals (`pages/fields/`)

The smallest page in the project — one paragraph, the aerial-view image with two field labels, two field-description cards, two rate cards, an example sentence, and a contact line. Ports as `index.tsx` only with no extracted content files. The directory exists for layout consistency; if content grows later, add siblings then.

### Sponsorship (`pages/sponsors/`)

Three sponsorship-tier cards with prices, bullets, icons, and per-tier CTAs (PDF download, mailto, plain text). Extract the tier data to `tiers.tsx`:

- File is `.tsx` because each tier has icon JSX and a CTA element.
- Tier shape captures the price (which can be a single value, two values like "$175/yr or $500", or text like "Let's Talk"), the bullet list, and an optional CTA. Use a flexible record with optional fields rather than a discriminated union — the differences are display-only.
- `index.tsx` renders the page chrome (heading, intro paragraph, contact footer) and maps over tiers.

## Tooling port notes

- **`package.json`** — review during port; drop any deps only referenced by registration / admin code (likely none, but worth confirming).
- **`vite.config.ts`** — change `base` from `/maa-prototype/` to `/maa-frontend/`. Otherwise unchanged.
- **`index.html`** — update title to "Meadow Athletic Association" (no longer "MAA Prototype"). Confirm the loaded font weights match what the kept pages use.
- **`utils.tsx`** — drop `PAGE_PATHS` entries for `/register`, `/cart`, `/admin`. Drop icon-map entries unused by the five kept pages after auditing references.
- **`index.css`** — ports unchanged: the "maa" custom theme, body background override, font-smoothing rules, `font-serif` / `font-sans` definitions.

## What gets dropped

The following prototype files / directories are **not** ported:

- `src/Registration.tsx` (RegPage + CartPage)
- `src/pages/AdminPage.tsx`
- `src/pages/HomePage.tsx` (rewritten, not ported)
- `src/data.ts` (SEASON config, programs, mock registrations, waivers)
- `src/types/index.ts` (centralized types — most are reg/admin-specific; survivors live per-page)
- `src/context/AppContext.tsx`
- `src/hooks/useLocalStorage.ts`
- `src/waivers/`
- Routes `/register`, `/cart`, `/admin`
- Static assets in `public/static/` only referenced by the dropped code

## Deployment

- GH Pages, mirroring the prototype's `.github/workflows/` setup.
- HashRouter + `base: '/maa-frontend/'` means no special 404 handling needed.
- AWS migration is a separate future effort. When it happens: swap to `BrowserRouter`, change or remove the Vite `base`, and rewrite the deploy workflow to fit the chosen host (likely modeled after `bbx-frontend`).

## Open questions deferred to implementation

These are details to confirm during the port, not decisions blocking the plan:

- Exact font weights to keep in `index.html` — confirm by grepping `font-` usage in the kept pages.
- Exact list of static assets to copy — confirm by grepping `B_URL` references in the kept pages.
- Exact icon-map entries to keep in `utils.tsx` — confirm by grepping `icons.X` usage.
- Initial intro/outro copy on the home page — placeholder content to start, iterate from there.
- Final sponsor tier record shape — settled when porting; flexible-record approach is the default.
