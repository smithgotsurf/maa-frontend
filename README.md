# MAA Frontend

The marketing/info website for the **Meadow Athletic Association (MAA)**.

Hosted at: [https://smithgotsurf.github.io/maa-frontend/](https://smithgotsurf.github.io/maa-frontend/)

Vibe coded with Claude

## Tech

- React 19 + TypeScript 5 (strict mode)
- Vite 6
- react-router-dom v7 (HashRouter)
- Tailwind CSS 4 + DaisyUI 5
- ESLint + Prettier

## Project Structure

```
src/
  main.tsx              # HashRouter + route definitions
  App.tsx               # Layout shell (navbar, mobile drawer, Outlet, Footer)
  content.ts            # Shared site content/copy
  utils.tsx             # Shared utilities, icons, B_URL, PAGE_PATHS
  index.css             # Tailwind + DaisyUI theme configuration
  components/
    Footer.tsx
    ContactSection.tsx
  pages/
    home/      # index.tsx + copy.ts + programs.ts
    about/     # index.tsx + copy.ts + board.ts
    faq/       # index.tsx + questions.tsx
    fields/    # index.tsx
    sponsors/  # index.tsx + tiers.tsx
public/static/          # Images, logo, sponsorship PDF
```

## Dev

```bash
npm run dev          # starts on port 5174
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
```

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. Uses HashRouter with `base: '/maa-frontend/'` in vite.config.ts.
