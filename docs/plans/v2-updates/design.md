# MAA Frontend v2 — Site Updates

## Overview

A focused round of updates after the v1 marketing-site migration shipped. The bulk of the work is a homepage rework — promoting the page from "hero + program grid + small outro paragraph" to a fuller landing page with proper section weight, reused content from About, teaser cards pointing to /field-rentals and /sponsorship, and a new global footer. The rest is a small batch of follow-up cleanups left over from the migration's quality reviews (shared email constant, favicon, accessibility fixes, CI lint step, dead CSS).

Same stack as v1. No new dependencies expected.

## Goals

- Make the homepage a proper landing page rather than a hero + program list.
- Give the bottom half of the homepage real content with links into other pages.
- Add a global footer so every page has visual closure and a canonical home for shared contact info.
- Resolve the migration quality-review follow-ups that are real correctness bugs (a11y) or low-cost polish (favicon, shared email constant, CI lint, dead CSS cleanup).

## Non-goals

- Player registration, cart, login, admin (still v2+ scope).
- Any visual refresh of pages other than Home.
- Custom domain or AWS migration.
- Adding tests (project still has none; consistency with v1).
- Speculative type-tightening polish (FAQ key, About key, `Tier` `ReactNode`, narrowed `PAGE_PATHS` keys) — explicitly deferred.

## Homepage rework (`pages/home/`)

### Section structure (top to bottom)

```
<Hero/>                     // unchanged
<Intro/>                    // unchanged
<ProgramsOffered/>          // heading restyled, season labels enlarged
<GetInvolved/>              // new: heading + reused <ContactSection/>
<MoreOnTheSite/>            // new: two teaser cards (fields photo + sponsors color block)
```

The page becomes two clearly-weighted halves: programs (top) and "what else is here" (bottom). The current single bland paragraph at the bottom is replaced.

### Heading restyling

The page currently has `<h3>` headers for "What We Offer" and "Get Involved." Other pages use a distinctive `<h1>` treatment:

```tsx
<h1 className="text-[30px] font-bold mb-1.5">…</h1>
<div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
```

For the home page, "What We Offer" and "Get Involved" use the **same visual treatment** but render as `<h2>` so the page keeps a single `<h1>` (the MAA brand name in the hero). This preserves heading hierarchy for screen readers without sacrificing the visual rhythm.

### Season labels

Currently the season columns are headed by:

```tsx
<div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/50 text-center mb-2">
  {season.label}
</div>
```

Too small, reads as a label rather than a subhead. Replace with proper subheads:

```tsx
<h3 className="text-base font-bold text-center mb-2">{season.label}</h3>
```

Drop the uppercase / tracking. Plain bold "Spring" / "Fall" / "Winter" reads cleaner and gives the columns proper hierarchy.

### `<GetInvolved/>` and the reused `<ContactSection/>`

The `Get in Touch` and `Follow Us` cards on the About page get extracted to a shared component:

```
src/components/ContactSection.tsx
```

About uses it under its `<h2>Contact</h2>` heading; Home uses it under the new `<h2>` "Get Involved" heading. Same visual, single source of truth.

