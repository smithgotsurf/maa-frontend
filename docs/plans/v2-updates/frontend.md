# MAA Frontend v2 — Site Updates Implementation Plan

> Design: [design.md](./design.md)

**Goal:** Implement the v2 site updates — homepage rework, new global footer, shared `contactEmail` constant, favicon, accessibility fixes, CI lint step, and dead-CSS cleanup.

**Architecture:** No structural changes to the stack. Adds two new components (`Footer`, `ContactSection`) and one new shared content module (`src/content.ts`). Touches `App.tsx`, all five page directories (some only via the `contactEmail` constant), `index.html`, `index.css`, and `.github/workflows/deploy.yml`.

**Verification model:** No automated tests (per v1 design). Each task verifies via browser inspection at `http://localhost:5174/maa-frontend/`, lint pass (`npm run lint`), and TypeScript build (`npm run build`). The user runs the dev server and confirms visual changes; an a11y task can be sanity-checked via keyboard tabbing.

**Code Review Checkpoints:**
- **Checkpoint 1:** After Tasks 1–7 (shared content, Footer, ContactSection, favicon, homepage rework) — full homepage + footer ship; visual half of the work is done
- **Checkpoint 2:** After Tasks 8–10 (a11y pass) — keyboard / screen-reader correctness verified
- **Final Review:** After Tasks 11–12 (CI lint + dead CSS) — repo clean, CI catches lint failures

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Shared content module](#task-1) | Create `src/content.ts`; migrate `contactEmail` and `facebookUrl`; update call sites | sonnet |
| 2 | [ContactSection component](#task-2) | Extract About's contact cards into `src/components/ContactSection.tsx`; About uses it | sonnet |
| 3 | [Footer component](#task-3) | Create `src/components/Footer.tsx` with brand, nav, contact, copyright | sonnet |
| 4 | [Wire Footer into App](#task-4) | Render `<Footer/>` after `<Outlet/>` in `App.tsx` | sonnet |
| 5 | [Favicon](#task-5) | Add `public/favicon.png` (logo) and `<link rel="icon">` in `index.html` | sonnet |
| 6 | [Home copy refactor](#task-6) | Update `home/copy.ts`: rename `outro` → `getInvolved`, add `teasers` | sonnet |
| 7 | [Home page rework](#task-7) | Restyle headings, enlarge season labels, add `GetInvolved` + `MoreOnTheSite` sections | sonnet |
| 8 | [FAQ a11y fix](#task-8) | Convert accordion header `<div onClick>` to `<button aria-expanded>` | sonnet |
| 9 | [Mobile nav a11y fix](#task-9) | Conditional render or `inert` on the off-canvas nav | sonnet |
| 10 | [Checkmark a11y fix](#task-10) | `aria-hidden="true"` on the `<Check />` span in sponsors | sonnet |
| 11 | [CI lint step](#task-11) | Add `npm run lint` before `npm run build` in `deploy.yml` | sonnet |
| 12 | [Dead CSS cleanup](#task-12) | Delete `.table` block from `src/index.css` | sonnet |

---

<a id="task-1"></a>
### Task 1: Shared content module

**Files:**
- Create: `src/content.ts`
- Modify: `src/pages/about/copy.ts` (drop `contactEmail` and `facebookUrl`, re-export from `src/content.ts` if needed elsewhere)
- Modify: `src/pages/fields/index.tsx` (replace inline email)
- Modify: `src/pages/sponsors/index.tsx` (replace inline email)
- Modify: `src/pages/sponsors/tiers.tsx` (replace inline email if present)

- [ ] **Step 1:** Create `src/content.ts`:

```ts
export const contactEmail = 'meadowathleticassociation@gmail.com';
export const facebookUrl = 'https://www.facebook.com/MeadowAthleticAssociation/';
```

(Use the exact `facebookUrl` value currently in `pages/about/copy.ts` — confirm before writing.)

- [ ] **Step 2:** Update `pages/about/copy.ts` to import from `src/content.ts`. If `contactEmail` and `facebookUrl` were the only constants there, simplify the file to its remaining exports. The About page can `import { contactEmail, facebookUrl } from '../../content'` directly going forward.

- [ ] **Step 3:** Update `pages/fields/index.tsx` (line ~58, the inline `meadowathleticassociation@gmail.com` reservation line) to import `contactEmail` from `src/content.ts` and use the constant.

- [ ] **Step 4:** Same treatment for `pages/sponsors/index.tsx` (line ~42).

- [ ] **Step 5:** Same treatment for `pages/sponsors/tiers.tsx` if it references the literal string.

- [ ] **Step 6:** Verify: `npm run lint && npm run build`. Grep for the literal email — only `src/content.ts` should match.

---

<a id="task-2"></a>
### Task 2: ContactSection component

**Files:**
- Create: `src/components/ContactSection.tsx`
- Modify: `src/pages/about/index.tsx`

- [ ] **Step 1:** Create `src/components/ContactSection.tsx` carrying the existing two-card grid from About (lines 41–61):

```tsx
import { Ic, icons } from '../utils';
import { contactEmail, facebookUrl } from '../content';

export default function ContactSection() {
  return (
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
  );
}
```

- [ ] **Step 2:** Update `pages/about/index.tsx`: keep the `<h2>Contact</h2>` heading, replace the inline two-card grid with `<ContactSection />`. Remove the now-unused `contactEmail` and `facebookUrl` imports from About's `copy.ts` import line.

- [ ] **Step 3:** Verify: visually About's contact section is unchanged. `npm run lint && npm run build`.

---

<a id="task-3"></a>
### Task 3: Footer component

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1:** Create `src/components/Footer.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { Ic, icons, PAGE_PATHS } from '../utils';
import { contactEmail, facebookUrl } from '../content';

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-12">
      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-serif text-[19px]">
            <span className="text-primary font-bold">M</span>eadow{' '}
            <span className="text-primary font-bold">A</span>thletic{' '}
            <span className="text-primary font-bold">A</span>ssociation
          </div>
          <p className="text-sm text-neutral-content/60 mt-2 leading-relaxed">
            Youth sports for the Meadow community since 1976.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-content/50 mb-2">
            Site
          </h4>
          <ul className="flex flex-col gap-1 text-sm">
            <li><Link to={PAGE_PATHS.about} className="text-neutral-content/80 hover:text-primary">About</Link></li>
            <li><Link to={PAGE_PATHS.faq} className="text-neutral-content/80 hover:text-primary">FAQ</Link></li>
            <li><Link to={PAGE_PATHS.fields} className="text-neutral-content/80 hover:text-primary">Field Rentals</Link></li>
            <li><Link to={PAGE_PATHS.sponsorship} className="text-neutral-content/80 hover:text-primary">Sponsorship</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-content/50 mb-2">
            Contact
          </h4>
          <p className="flex items-center gap-1.5 text-sm text-neutral-content/80 mb-2">
            <Ic d={icons.mail} s={14} />
            <a href={`mailto:${contactEmail}`} className="hover:text-primary">{contactEmail}</a>
          </p>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-content/80 hover:text-primary"
          >
            <Ic d={icons.fb} s={14} />
            Facebook
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-3 text-xs text-neutral-content/50">
          © {new Date().getFullYear()} Meadow Athletic Association
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2:** Confirm `PAGE_PATHS` keys match (`about`, `faq`, `fields`, `sponsorship`). Read `src/utils.tsx` if uncertain.

---

<a id="task-4"></a>
### Task 4: Wire Footer into App

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1:** Import the Footer and render it after `<Outlet/>`. The page content should grow to push the footer down without forcing it to the bottom of the viewport (`min-h-screen` flex layout would be over-engineering for v1; plain document flow is fine).

- [ ] **Step 2:** Verify in browser: footer appears on every page (Home, About, FAQ, Field Rentals, Sponsorship). Visual contrast against the page is correct on each.

---

<a id="task-5"></a>
### Task 5: Favicon

**Files:**
- Create: `public/favicon.png` (32×32 derived from `public/static/maa-large.jpg`)
- Modify: `index.html`

- [ ] **Step 1:** Generate the favicon. Easiest path:

```bash
# from repo root, requires sips on macOS (built-in)
sips -z 32 32 public/static/maa-large.jpg --out public/favicon.png
```

- [ ] **Step 2:** Add to `<head>` of `index.html`:

```html
<link rel="icon" type="image/png" href="favicon.png" />
```

(Vite's `base: '/maa-frontend/'` automatically rewrites the relative path on build.)

- [ ] **Step 3:** Verify: dev server tab shows the favicon; no 404 for `/favicon.ico` in the network tab.

---

<a id="task-6"></a>
### Task 6: Home copy refactor

**Files:**
- Modify: `src/pages/home/copy.ts`

- [ ] **Step 1:** Update copy module per design:

```ts
import { B_URL } from '../../utils';

export const hero = {
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

export const getInvolved = {
  heading: 'Get Involved',
  body: 'Have questions about registration, want to coach, or interested in sponsoring? We would love to hear from you.',
};

export const teasers = {
  fields: {
    heading: 'Book a Field',
    body: 'Day rentals on the Meadow ballfields for parties, practices, and tournaments.',
    cta: 'View rental info',
  },
  sponsors: {
    heading: 'Become a Sponsor',
    body: 'Support local youth sports and reach families across Meadow.',
    cta: 'See sponsorship tiers',
  },
};
```

(Drop the previous `outro` export.)

---

<a id="task-7"></a>
### Task 7: Home page rework

**Files:**
- Modify: `src/pages/home/index.tsx`

- [ ] **Step 1:** Update imports — pull in `getInvolved`, `teasers`, `programs`, `Link` from `react-router-dom`, `ContactSection` from components, `PAGE_PATHS`, `Ic`, `icons` from utils, and `B_URL`.

- [ ] **Step 2:** Restyle the `ProgramsOffered` heading. Replace the current `<h3>` with the v1-style heading-with-bar treatment, but as `<h2>`:

```tsx
<h2 className="text-[30px] font-bold mb-1.5">{programsSection.heading}</h2>
<div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
<p className="text-[13px] text-base-content/50 mb-3">{programsSection.subhead}</p>
```

- [ ] **Step 3:** Enlarge season labels. Replace the current 11px uppercase div with:

```tsx
<h3 className="text-base font-bold text-center mb-2">{season.label}</h3>
```

- [ ] **Step 4:** Replace the old `<Outro/>` section with two new sections:

```tsx
function GetInvolved() {
  return (
    <section className="mt-10">
      <h2 className="text-[30px] font-bold mb-1.5">{getInvolved.heading}</h2>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-5 max-w-[600px]">
        {getInvolved.body}
      </p>
      <ContactSection />
    </section>
  );
}

function MoreOnTheSite() {
  return (
    <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Fields card — photo */}
      <Link
        to={PAGE_PATHS.fields}
        className="card bg-white border border-base-300 rounded-[10px] overflow-hidden no-underline text-base-content hover:border-primary transition-colors"
      >
        <img
          src={B_URL + 'static/fields-aerial.jpg'}
          alt="MAA fields"
          className="w-full h-[140px] object-cover"
        />
        <div className="p-5">
          <h3 className="text-lg font-bold mb-1">{teasers.fields.heading}</h3>
          <p className="text-sm text-base-content/60 leading-relaxed mb-3">{teasers.fields.body}</p>
          <span className="text-sm font-semibold text-primary">{teasers.fields.cta} →</span>
        </div>
      </Link>

      {/* Sponsors card — dark color block. TODO: swap to a real photo when one exists. */}
      <Link
        to={PAGE_PATHS.sponsorship}
        className="card bg-neutral text-neutral-content rounded-[10px] no-underline hover:opacity-95 transition-opacity"
      >
        <div className="p-5 flex flex-col h-full">
          <Ic d={icons.star} s={28} className="text-primary mb-2" />
          <h3 className="text-lg font-bold mb-1">{teasers.sponsors.heading}</h3>
          <p className="text-sm text-neutral-content/70 leading-relaxed mb-3 grow">
            {teasers.sponsors.body}
          </p>
          <span className="text-sm font-semibold text-primary">{teasers.sponsors.cta} →</span>
        </div>
      </Link>
    </section>
  );
}
```

- [ ] **Step 5:** Update `HomePage` composition to: `<Hero/>`, `<Intro/>`, `<ProgramsOffered/>`, `<GetInvolved/>`, `<MoreOnTheSite/>`. Remove the `<Outro/>` component definition.

- [ ] **Step 6:** Confirm `Ic` accepts a `className` prop (read `src/utils.tsx` if needed). If not, use an inline `style` or wrap the icon in a span with the color class.

- [ ] **Step 7:** Verify in browser: heading style matches About's; season labels are clearly larger; ContactSection cards render correctly under "Get Involved"; the two teaser cards display side-by-side on md+ and stacked on mobile; both cards link to the correct routes.

---

<a id="task-8"></a>
### Task 8: FAQ accordion a11y

**Files:**
- Modify: `src/pages/faq/index.tsx`

- [ ] **Step 1:** Replace the question header `<div onClick>` with a `<button type="button">`. Add `aria-expanded={open}` (where `open` is the existing per-row open state). Move the `cursor-pointer` class onto the button (or remove it — buttons get pointer cursor by default in most styles).

- [ ] **Step 2:** Verify: keyboard tab focuses each question button; Enter/Space toggles it; `aria-expanded` flips correctly in devtools.

---

<a id="task-9"></a>
### Task 9: Mobile nav a11y

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1:** Add `inert={!menuOpen ? '' : undefined}` to the off-canvas `<nav>`, OR conditionally render the nav when `menuOpen` is true (preferred — simpler, removes its DOM nodes from focus order entirely when closed). React 19 supports the `inert` boolean attribute natively if you prefer that route.

- [ ] **Step 2:** Verify: with the menu closed at mobile width, tabbing through the page does not focus any of the off-canvas links.

---

<a id="task-10"></a>
### Task 10: Checkmark a11y

**Files:**
- Modify: `src/pages/sponsors/index.tsx`

- [ ] **Step 1:** Add `aria-hidden="true"` to the `<span>` inside the `Check` component:

```tsx
function Check() {
  return <span aria-hidden="true" className="text-primary font-bold mr-1.5">✓</span>;
}
```

---

<a id="task-11"></a>
### Task 11: CI lint step

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1:** Read the workflow; add `npm run lint` as a separate step between `npm ci` and `npm run build`:

```yaml
- run: npm ci
- run: npm run lint
- run: npm run build
```

(Match existing indentation and step style.)

- [ ] **Step 2:** Push and confirm the next CI run executes the lint step; if existing lint warnings break CI unexpectedly, fix them before merging this task.

---

<a id="task-12"></a>
### Task 12: Dead CSS cleanup

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1:** Open `src/index.css`, locate the `.table` block (~30 lines, inherited from prototype admin tables). Confirm via grep that no source file uses `className="table"` (the daisyUI table classes use a `.table` CSS rule scoped under daisyUI itself; only delete the project-defined block, not daisyUI's).

- [ ] **Step 2:** Delete the block.

- [ ] **Step 3:** Verify: `npm run lint && npm run build`; no visual regression on any page.
