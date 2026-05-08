# MAA Frontend v1 — Marketing Site Implementation Plan

> Design: [design.md](./design.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `maa-prototype`'s five marketing pages into the empty `maa-frontend` repo as a deployable info-only site on GitHub Pages, with a clean page-as-directory layout and a rewritten home page.

**Architecture:** Single-page React app. Identical stack to the prototype (React 19 + Vite 6 + Tailwind 4 + DaisyUI 5 + react-router v7 with HashRouter). No backend, no auth, no registration. Each page is its own directory with co-located content files (`programs.ts`, `copy.ts`, `tiers.tsx`, etc.). Layout shell + routing live at `src/`; all page-specific code under `src/pages/<page>/`.

**Tech Stack:** React 19, TypeScript 5 (strict), Vite 6, react-router-dom v7 (HashRouter), Tailwind CSS 4, DaisyUI 5, ESLint flat config, Prettier. No tests. Deployment via GitHub Actions to GitHub Pages.

**Verification model:** No automated tests (per design — prototype has none, v1 stays consistent). Each task verifies via browser inspection at `http://localhost:5174/maa-frontend/`, lint pass (`npm run lint`), and TypeScript build (`npm run build`).

**Code Review Checkpoints:**
- **Checkpoint 1:** After Tasks 1–2 (scaffold + style/entry) — project builds, dev server runs at port 5174 with the correct base path
- **Checkpoint 2:** After Tasks 3–5 (utils + layout + routing) — navbar renders, all five routes navigate to placeholders
- **Checkpoint 3:** After Tasks 6–9 (four content-page ports) — Fields, Sponsors, FAQ, About all render correctly
- **Checkpoint 4:** After Tasks 10–11 (home page) — full site is content-complete locally
- **Final Review:** After Tasks 12–13 (audit + build/deploy) — clean repo, green build, live URL

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Scaffold tooling](#task-1) | Copy configs, install deps, verify build runs | sonnet |
| 2 | [Style + entry](#task-2) | Port index.css, index.html, minimal main.tsx; verify dev server | sonnet |
| 3 | [Utils module](#task-3) | Port trimmed utils.tsx (Ic, icons, B_URL, PAGE_PATHS) | sonnet |
| 4 | [Layout shell](#task-4) | Port App.tsx with marketing-only navbar | sonnet |
| 5 | [Routing + page stubs](#task-5) | Wire 5 routes to stub page components | sonnet |
| 6 | [Field Rentals page](#task-6) | Port content + aerial image, verify in browser | sonnet |
| 7 | [Sponsorship page](#task-7) | Extract tiers.tsx, copy PDF, verify in browser | sonnet |
| 8 | [FAQ page](#task-8) | Extract questions.tsx with Sh helper, verify | sonnet |
| 9 | [About page](#task-9) | Unify board.ts with optional role, extract copy.ts | sonnet |
| 10 | [Home — content files](#task-10) | Create programs.ts and copy.ts | sonnet |
| 11 | [Home — index.tsx](#task-11) | Compose Hero, Intro, ProgramsOffered, Outro | sonnet |
| 12 | [Asset & icon audit](#task-12) | Delete unreferenced static files and icon-map entries | sonnet |
| 13 | [Final build + deploy](#task-13) | Lint, build, push, verify live URL | sonnet |

---

<a id="task-1"></a>
### Task 1: Scaffold tooling

**Files:**
- Create: `maa-frontend/package.json`
- Create: `maa-frontend/vite.config.ts`
- Create: `maa-frontend/tsconfig.json`, `maa-frontend/tsconfig.app.json`
- Create: `maa-frontend/eslint.config.js`
- Create: `maa-frontend/.prettierrc`
- Create: `maa-frontend/.gitignore`, `maa-frontend/.gitattributes`
- Create: `maa-frontend/.github/workflows/deploy.yml`

- [ ] **Step 1: Copy tooling files from prototype to maa-frontend**

```bash
cp /Users/josh/Code/maa/maa-prototype/package.json       /Users/josh/Code/maa/maa-frontend/package.json
cp /Users/josh/Code/maa/maa-prototype/vite.config.ts     /Users/josh/Code/maa/maa-frontend/vite.config.ts
cp /Users/josh/Code/maa/maa-prototype/tsconfig.json      /Users/josh/Code/maa/maa-frontend/tsconfig.json
cp /Users/josh/Code/maa/maa-prototype/tsconfig.app.json  /Users/josh/Code/maa/maa-frontend/tsconfig.app.json
cp /Users/josh/Code/maa/maa-prototype/eslint.config.js   /Users/josh/Code/maa/maa-frontend/eslint.config.js
cp /Users/josh/Code/maa/maa-prototype/.prettierrc        /Users/josh/Code/maa/maa-frontend/.prettierrc
cp /Users/josh/Code/maa/maa-prototype/.gitignore         /Users/josh/Code/maa/maa-frontend/.gitignore
cp /Users/josh/Code/maa/maa-prototype/.gitattributes     /Users/josh/Code/maa/maa-frontend/.gitattributes
mkdir -p /Users/josh/Code/maa/maa-frontend/.github/workflows
cp /Users/josh/Code/maa/maa-prototype/.github/workflows/deploy.yml \
   /Users/josh/Code/maa/maa-frontend/.github/workflows/deploy.yml
```

- [ ] **Step 2: Update `package.json` name field**

Edit `maa-frontend/package.json` and change the `name` field:

```json
{
  "name": "maa-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  ...
}
```

(Leave dependencies and scripts unchanged — they're identical to the prototype.)

- [ ] **Step 3: Update `vite.config.ts` base path**

Edit `maa-frontend/vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/maa-frontend/',
  server: {
    port: 5174,
  },
});
```

(Only change is `base` from `/maa-prototype/` to `/maa-frontend/`.)

- [ ] **Step 4: Install dependencies**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm install
```

Expected: `npm install` completes with no errors. `node_modules/` and `package-lock.json` appear.

- [ ] **Step 5: Verify lint passes on a clean tree**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint
```

Expected: lint passes with 0 errors (there are no source files yet). If it errors because there's nothing to lint, that's also acceptable for this step — note it and proceed.

- [ ] **Step 6: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json eslint.config.js .prettierrc .gitignore .gitattributes .github/workflows/deploy.yml
git -C /Users/josh/Code/maa/maa-frontend commit -m "Scaffold project tooling from prototype"
```

---

<a id="task-2"></a>
### Task 2: Style system + entry point

**Files:**
- Create: `maa-frontend/index.html`
- Create: `maa-frontend/src/index.css`
- Create: `maa-frontend/src/main.tsx`
- Create: `maa-frontend/public/static/maa-large.jpg` (logo, used by layout shell next task — pre-staged here)

- [ ] **Step 1: Copy index.html from prototype, update title**

```bash
cp /Users/josh/Code/maa/maa-prototype/index.html /Users/josh/Code/maa/maa-frontend/index.html
```

Edit `maa-frontend/index.html` and update the `<title>`:

```html
<title>Meadow Athletic Association</title>
```

(Everything else — `data-theme="maa"`, font preconnects, font import, root div, main.tsx script — stays identical.)

- [ ] **Step 2: Copy src/index.css from prototype unchanged**

```bash
mkdir -p /Users/josh/Code/maa/maa-frontend/src
cp /Users/josh/Code/maa/maa-prototype/src/index.css /Users/josh/Code/maa/maa-frontend/src/index.css
```

- [ ] **Step 3: Copy the logo asset (used by next task's layout shell)**

```bash
mkdir -p /Users/josh/Code/maa/maa-frontend/public/static
cp /Users/josh/Code/maa/maa-prototype/public/static/maa-large.jpg \
   /Users/josh/Code/maa/maa-frontend/public/static/maa-large.jpg
```

- [ ] **Step 4: Create a minimal `src/main.tsx`**

Create `maa-frontend/src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';

function Placeholder() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">MAA</h1>
      <p>Site under construction.</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Placeholder />
    </HashRouter>
  </StrictMode>,
);
```

This is intentionally minimal — just enough to confirm Vite + Tailwind + DaisyUI + the maa theme all wire up. We'll replace it with the real layout shell + routes in Tasks 4 and 5.

- [ ] **Step 5: Run dev server and verify in a browser**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run dev
```

Expected: dev server starts on `http://localhost:5174/maa-frontend/`. Open it in a browser. You should see "MAA" as a heading and "Site under construction." as body text. The body background should be the warm off-white `#F5F4F0` (proves the maa theme is active) and the heading should use Playfair Display via `font-bold` (Tailwind utility — note: `font-bold` doesn't change family; verify the body font is Source Sans 3 by inspecting in DevTools).

Stop the dev server (`Ctrl+C`) before committing.

- [ ] **Step 6: Run TypeScript build to confirm no type errors**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run build
```

Expected: `tsc -b` passes, then `vite build` produces a `dist/` directory with `index.html`, JS, CSS assets.

- [ ] **Step 7: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add index.html src/index.css src/main.tsx public/static/maa-large.jpg
git -C /Users/josh/Code/maa/maa-frontend commit -m "Add style system, entry point, and logo asset"
```

---

<a id="task-3"></a>
### Task 3: Utils module

**Files:**
- Create: `maa-frontend/src/utils.tsx`

The prototype's `utils.tsx` mixes icon helpers (kept) with player/program domain helpers like `age`, `recommended`, `calcTotal` (dropped — they reference types that no longer exist in v1). `PAGE_PATHS` is trimmed to the five marketing routes.

We **keep** the full icons map for now and trim it during the audit in Task 12, after we know exactly which icons the implemented pages reference.

- [ ] **Step 1: Create `src/utils.tsx`**

Create `maa-frontend/src/utils.tsx` with this exact content:

```tsx
/* eslint-disable react-refresh/only-export-components */
export const B_URL: string = import.meta.env.BASE_URL;

interface IcProps {
  d: string;
  s?: number;
  style?: React.CSSProperties;
}
export const Ic = ({ d, s = 18, style }: IcProps) => (
  <svg
    width={s}
    height={s}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    dangerouslySetInnerHTML={{ __html: d }}
  />
);

export const icons: Record<string, string> = {
  ball: '<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93c4.08 2.38 6.2 6.76 6.2 6.76s.86 4.56-1.14 8.38"/><path d="M19.07 4.93c-4.08 2.38-6.2 6.76-6.2 6.76s-.86 4.56 1.14 8.38"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  chk: '<polyline points="20 6 9 17 4 12"/>',
  chev: '<polyline points="9 18 15 12 9 6"/>',
  dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  heart:
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  award:
    '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.35 1.61.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.2.35 2 .57 2.81.7A2 2 0 0 1 22 16.92z"/>',
};

export const PAGE_PATHS = {
  home: '/',
  about: '/about',
  faq: '/faq',
  fields: '/field-rentals',
  sponsors: '/sponsorship',
} as const;
```

Differences from the prototype's `utils.tsx`:
- Removed: `Player`/`Program` imports and the `age`, `fmtDate`, `recommended`, `otherPrograms`, `fullName`, `calcTotal` helpers.
- Removed icons-map entries: `clip`, `cart`, `gear`, `trash` (only used by registration/admin/cart code).
- Removed `PAGE_PATHS` entries: `register`, `cart`, `admin`.
- Other unreferenced icons are kept for now and trimmed in Task 12.

- [ ] **Step 2: Verify lint and typecheck**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass with no errors. (The icons map is unused at this point but that's fine — `eslint-plugin-react-refresh` allows non-component exports because of the `eslint-disable` comment at the top.)

- [ ] **Step 3: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/utils.tsx
git -C /Users/josh/Code/maa/maa-frontend commit -m "Add utils module (Ic helper, icons map, B_URL, PAGE_PATHS)"
```

---

<a id="task-4"></a>
### Task 4: Layout shell

**Files:**
- Create: `maa-frontend/src/App.tsx`

The prototype's `App.tsx` has a navbar with About, FAQ, Field Rentals, Sponsorship, plus conditional Register/Cart items, an Admin item, and a "Josh S." profile button. v1 strips all reg/admin/profile pieces — only the four marketing items remain.

- [ ] **Step 1: Create `src/App.tsx`**

Create `maa-frontend/src/App.tsx` with this exact content:

```tsx
import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { B_URL, Ic, icons } from './utils';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav: Array<{ to: string; ic: string; l: string }> = [
    { to: '/about', ic: icons.info, l: 'About' },
    { to: '/faq', ic: icons.help, l: 'FAQ' },
    { to: '/field-rentals', ic: icons.map, l: 'Field Rentals' },
    { to: '/sponsorship', ic: icons.star, l: 'Sponsorship' },
  ];

  return (
    <div>
      <header className="bg-neutral text-neutral-content sticky top-0 z-50 px-7 h-14 flex items-center justify-between">
        <div className="flex-1">
          <Link
            to="/"
            className="flex items-center gap-2 no-underline text-inherit font-serif text-[19px] font-normal"
          >
            <img
              src={B_URL + 'static/maa-large.jpg'}
              alt="MAA"
              className="h-[30px] w-auto rounded-sm"
            />
            <span className="text-primary font-bold">MAA</span>
            <span className="hidden xl:inline">Meadow Athletic Association</span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `btn btn-ghost btn-sm gap-1 font-medium text-[14px] text-white/45 hover:bg-white/7 hover:text-white/80 ${isActive ? 'bg-primary/15 !text-primary' : ''}`
              }
            >
              <Ic d={n.ic} s={14} />
              {n.l}
            </NavLink>
          ))}
        </nav>
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-base-100 text-base-content z-50 shadow-xl flex flex-col p-4 gap-1 transition-transform duration-200 lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `btn btn-ghost btn-sm justify-start gap-2 ${isActive ? 'btn-active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <Ic d={n.ic} s={16} />
            {n.l}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

Differences from the prototype:
- Removed `useAppContext` import and the `cart` / `activeSeason` reads.
- Nav array no longer includes conditional Register/Cart items or the Admin item.
- Removed the "Josh S." profile button from both the desktop and mobile navs.
- Removed `badge` field from nav-item type and rendering (it was for the cart count).

- [ ] **Step 2: Verify lint and typecheck**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass. App.tsx is unused at this point — no warning expected because TypeScript doesn't flag unused exports by default.

- [ ] **Step 3: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/App.tsx
git -C /Users/josh/Code/maa/maa-frontend commit -m "Add layout shell with marketing-only navbar"
```

---

<a id="task-5"></a>
### Task 5: Routing + page stubs

**Files:**
- Modify: `maa-frontend/src/main.tsx`
- Create: `maa-frontend/src/pages/home/index.tsx` (stub)
- Create: `maa-frontend/src/pages/about/index.tsx` (stub)
- Create: `maa-frontend/src/pages/faq/index.tsx` (stub)
- Create: `maa-frontend/src/pages/fields/index.tsx` (stub)
- Create: `maa-frontend/src/pages/sponsors/index.tsx` (stub)

- [ ] **Step 1: Create five stub page components**

Each stub is the same shape, with a different page title. Create all five:

`maa-frontend/src/pages/home/index.tsx`:

```tsx
export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Home</h1>
      <p className="text-base-content/70">Coming soon.</p>
    </div>
  );
}
```

`maa-frontend/src/pages/about/index.tsx`:

```tsx
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">About</h1>
      <p className="text-base-content/70">Coming soon.</p>
    </div>
  );
}
```

`maa-frontend/src/pages/faq/index.tsx`:

```tsx
export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">FAQ</h1>
      <p className="text-base-content/70">Coming soon.</p>
    </div>
  );
}
```

`maa-frontend/src/pages/fields/index.tsx`:

```tsx
export default function FieldsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Field Rentals</h1>
      <p className="text-base-content/70">Coming soon.</p>
    </div>
  );
}
```

`maa-frontend/src/pages/sponsors/index.tsx`:

```tsx
export default function SponsorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Sponsorship</h1>
      <p className="text-base-content/70">Coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/main.tsx` with the real router**

Overwrite `maa-frontend/src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import FaqPage from './pages/faq';
import FieldsPage from './pages/fields';
import SponsorsPage from './pages/sponsors';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="field-rentals" element={<FieldsPage />} />
          <Route path="sponsorship" element={<SponsorsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
```

- [ ] **Step 3: Run dev server and verify navigation**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run dev
```

Open `http://localhost:5174/maa-frontend/` and verify:
- Header navbar shows logo + "MAA" + (on wide screens) "Meadow Athletic Association", plus four nav items: About, FAQ, Field Rentals, Sponsorship.
- Clicking each nav item navigates to the corresponding hash URL (`#/about`, `#/faq`, `#/field-rentals`, `#/sponsorship`) and renders the matching stub page.
- Active nav item highlights in primary color.
- Logo/MAA text links back to `/`.
- On a narrow viewport (resize to <1024px), the desktop nav hides and the hamburger button appears; tapping it slides in the mobile drawer with the same four items.

Stop the dev server.

- [ ] **Step 4: Verify lint and build**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/main.tsx src/pages
git -C /Users/josh/Code/maa/maa-frontend commit -m "Wire router with five page stubs"
```

---

<a id="task-6"></a>
### Task 6: Field Rentals page

**Files:**
- Modify: `maa-frontend/src/pages/fields/index.tsx`
- Create: `maa-frontend/public/static/fields-aerial.jpg`

The smallest page. No content extraction — small enough to leave inline.

- [ ] **Step 1: Copy the aerial image asset**

```bash
cp /Users/josh/Code/maa/maa-prototype/public/static/fields-aerial.jpg \
   /Users/josh/Code/maa/maa-frontend/public/static/fields-aerial.jpg
```

- [ ] **Step 2: Replace the Fields stub with the full page**

Overwrite `maa-frontend/src/pages/fields/index.tsx`:

```tsx
import { B_URL } from '../../utils';

export default function FieldsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Field Rentals</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">
        MAA has two fields available for rental when not in use for games or practices.
      </p>
      <div className="rounded-xl overflow-hidden my-4 border border-base-300 relative">
        <img
          src={B_URL + 'static/fields-aerial.jpg'}
          alt="Aerial view of MAA fields"
          className="w-full block max-h-[420px] object-cover object-center"
        />
        <div className="absolute left-[38%] top-[49%] -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-3.5 py-1 rounded-md text-[13px] font-bold tracking-wider border border-primary pointer-events-none">
          Field 1
        </div>
        <div className="absolute left-[61%] top-[76%] -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-3.5 py-1 rounded-md text-[13px] font-bold tracking-wider border border-primary pointer-events-none">
          Field 2
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="card bg-white border border-base-300 rounded-[10px] p-5">
          <h3 className="text-base font-bold mb-1">MAA Field 1</h3>
          <p className="text-sm text-base-content/50 leading-relaxed">
            Supports T-Ball, T-Shirt, 8U, 10U, and 12U baseball and softball.
          </p>
        </div>
        <div className="card bg-white border border-base-300 rounded-[10px] p-5">
          <h3 className="text-base font-bold mb-1">MAA Field 2</h3>
          <p className="text-sm text-base-content/50 leading-relaxed">
            Supports T-Ball, T-Shirt, 8U and 10U baseball, and 8U, 10U, and 12U softball.
          </p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-3">Rental Rates</h2>
      <div className="grid grid-cols-2 gap-3 max-w-full md:max-w-[calc(50%-6px)]">
        <div className="card bg-white border border-base-300 rounded-lg p-4 text-center">
          <div className="text-xs text-base-content/50 font-semibold mb-1">Without Lights</div>
          <div className="text-[26px] font-serif text-secondary">
            $15<span className="text-sm font-normal">/hr</span>
          </div>
        </div>
        <div className="card bg-white border border-base-300 rounded-lg p-4 text-center">
          <div className="text-xs text-base-content/50 font-semibold mb-1">With Lights</div>
          <div className="text-[26px] font-serif text-secondary">
            $35<span className="text-sm font-normal">/hr</span>
          </div>
          <div className="text-[11px] text-base-content/30 mt-0.5">+$20/hr for lights</div>
        </div>
      </div>
      <p className="text-[13px] text-base-content/50 mt-3">
        Example: 1 hr without lights + 1 hr with lights = $15 + $35 = $50
      </p>
      <p className="text-[13px] text-base-content/50 mt-4">
        To reserve, contact meadowathleticassociation@gmail.com.
      </p>
    </div>
  );
}
```

This is identical to the prototype's `FieldsPage.tsx` other than the import path (`../../utils` instead of `../utils`).

- [ ] **Step 3: Verify in browser**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run dev
```

Navigate to `http://localhost:5174/maa-frontend/#/field-rentals`. Verify:
- Heading "Field Rentals" with the gold underline bar.
- Aerial image displays with two field labels positioned over Field 1 and Field 2.
- Two field-description cards side by side on wide screens, stacked on mobile.
- Two rate cards (Without Lights $15/hr, With Lights $35/hr).
- Example sentence and contact line at the bottom.

Stop the dev server.

- [ ] **Step 4: Verify lint and build**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/pages/fields/index.tsx public/static/fields-aerial.jpg
git -C /Users/josh/Code/maa/maa-frontend commit -m "Port Field Rentals page"
```

---

<a id="task-7"></a>
### Task 7: Sponsorship page

**Files:**
- Modify: `maa-frontend/src/pages/sponsors/index.tsx`
- Create: `maa-frontend/src/pages/sponsors/tiers.tsx`
- Create: `maa-frontend/public/static/sponsorship-form.pdf`

The Sponsorship page extracts its three tier cards into a sibling `tiers.tsx` (`.tsx` because each tier has icon JSX and a CTA element). The tier shape is a flexible record — single optional fields rather than a discriminated union, since the differences between tiers are display-only.

- [ ] **Step 1: Copy the sponsorship form PDF**

```bash
cp /Users/josh/Code/maa/maa-prototype/public/static/sponsorship-form.pdf \
   /Users/josh/Code/maa/maa-frontend/public/static/sponsorship-form.pdf
```

- [ ] **Step 2: Create `pages/sponsors/tiers.tsx`**

Create `maa-frontend/src/pages/sponsors/tiers.tsx`:

```tsx
import { B_URL, Ic, icons } from '../../utils';

export type Tier = {
  icon: string;
  title: string;
  /** Rendered above the bullet list. JSX so each tier can express its own price layout. */
  price: React.ReactNode;
  bullets: string[];
  /** Optional CTA rendered below the bullets. JSX so it can be a link, an `<a>` to a PDF, etc. */
  cta?: React.ReactNode;
  /** Optional plain-text note below the bullets (used by tiers without a CTA). */
  note?: string;
};

export const tiers: Tier[] = [
  {
    icon: icons.star,
    title: 'Field Banner',
    price: (
      <div className="flex gap-4 justify-center items-end my-2">
        <div className="text-center">
          <div className="text-[26px] font-bold font-serif text-secondary">
            $175<span className="text-base font-semibold">/yr</span>
          </div>
          <div className="text-[11px] text-base-content/50 mt-0.5">for 3 years</div>
        </div>
        <div className="text-base-content/30 text-[13px] pb-4.5">or</div>
        <div className="text-center">
          <div className="text-[26px] font-bold font-serif text-secondary">$500</div>
          <div className="text-[11px] text-base-content/50 mt-0.5">one-time</div>
        </div>
      </div>
    ),
    bullets: [
      'Two banners — one on an MAA field, one on a school field',
      'Seen by players, families & fans all season',
      'Covers three full seasons',
    ],
    cta: (
      <a
        href={B_URL + 'static/sponsorship-form.pdf'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-3.5 text-secondary font-semibold text-[13px] no-underline"
      >
        <Ic d={icons.dl} s={13} /> Download Sponsorship Form
      </a>
    ),
  },
  {
    icon: icons.heart,
    title: 'Team Sponsor',
    price: (
      <>
        <div className="text-[26px] font-bold font-serif text-secondary my-1.5">$250</div>
        <div className="text-xs text-base-content/50 mb-2.5">per team · per season</div>
      </>
    ),
    bullets: [
      'Sponsor a specific team for one season',
      'Sponsor name on team jersey',
      'Available for any sport or age group',
    ],
    note: 'Let us know during player registration.',
  },
  {
    icon: icons.mail,
    title: 'Custom Opportunity',
    price: (
      <>
        <div className="text-[26px] font-bold font-serif text-secondary my-1.5">Let&rsquo;s Talk</div>
        <div className="text-xs text-base-content/50 mb-2.5">we'll work with you</div>
      </>
    ),
    bullets: ['Event sponsorship', 'Equipment donation', 'Other creative partnerships'],
    note: "Have another idea? We'd love to hear it.",
    cta: (
      <a
        href="mailto:meadowathleticassociation@gmail.com"
        className="inline-flex items-center gap-1.5 mt-3.5 text-secondary font-semibold text-[13px] no-underline"
      >
        <Ic d={icons.mail} s={13} /> Contact Us
      </a>
    ),
  },
];
```

- [ ] **Step 3: Replace the Sponsors stub with the full page**

Overwrite `maa-frontend/src/pages/sponsors/index.tsx`:

```tsx
import { Ic } from '../../utils';
import { tiers } from './tiers';

function Check() {
  return <span className="text-primary font-bold mr-1.5">✓</span>;
}

export default function SponsorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Become a Sponsor</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">
        MAA relies on local businesses and families to keep registration fees affordable and our
        fields well-maintained. There are several ways to get involved.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5 justify-items-center">
        {tiers.map((t) => (
          <div
            key={t.title}
            className="card bg-white border border-primary rounded-[10px] p-5.5 text-center w-68.75"
          >
            <Ic d={t.icon} s={24} style={{ margin: '0 auto 6px', display: 'block' }} />
            <h3 className="text-lg font-bold mb-0.5">{t.title}</h3>
            {t.price}
            <ul className="text-[13px] text-base-content/70 text-left list-none p-0 mt-2.5 mb-0 leading-6">
              {t.bullets.map((b) => (
                <li key={b}>
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
            {t.note && (
              <div className="text-sm text-base-content/50 mt-5 leading-relaxed">{t.note}</div>
            )}
            {t.cta}
          </div>
        ))}
      </div>
      <p className="text-[13px] text-base-content/50 mt-5">
        To get started, contact us at meadowathleticassociation@gmail.com.
      </p>
    </div>
  );
}
```

The `Check` helper stays inline in `index.tsx` — it's a one-line presentational helper used only by the bullet rendering, no value extracting it.

- [ ] **Step 4: Verify in browser**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run dev
```

Navigate to `http://localhost:5174/maa-frontend/#/sponsorship`. Verify:
- Heading "Become a Sponsor" with the gold underline.
- Three tier cards in a row on wide screens, stacked on mobile.
- Field Banner card shows two prices ($175/yr · for 3 years / $500 one-time) with "or" between them, three bullets, and a "Download Sponsorship Form" link that opens the PDF.
- Team Sponsor card shows $250 / per team · per season, three bullets, and the "Let us know during player registration." note.
- Custom Opportunity card shows "Let's Talk", three bullets, the "Have another idea?…" note, and a "Contact Us" mailto link.
- Footer line "To get started, contact us at meadowathleticassociation@gmail.com."

Stop the dev server.

- [ ] **Step 5: Verify lint and build**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/pages/sponsors public/static/sponsorship-form.pdf
git -C /Users/josh/Code/maa/maa-frontend commit -m "Port Sponsorship page with extracted tiers"
```

---

<a id="task-8"></a>
### Task 8: FAQ page

**Files:**
- Modify: `maa-frontend/src/pages/faq/index.tsx`
- Create: `maa-frontend/src/pages/faq/questions.tsx`

FAQ is the most content-heavy page. Q&A array (with rich JSX answers and a local `Sh` helper for season subheaders) extracts to `questions.tsx`. The page itself keeps the heading, accordion toggle state, and render loop.

- [ ] **Step 1: Create `pages/faq/questions.tsx`**

Create `maa-frontend/src/pages/faq/questions.tsx`:

```tsx
const Sh = ({ l, first }: { l: string; first?: boolean }) => (
  <div
    className={`font-bold text-secondary uppercase text-lg tracking-wide ${first ? '' : 'mt-2.5'} mb-0.5`}
  >
    {l}
  </div>
);

export type FaqEntry = {
  q: string;
  a: React.ReactNode;
  link?: { l: string; p: 'about' | 'faq' | 'fields' | 'sponsors' };
};

export const questions: FaqEntry[] = [
  {
    q: 'What sports does MAA typically offer?',
    a: (
      <>
        <Sh l="Spring" first />
        <ul className="pl-5 mt-1.5 leading-[1.9] list-disc">
          <li>T-Ball (Coed, ages 3–4)</li>
          <li>T-Shirt (Coed, ages 5–6)</li>
          <li>Baseball (8U, 10U, 12U — boys)</li>
          <li>Softball (8U, 10U, 12U — girls)</li>
        </ul>
        <Sh l="Fall" />
        <ul className="pl-5 mt-1.5 leading-[1.9] list-disc">
          <li>Soccer (6U Coed, 8U Boys, 8U Girls)</li>
          <li>Baseball (8U, 10U, 12U — boys)</li>
          <li>Softball (8U, 10U, 12U — girls)</li>
        </ul>
        <Sh l="Winter" />
        <ul className="pl-5 mt-1.5 leading-[1.9] list-disc">
          <li>Basketball (6U Coed, 8U/10U/12U/15U boys, 8U/10U/12U girls)</li>
          <li>Volleyball (8U, 10U, 12U)</li>
        </ul>
      </>
    ),
  },
  {
    q: 'When does registration open?',
    a: (
      <>
        <Sh l="Spring" first />
        Typically opens mid-January and runs through February.
        <Sh l="Fall" />
        Opens early July through early August.
        <Sh l="Winter" />
        Opens early October through early November.
        <div className="mt-1.5 text-[11px] text-base-content/50">
          Deadlines may close earlier if an age group fills.
        </div>
      </>
    ),
  },
  {
    q: 'When does each season start?',
    a: (
      <>
        <Sh l="Spring" first />
        Practices begin in March; games start in April.
        <Sh l="Fall" />
        Practices begin in late August; games start mid-September.
        <Sh l="Winter" />
        Practices begin in early December; games start in early January.
      </>
    ),
  },
  {
    q: 'When do practices start?',
    a: (
      <>
        <Sh l="Spring" first />
        Baseball, softball, T-Ball, and T-Shirt practices begin in March.
        <Sh l="Fall" />
        Soccer practices begin in late August.
        <Sh l="Winter" />
        Volleyball practices begin in early December.
      </>
    ),
  },
  {
    q: 'When are games scheduled?',
    a: (
      <>
        <Sh l="Spring" first />
        Baseball and softball games are mostly Monday, Tuesday, and Thursday evenings. T-Ball games
        start at 6:30 PM; T-Shirt games start at 7:15–7:30 PM.
        <Sh l="Fall" />
        Soccer games are mostly Monday, Tuesday, and Thursday.
        <Sh l="Winter" />
        Volleyball games are mostly Saturday with some Tuesday and Thursday.
      </>
    ),
  },
  {
    q: 'How do I volunteer to coach?',
    a: 'Indicate your interest during registration. The board will follow up with details before the season starts.',
  },
  {
    q: 'How do coaches communicate with families?',
    a: 'Coaches coordinate with families via group text message.',
  },
  {
    q: 'How do I become a sponsor?',
    a: 'MAA offers field banner sponsorships and per-team seasonal sponsorships.',
    link: { l: 'View sponsorship options', p: 'sponsors' },
  },
  {
    q: 'Is MAA a non-profit?',
    a: 'Yes. MAA has been a volunteer-run, non-profit organization serving the Meadow community since 1976, governed by 21 members and a Treasurer.',
    link: { l: 'Learn more about MAA', p: 'about' },
  },
];
```

Note: the `link.p` type is narrowed to the marketing page keys only — `register`/`cart`/`admin` are gone, so the link target type can no longer accept those strings.

- [ ] **Step 2: Replace the FAQ stub with the page implementation**

Overwrite `maa-frontend/src/pages/faq/index.tsx`:

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS } from '../../utils';
import { questions } from './questions';

export default function FaqPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Frequently Asked Questions</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      {questions.map((f, i) => (
        <div className="border border-secondary rounded-[9px] p-4 mb-2" key={i}>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <h4 className="text-base font-semibold">{f.q}</h4>
            <span className="text-base-content/30 ml-2">{open === i ? '▾' : '▸'}</span>
          </div>
          {open === i && (
            <div className="text-sm text-base-content/50 leading-relaxed mt-2.5 bg-base-100 rounded-[5px] p-2">
              {f.a}
              {f.link && (
                <button
                  className="btn btn-ghost btn-sm mt-2 inline-flex"
                  onClick={() => navigate(PAGE_PATHS[f.link!.p])}
                >
                  {f.link.l} →
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run dev
```

Navigate to `http://localhost:5174/maa-frontend/#/faq`. Verify:
- Heading "Frequently Asked Questions" with gold underline.
- Nine collapsible question cards.
- Clicking a question expands it and shows the answer with proper Spring/Fall/Winter subheaders styled in gold.
- Clicking again collapses it; clicking a different question collapses the previous and opens the new one.
- The "How do I become a sponsor?" answer has a "View sponsorship options →" button that navigates to `/sponsorship`.
- The "Is MAA a non-profit?" answer has a "Learn more about MAA →" button that navigates to `/about`.

Stop the dev server.

- [ ] **Step 4: Verify lint and build**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/pages/faq
git -C /Users/josh/Code/maa/maa-frontend commit -m "Port FAQ page with extracted questions"
```

---

<a id="task-9"></a>
### Task 9: About page

**Files:**
- Modify: `maa-frontend/src/pages/about/index.tsx`
- Create: `maa-frontend/src/pages/about/board.ts`
- Create: `maa-frontend/src/pages/about/copy.ts`

The prototype's About page has two separate arrays — `board` (4 officers with roles) and `members` (18 names without roles). v1 unifies them into one `BoardMember[]` where the `role` field is optional. The page renders two visual sections derived from the same source.

- [ ] **Step 1: Create `pages/about/board.ts`**

Create `maa-frontend/src/pages/about/board.ts`:

```ts
export type BoardMember = { name: string; role?: string };

export const board: BoardMember[] = [
  { name: 'Karla Parnell', role: 'President' },
  { name: 'Justin Massengill', role: 'Vice President' },
  { name: 'Parker Johnson', role: 'Secretary' },
  { name: 'Tiffany Adams', role: 'Treasurer' },
  { name: 'Blake Adams' },
  { name: 'David Allen' },
  { name: 'Johnathan Barefoot' },
  { name: 'Waylon Dale Barefoot' },
  { name: 'Drew Boyd' },
  { name: 'Alex Dunn' },
  { name: 'Craig Hardin' },
  { name: 'Anthony Harrington' },
  { name: 'Chris Hudson' },
  { name: 'Chris Johnson' },
  { name: 'Thomas Johnson' },
  { name: 'Justin Knight' },
  { name: 'Johnathan Lee' },
  { name: 'Michael Poe' },
  { name: 'Samantha Poe' },
  { name: 'Josh Smith' },
  { name: 'Keith Wall' },
  { name: 'Brandon Williams' },
];
```

- [ ] **Step 2: Create `pages/about/copy.ts`**

Create `maa-frontend/src/pages/about/copy.ts`:

```ts
export const intro =
  'We are a multiple sport athletic association, serving the Meadow community. We are a non-profit organization and a part of our area since 1976. We are run by all volunteers, currently consisting of 21 members and a Treasurer.';

export const boardLead = 'MAA is governed by a volunteer board of directors elected by the membership.';

export const contactEmail = 'meadowathleticassociation@gmail.com';

export const facebookUrl = 'https://www.facebook.com/groups/169287900378142';
```

- [ ] **Step 3: Replace the About stub with the page implementation**

Overwrite `maa-frontend/src/pages/about/index.tsx`:

```tsx
import { Ic, icons } from '../../utils';
import { board } from './board';
import { intro, boardLead, contactEmail, facebookUrl } from './copy';

export default function AboutPage() {
  const officers = board.filter((m) => m.role);
  const members = board.filter((m) => !m.role);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">About the Meadow Athletic Association</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">{intro}</p>
      <h2 className="text-xl font-bold mb-2">Our Board</h2>
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">{boardLead}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 mb-8">
        {officers.map((o) => (
          <div
            className="card bg-white border border-secondary rounded-[9px] p-4.5 text-center"
            key={o.name}
          >
            <div className="w-12 h-12 rounded-full bg-[#FBF7EC] flex items-center justify-center mx-auto mb-2 text-primary">
              <Ic d={icons.user} s={22} />
            </div>
            <h4 className="text-sm font-semibold">{o.name}</h4>
            <p className="text-[11px] text-base-content/50">{o.role}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">Members</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2.5 mb-8">
        {members.map((m) => (
          <span
            key={m.name}
            className="text-[13px] text-base-content/70 bg-base-100 border border-base-300 py-1.5 px-1 rounded-[5px] text-center"
          >
            {m.name}
          </span>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-4">Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card bg-white border border-base-300 rounded-[10px] p-5">
          <h3 className="text-base font-bold mb-1">Get in Touch</h3>
          <p className="flex items-center gap-1.5 text-sm text-base-content/50">
            <Ic d={icons.mail} s={14} />
            {contactEmail}
          </p>
        </div>
        <div className="card bg-white border border-base-300 rounded-[10px] p-5">
          <h3 className="text-base font-bold mb-1">Follow Us</h3>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#1877F2] font-semibold text-sm no-underline"
          >
            <Ic d={icons.fb} s={16} />
            Join us on Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run dev
```

Navigate to `http://localhost:5174/maa-frontend/#/about`. Verify:
- Heading and gold underline.
- Intro paragraph renders.
- "Our Board" section with four officer cards (President, VP, Secretary, Treasurer) — each with a circular user icon, name, and role beneath.
- "Members" section with 18 member badges in a grid.
- "Contact" section with two cards: email + Facebook link.

Stop the dev server.

- [ ] **Step 5: Verify lint and build**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/pages/about
git -C /Users/josh/Code/maa/maa-frontend commit -m "Port About page with unified board model"
```

---

<a id="task-10"></a>
### Task 10: Home — content files

**Files:**
- Create: `maa-frontend/src/pages/home/programs.ts`
- Create: `maa-frontend/src/pages/home/copy.ts`
- Create: `maa-frontend/public/static/field-1.jpg` (hero background)

The home page is a rewrite, not a port. Phase 1 is just content files; Phase 2 (next task) is the index.tsx that consumes them.

- [ ] **Step 1: Copy the hero background image**

```bash
cp /Users/josh/Code/maa/maa-prototype/public/static/field-1.jpg \
   /Users/josh/Code/maa/maa-frontend/public/static/field-1.jpg
```

- [ ] **Step 2: Create `pages/home/programs.ts`**

Create `maa-frontend/src/pages/home/programs.ts`:

```ts
export type ProgramItem = { name: string; ages: string[] };
export type Season = { label: string; items: ProgramItem[] };

export const programs: Season[] = [
  {
    label: 'Spring',
    items: [
      { name: 'T-Ball', ages: ['3–4'] },
      { name: 'T-Shirt', ages: ['5–6'] },
      { name: 'Baseball', ages: ['8U', '10U', '12U'] },
      { name: 'Softball', ages: ['8U', '10U', '12U'] },
    ],
  },
  {
    label: 'Fall',
    items: [
      { name: 'Soccer', ages: ['6U', '8U'] },
      { name: 'Baseball', ages: ['8U', '10U', '12U'] },
      { name: 'Softball', ages: ['8U', '10U', '12U'] },
    ],
  },
  {
    label: 'Winter',
    items: [
      { name: 'Basketball', ages: ['6U', '8U', '10U', '12U', '15U'] },
      { name: 'Volleyball', ages: ['8U', '10U', '12U'] },
    ],
  },
];
```

This is identical content to the prototype's `SPORTS` constant, with the type made explicit.

- [ ] **Step 3: Create `pages/home/copy.ts`**

Create `maa-frontend/src/pages/home/copy.ts`:

```ts
import { B_URL } from '../../utils';

export const hero = {
  /** The headline JSX-friendly version is rendered in index.tsx; this is the plain string. */
  headline: 'Meadow Athletic Association',
  subhead:
    'Youth recreational sports for the Meadow community. Building character, teamwork, and lifelong memories.',
  backgroundImage: B_URL + 'static/field-1.jpg',
};

export const intro = {
  heading: 'Welcome',
  body: 'MAA has served the Meadow community since 1976. Whether your child is just starting out or chasing a championship, we have a program for every age and season.',
};

export const programsSection = {
  heading: 'What We Offer',
  subhead: 'Youth sports across three seasons',
};

export const outro = {
  heading: 'Get Involved',
  body: 'Have questions about registration, want to coach, or interested in sponsoring? We would love to hear from you.',
};
```

The `intro` and `outro` strings are placeholder copy — concrete enough to render meaningfully, with the expectation the user will iterate on them.

- [ ] **Step 4: Verify lint and build**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass. (These files are not yet imported anywhere, so unused-export warnings are not produced — TypeScript doesn't flag unused exports by default.)

- [ ] **Step 5: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/pages/home/programs.ts src/pages/home/copy.ts public/static/field-1.jpg
git -C /Users/josh/Code/maa/maa-frontend commit -m "Add home page content files (programs, copy, hero asset)"
```

---

<a id="task-11"></a>
### Task 11: Home — index.tsx

**Files:**
- Modify: `maa-frontend/src/pages/home/index.tsx`

This task replaces the home page stub with the full composed page. Section components live inline because they're small.

- [ ] **Step 1: Overwrite `pages/home/index.tsx`**

Overwrite `maa-frontend/src/pages/home/index.tsx`:

```tsx
import { hero, intro, programsSection, outro } from './copy';
import { programs } from './programs';

function Hero() {
  return (
    <div
      className="relative bg-cover bg-center px-7 text-white text-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${hero.backgroundImage}')`,
        padding: '64px 28px 180px',
      }}
    >
      <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-1.5">
        <span className="text-primary">M</span>eadow <span className="text-primary">A</span>
        thletic <span className="text-primary">A</span>ssociation
      </h1>
      <p className="text-base opacity-55 max-w-[440px] mx-auto mb-8 leading-relaxed">
        {hero.subhead}
      </p>
    </div>
  );
}

function Intro() {
  return (
    <div className="card bg-white shadow-[0_3px_20px_rgba(0,0,0,.05)] border border-base-300 rounded-xl p-5 -mt-34 max-w-[600px] mx-auto relative z-10 mb-10">
      <h3 className="text-[17px] font-bold">{intro.heading}</h3>
      <p className="text-[13px] text-base-content/50 mt-0.5 leading-relaxed">{intro.body}</p>
    </div>
  );
}

function ProgramsOffered() {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-[20px] font-bold">{programsSection.heading}</h3>
        <p className="text-[13px] text-base-content/50">{programsSection.subhead}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.map((season) => (
          <div key={season.label}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/50 text-center mb-2">
              {season.label}
            </div>
            {season.items.map((i) => (
              <div
                className="card bg-white border border-base-300 rounded-[10px] p-4.5 mb-2"
                key={i.name}
              >
                <h4 className="font-serif font-semibold text-base">{i.name}</h4>
                <ul className="flex flex-wrap gap-1 mt-1">
                  {i.ages.map((a) => (
                    <li key={a} className="badge badge-ghost badge-sm">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Outro() {
  return (
    <div className="mt-10 mb-4 text-center">
      <h3 className="text-[20px] font-bold mb-1">{outro.heading}</h3>
      <p className="text-[14px] text-base-content/60 leading-relaxed max-w-[600px] mx-auto">
        {outro.body}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Intro />
        <ProgramsOffered />
        <Outro />
      </div>
    </div>
  );
}
```

Notes:
- The Hero JSX preserves the prototype's "M-A-A" gold-letter styling rather than using `hero.headline` directly, because that visual treatment is structural (it's three highlighted spans inside a single heading). The plain string in `copy.ts` is exported anyway in case it's ever needed for `<title>` or meta tags.
- `Intro` overlaps the hero (`-mt-34` pulls it up into the dark gradient) — same visual treatment as the prototype's no-active-season "Registration" card. The Intro's content is now flexible copy instead of a registration placeholder.
- `Outro` is a new flexible content section below the program grid.

- [ ] **Step 2: Verify in browser**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run dev
```

Navigate to `http://localhost:5174/maa-frontend/`. Verify:
- Hero renders with the field-1.jpg background, dark gradient overlay, and "Meadow Athletic Association" heading with the M, A, A in gold.
- Intro card overlaps the hero edge (white card pulled up into the dark area), shows "Welcome" heading and the intro body text.
- "What We Offer" section shows three columns (Spring / Fall / Winter), each with the appropriate program cards and age badges.
- Outro section below the grid shows "Get Involved" heading and the outro body text, centered.

Stop the dev server.

- [ ] **Step 3: Verify lint and build**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/pages/home/index.tsx
git -C /Users/josh/Code/maa/maa-frontend commit -m "Compose home page (Hero, Intro, ProgramsOffered, Outro)"
```

---

<a id="task-12"></a>
### Task 12: Asset & icon audit

**Files:**
- Modify: `maa-frontend/public/static/` (delete unreferenced files)
- Modify: `maa-frontend/src/utils.tsx` (trim icons map)

Now that all pages are implemented, drop static assets and icon-map entries that nothing references.

- [ ] **Step 1: Audit static asset references**

```bash
cd /Users/josh/Code/maa/maa-frontend && grep -rn "static/" src/ | grep -v ".d.ts"
```

Expected references (any deviation, investigate before deleting):
- `static/maa-large.jpg` — App.tsx (logo)
- `static/fields-aerial.jpg` — pages/fields/index.tsx
- `static/sponsorship-form.pdf` — pages/sponsors/tiers.tsx
- `static/field-1.jpg` — pages/home/copy.ts

```bash
ls /Users/josh/Code/maa/maa-frontend/public/static/
```

Should currently show only those four files. If any other files were copied earlier by mistake, delete them now:

```bash
# Example — only run for files not in the expected list above:
# rm /Users/josh/Code/maa/maa-frontend/public/static/<unwanted-file>
```

- [ ] **Step 2: Audit icon-map references**

```bash
cd /Users/josh/Code/maa/maa-frontend && grep -rn "icons\." src/ | grep -v "src/utils.tsx"
```

Expected references:
- `icons.info`, `icons.help`, `icons.map`, `icons.star` — App.tsx (navbar)
- `icons.user`, `icons.mail`, `icons.fb` — pages/about/index.tsx
- `icons.star`, `icons.heart`, `icons.mail`, `icons.dl` — pages/sponsors/tiers.tsx

Combined keep set: `info`, `help`, `map`, `star`, `user`, `mail`, `fb`, `heart`, `dl`.

- [ ] **Step 3: Trim the icons map in `src/utils.tsx`**

Open `maa-frontend/src/utils.tsx` and replace the `icons` constant with this minimal version:

```tsx
export const icons: Record<string, string> = {
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  heart:
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
};
```

(Drop the `ball`, `home`, `users`, `chk`, `chev`, `plus`, `award`, `cal`, `phone` entries. The `Ic` helper, `B_URL`, `PAGE_PATHS`, and the `eslint-disable` comment all stay unchanged.)

- [ ] **Step 4: Verify lint, build, and quick browser smoke test**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build && npm run dev
```

Quick smoke test in the browser — visit `/`, `/about`, `/faq`, `/field-rentals`, `/sponsorship` and confirm icons still render on each page (no missing-icon empty SVGs).

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git -C /Users/josh/Code/maa/maa-frontend add src/utils.tsx public/static
git -C /Users/josh/Code/maa/maa-frontend commit -m "Trim unused icons; verify static assets match references"
```

---

<a id="task-13"></a>
### Task 13: Final build + deploy

**Files:**
- (no source changes — this task verifies CI/CD and pushes)

- [ ] **Step 1: Format the source tree**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run format && npm run format:check
```

Expected: `format` writes any pending formatting fixes; `format:check` then passes.

- [ ] **Step 2: Run lint and build one final time**

```bash
cd /Users/josh/Code/maa/maa-frontend && npm run lint && npm run build
```

Expected: both pass with no errors.

- [ ] **Step 3: Commit any formatting changes (if any)**

```bash
git -C /Users/josh/Code/maa/maa-frontend status
```

If `git status` shows changes from the format step, commit them:

```bash
git -C /Users/josh/Code/maa/maa-frontend add -u
git -C /Users/josh/Code/maa/maa-frontend commit -m "Apply Prettier formatting"
```

If there are no changes, skip the commit.

- [ ] **Step 4: Confirm GitHub Pages is enabled in the repo settings**

This is a manual step in the GitHub web UI:
1. Open the `maa-frontend` repo's Settings → Pages.
2. Under "Build and deployment", set Source to **GitHub Actions**.
3. (No manual workflow selection needed — `actions/deploy-pages` does this.)

If Pages is already configured, skip this step.

- [ ] **Step 5: Push to origin/main**

```bash
git -C /Users/josh/Code/maa/maa-frontend push origin main
```

Pushing to main triggers the deploy workflow at `.github/workflows/deploy.yml`.

- [ ] **Step 6: Watch the deploy workflow**

```bash
gh -R <owner>/maa-frontend run watch
```

(Replace `<owner>` with the actual GitHub user/org. If the `gh` CLI is authenticated to the right account, it can also be inferred — or watch the Actions tab in the browser.)

Expected: the workflow's `build` job runs `npm ci` + `npm run build`, uploads the `dist/` artifact, then the `deploy` job publishes to Pages.

- [ ] **Step 7: Verify the live URL**

Open `https://<owner>.github.io/maa-frontend/` in a browser. Verify:
- Home page renders (hero + intro + programs + outro).
- All four other pages reachable via the navbar and render correctly.
- Static assets (logo, hero image, aerial image, sponsorship PDF) all load.
- Hash routing works (e.g., refreshing on `#/about` keeps you on the About page rather than 404).

If anything is broken, fix forward — don't roll back. Common issues:
- Missing static asset: confirm `public/static/<file>` exists and the reference uses `B_URL + 'static/<file>'`.
- 404 on the base URL: confirm `vite.config.ts` has `base: '/maa-frontend/'`.

---

## Self-Review Notes

Reviewed against `design.md` after writing:

- ✅ All five marketing pages covered (Tasks 6–11).
- ✅ Page-as-directory layout for every page (Tasks 5–11).
- ✅ Content extraction matches design (programs.ts + copy.ts for home, board.ts + copy.ts for about, questions.tsx for faq, tiers.tsx for sponsors, inline for fields).
- ✅ Unified `BoardMember[]` model with optional `role` (Task 9).
- ✅ Registration / cart / admin / context / hooks / waivers explicitly not ported (visible in trimmed App.tsx in Task 4 and trimmed utils.tsx in Task 3).
- ✅ HashRouter + `base: '/maa-frontend/'` (Tasks 1, 2, 5).
- ✅ GitHub Pages deploy via existing prototype workflow (Tasks 1, 13).
- ✅ Asset and icon audit done after pages exist (Task 12), so the audit reflects actual usage.