The component takes no props in v1 — it pulls `contactEmail` and `facebookUrl` from a shared content module (see [Shared `contactEmail` constant](#shared-contactemail-constant)).

### `<MoreOnTheSite/>` — teaser cards

Two cards in a `grid-cols-1 md:grid-cols-2 gap-4`:

**Card 1 — Book a Field** (photo card):
- Reuses `public/static/fields-aerial.jpg` as a banner image at the top of the card (~140px, `object-cover`).
- Heading: "Book a Field"
- Blurb: "Day rentals on the Meadow ballfields for parties, practices, and tournaments."
- CTA: link to `/field-rentals` (e.g. "View rental info →")

**Card 2 — Become a Sponsor** (dark color-block card):
- `bg-neutral text-neutral-content` to match the header (and incoming footer).
- Primary-colored star icon (`icons.star`, size ~28) at the top.
- Heading: "Become a Sponsor" in white.
- Blurb in `text-white/70`: "Support local youth sports and reach families across Meadow."
- CTA: link to `/sponsorship` (e.g. "See sponsorship tiers →"), styled in primary.

Visual asymmetry (photo + color block) is intentional. A real sponsor photo can replace the color-block card later; leave a small implementation comment indicating the swap point.

### Copy updates

`pages/home/copy.ts` evolves to:

```ts
export const hero = { /* unchanged */ };
export const intro = { /* unchanged */ };
export const programsSection = {
  heading: 'What We Offer',
  subhead: 'Youth sports across three seasons',
};
export const getInvolved = {
  heading: 'Get Involved',
  body: 'Have questions about registration, want to coach, or interested in sponsoring? We would love to hear from you.',
};
export const teasers = {
  fields: { heading: 'Book a Field', body: '…', cta: 'View rental info' },
  sponsors: { heading: 'Become a Sponsor', body: '…', cta: 'See sponsorship tiers' },
};
```

The previous `outro` export goes away — its content becomes `getInvolved` since it now leads into the contact and teaser cards rather than standing alone.

## Global footer

New file: `src/components/Footer.tsx`. Rendered in `App.tsx` after `<Outlet/>`.

Visual: dark background matching the header (`bg-neutral text-neutral-content`).

Content:

- Brand block on the left: M·A·A wordmark (matching the header treatment) + small tagline (e.g. "Youth sports for the Meadow community since 1976").
- Quick nav: About, FAQ, Field Rentals, Sponsorship.
- Contact block: `meadowathleticassociation@gmail.com` + Facebook icon link.
- Copyright bar: `© 2026 Meadow Athletic Association`.

Use DaisyUI's `<footer>` component classes (`footer bg-neutral text-neutral-content p-10`) plus a thin `<aside>` row for the copyright.

The footer is the canonical place for the contact email going forward — it appears on every page automatically, which means inline mentions on /field-rentals, /sponsorship, and /sponsors/tiers can be replaced with a shared constant or removed entirely if the footer makes them redundant.

## Follow-up cleanups

### Shared `contactEmail` constant

Today `meadowathleticassociation@gmail.com` is hardcoded in four places: `pages/about/copy.ts` exports it; `pages/fields/index.tsx`, `pages/sponsors/index.tsx`, and `pages/sponsors/tiers.tsx` re-inline the literal string.

Promote it to a top-level shared content module:

```
src/content.ts
  export const contactEmail = 'meadowathleticassociation@gmail.com';
  export const facebookUrl = '…';
```

Update About to import from `src/content.ts` instead of declaring it. Update the three other call sites to import the constant. Drop the duplicate in `pages/about/copy.ts`. The new `Footer` and `ContactSection` import from the same module.

### Favicon

Today: no `<link rel="icon">` and no `favicon.ico`, so every page logs a 404 for the favicon request.

Add a square version of the existing logo as `public/favicon.png` (16×16 / 32×32) and reference it from `index.html`:

```html
<link rel="icon" type="image/png" href="favicon.png" />
```

Vite serves `public/favicon.png` at the site root (with the `/maa-frontend/` base prefix on GH Pages). No build config changes.

### Accessibility pass

Three real bugs (correctness, not polish):

1. **FAQ accordion**: the question header is a `<div onClick>`. Replace with `<button type="button" aria-expanded={open}>`. Keyboard users and screen readers currently can't operate the accordion.
2. **Mobile nav drawer**: the off-canvas `<nav>` in `App.tsx` is always in the DOM with `translate-x-full` when closed, so its links remain tabbable. Either conditionally render or add `inert={!menuOpen}` to the off-canvas nav.
3. **Sponsorship checkmarks**: the `<Check />` span renders a literal `✓` that screen readers announce as "check" before each bullet. Add `aria-hidden="true"` to the span.

### CI lint step

`.github/workflows/deploy.yml` currently runs `npm run build` only. Add a preceding `npm run lint` step so lint errors fail CI before the build. Roughly:

```yaml
- run: npm ci
- run: npm run lint
- run: npm run build
```

### Dead CSS cleanup

`src/index.css` carries ~30 lines of `.table` styles inherited from the prototype's admin table view. No consumer in v1. Delete the block.

### Deferred polish (not in scope)

Skipped for v2; revisit only when in those files for other reasons:

- `import type { ReactNode }` on the `Tier` type.
- `Exclude<keyof typeof PAGE_PATHS, 'home'>` for FAQ link narrowing.
- `key={f.q}` instead of `key={i}` in FAQ.
- `key={member.id}` (which would require adding `id` fields) instead of `key={m.name}` in About.

## Implementation order

Three landing zones, in order:

1. **Homepage rework + footer + shared `contactEmail` + favicon.** All visual/structural changes that touch overlapping files (App.tsx, home/, About contact extraction). Doing them together avoids back-to-back changes to the same files.
2. **A11y pass.** Logic/semantic changes — FAQ button, mobile nav `inert`, Check `aria-hidden`. Separate so it's reviewable as one accessibility-focused diff.
3. **CI lint step + dead `.table` CSS cleanup.** Independent housekeeping. Cheap, can be one small change or split.

## Open questions deferred to implementation

- Exact tagline copy for the footer brand block.
- Final blurb wording for the two teaser cards.
- Whether the field photo on the home teaser card needs a dark gradient overlay (matches the hero) or is fine as-is at small size.
- Whether the dark sponsors card looks better with `bg-neutral` or with a slight tint (e.g., `bg-neutral-900` if defined). Confirm against the actual rendered page.
- Whether any of /field-rentals, /sponsorship contact lines become redundant once the footer renders the email globally — decide while implementing.
