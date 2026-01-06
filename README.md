# Laura HJ Kim — Portfolio (Next.js)

Desktop-first portfolio that mirrors the provided Figma narrative with scroll + cursor microinteractions. Uses Tailwind v4, GSAP/ScrollTrigger, and Radix Dialog, with a data adapter locked to bundled local content (no live Figma dependency).

## Quickstart

```bash
npm install
npm run dev
# http://localhost:3000
```

## Data (fully local)
- Renders from bundled local content (`src/lib/works/data.ts`) with zero network calls.
- `.env` values for Figma are not required and are ignored by the runtime; `.gitignore` already excludes any potential secret files.

## Project map
- `src/app/(site)/page.tsx` — home composition.
- `src/app/(site)/layout.tsx` — shared nav/footer + smooth scroll.
- `src/app/layout.tsx` — fonts (Manrope, Crimson Pro) + metadata; `globals.css` holds tokens.
- `src/features/home/*` — hero 3D-on-scroll, belief fill text scrub, path draw, cursor arrows, CTA letters.
- `src/features/about/AboutMeSection.tsx` — about page layout and motion.
- `src/features/works/SelectedWorksPage/*` — timeline + carousel for works.
- `src/components/ui/Dialog.tsx` — Radix dialog with framer-motion polish.
- `src/lib/figma/*` — Figma types only (no runtime fetch).
- `src/lib/motion/*` — GSAP registration, scroll helpers, pointer utilities.

## Animations & accessibility
- ScrollTrigger-driven hero perspective, fill text, and SVG path draw; scrubs with offsets and cleans up on unmount.
- Cursor-follow arrows use RAF throttling; motion gates on `prefers-reduced-motion`.
- Dialog is keyboard/focus friendly and locks scroll.

## Scripts
- `npm run dev` — start dev server.
- `npm run build` — production build.
- `npm run start` — serve built assets.
- `npm run lint` — eslint pass.

## Performance & style notes
- Animate transforms/opacity; avoid layout thrash.
- Tokens and gradients live in `globals.css`; keep copy in English per design brief.
