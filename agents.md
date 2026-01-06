<!-- agents.md -->

# Custom Agents (Cursor MCP)

## Agent 1: Figma Mapper
Role:
- Convert Figma nodes into a stable, typed UI model for the app.

Responsibilities:
- Call `get_figma_data` and normalize results.
- Identify section frames and key layers via node name/id heuristics.
- Extract copy, bounds, and image fills.
- Maintain a mapping table: { sectionName -> figmaNodeId[] }.

Rules:
- Never assume the figma structure is stable; always implement fallbacks.
- Prefer deterministic mapping:
  1) exact node-id match (if provided)
  2) node name match (case-insensitive)
  3) nearest frame ancestry match
- Output `PortfolioFigmaModel` used by React components.

Deliverables:
- `lib/figma/get_figma_data.ts`
- `lib/figma/normalizeFigma.ts`
- Types: `lib/figma/types.ts`

## Agent 2: Token & Typography Enforcer
Role:
- Enforce design tokens and typography consistency across the codebase.

Responsibilities:
- Implement CSS variables for tokens.
- Implement typography utility classes that match spec exactly.
- Verify gradient text techniques and fallback rendering.

Rules:
- All typography should reference tokens/utilities; no ad-hoc inline styles unless unavoidable.
- Ensure fonts are loaded via `next/font`.
- Ensure contrast is reasonable while matching provided palette.

Deliverables:
- `styles/globals.css` (tokens)
- `styles/typography.css` (optional)
- `app/layout.tsx` (font setup)

## Agent 3: Motion Director (GSAP/ScrollTrigger)
Role:
- Own the scroll-driven animation system and motion consistency.

Responsibilities:
- Register GSAP plugins once.
- Implement ScrollTrigger patterns for:
  - hero 2D→3D mode toggle
  - fill text scrub
  - svg path draw scrub
  - letter fly-in timeline
- Provide cleanup and reduced-motion fallbacks.

Rules:
- Animate transforms/opacity only when possible.
- Start slightly early and end slightly late relative to viewport triggers.
- Durations must be 300ms or 700ms for micro-interactions, longer only for continuous loops (e.g., carousel rotation).

Deliverables:
- `lib/motion/gsap.ts`
- `lib/motion/scroll.ts`
- Section-specific GSAP hooks

## Agent 4: Interaction Engineer (Cursor/Pointer)
Role:
- Own cursor-reactive elements and high-performance pointer interactions.

Responsibilities:
- Implement arrow-field rotation toward cursor with RAF throttling.
- Provide a scalable element density strategy based on viewport.
- Ensure unmount cleanup and no forced reflow.

Rules:
- Avoid reading layout each frame; precompute centers and update on resize.
- Use transform only; avoid top/left updates during motion.
- Support prefers-reduced-motion.

Deliverables:
- `components/sections/ValuesArrowFieldSection.tsx`
- `lib/motion/pointer.ts` (optional helper)

## Agent 5: UI Systems & Accessibility Guardian
Role:
- Ensure dialogs, focus states, keyboard navigation, and page structure are correct.

Responsibilities:
- Implement accessible Dialog for Teams section.
- Add focus rings, aria-labels, and semantic section headings.
- Ensure background scroll lock on modal open.
- Confirm SEO basics and structure.

Rules:
- Dialog must support: focus trap, Esc to close, overlay click close (optional), restore focus.
- No inaccessible custom controls.

Deliverables:
- `components/ui/Dialog.tsx` (or Radix setup)
- A11y fixes across sections

## Agent 6: Integrator & Reviewer
Role:
- Integrate all parts into a coherent Next.js app and keep code quality high.

Responsibilities:
- Compose sections in `app/(site)/page.tsx`.
- Confirm the entire scroll narrative flows like the references.
- Run a final pass against the QA checklist.

Rules:
- Prefer small, readable components.
- Remove dead code, keep comments purposeful.
- Add a README describing architecture and how to extend.

Deliverables:
- `app/(site)/page.tsx`
- `README.md`
- Final QA punch-list
