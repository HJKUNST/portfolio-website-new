<!-- instructions.md -->

# Project: Figma → Code (Next.js Desktop) with Cursor MCP + GPT-5.1 Codex Max

## Objective
- Implement the Figma file into a new Next.js (React) project (desktop-first).
- Recreate scroll-reactive and cursor-reactive interactions with high fidelity.
- Use `get_figma_data` as the primary source of truth for layout, spacing, and text content. Always adapt to its schema and outputs.

Figma:
https://www.figma.com/design/u81ZQF6s5kJn7w6ha6dfii/Portfolio?node-id=1419-2260&t=lqqmiKIQ1Ezzuizb-4

## Non-Negotiables
- Desktop-first (optimize for large screens); ensure graceful scaling but do not redesign for mobile unless explicitly required.
- All copy must be in English.
- No sudden “pop” animations. Everything must ease-in/out naturally.
- Micro-interactions duration: 300ms or 700ms.
- Scroll animations should begin ~100ms before reaching the trigger and finish ~100ms after leaving it (use ScrollTrigger start/end offsets or equivalent).
- Prefer semantic HTML, accessible interactions (focus states, reduced motion), and maintainable component structure.

## Tech Decisions (Default)
- Framework: Next.js (App Router)
- Styling: Tailwind CSS + CSS variables (design tokens). Use CSS modules only when needed.
- Animation: GSAP + ScrollTrigger as primary for scroll-driven effects. Use Framer Motion for small UI micro-interactions when simpler.
- Rendering: Client components only where interaction/animation is required; keep static sections as server components if possible.

## Design Tokens (must be implemented as CSS variables)
### Fonts
- h1: Manrope 48px medium, letter-spacing -2%, main-gradient
- h2: Manrope 36px medium, letter-spacing -2%, #0B0B0B
- h2-em: Crimson Pro 48px medium italic, letter-spacing -4%, Secondary
- h3-em: Crimson Pro 24px medium, letter-spacing -4%, main-gradient
- h4-em: Crimson Pro 18px light, letter-spacing -4%, gray-900
- em: Manrope 14px medium, letter-spacing -2%, gray-900
- body: Manrope medium, letter-spacing -2%, gray-300

### Colors
- Primary: #88ADAF
- Primary-bright: #90DDE1
- Secondary: #FD9A6D
- gray-100: #C5C5C5
- gray-300: #8D8D8D
- gray-900: #0B0B0B
- main-gradient:
  linear-gradient(to right, #97B29D 0%, #0B0B0B 50%, #85ADAF 100%)

## Global Motion References (if missing specifics, match these)
- https://www.danielbatedesign.com/
- https://yourwave.nl/
- https://www.steelwavellc.com/

## Section Requirements
### 1) Hero Section
- Showcase area should be a “3D carousel” only while scrolling; default state is 2D.
- Use reference idea: https://uiverse.io/musashi-13/strange-eel-100
- Implement as:
  - default: static/2D card strip (no perspective rotation)
  - while scrolling: enable 3D `transform-style: preserve-3d` + rotational animation
- Hover pauses animation.

### 2) “Teams that I’ve made great outputs with” Section
- Default: subtle motion on cards (alive, drifting).
- On click: open a dialog/modal with details (use accessible dialog).
- Motion and UI reference: https://avara.xyz/
- You may recreate the “floating draggable orbit” feel if feasible, but prioritize:
  - (a) cards with motion
  - (b) click → dialog
  - (c) polished transitions

### 3) “I believe …” Fill Text
- Text fill animation: left → right background-size expansion on scroll.
- Keep “shared craft” highlighted in orange permanently.
- Use GSAP ScrollTrigger to scrub background-size from 0% to 100%.

### 4) “I design with the mindset of shared craftery” Path Draw + Spotlight
- Curve/path should draw from 0% → 100% based on scroll.
- At scroll progress:
  - 0%–30% highlight: “I design with the mindset …”
  - 30%–60% highlight: “aiming for interfaces …”
  - 60%–100% highlight: “… and age well because …”
- Use SVG path with strokeDasharray/strokeDashoffset and ScrollTrigger.

### 5) “things that i can add values for you” Cursor-follow Arrows
- Arrows (or lines) rotate to point at cursor.
- Use requestAnimationFrame loop; throttle via RAF as in provided code.
- Ensure performance (reduce number of elements, use transforms only).

### 6) “I’m looking for a team that …” Falling Letters + CTA
- Letters fly in from top to settle into place on scroll.
- After all letters appear: show “Contact me” and icon(s).
- No harsh pop; use easing and stagger.

## Layout and Structure (recommended)
- /app
  - page.tsx (composes sections)
  - layout.tsx (fonts + global styles)
- /components
  - sections/HeroSection.tsx
  - sections/TeamsSection.tsx
  - sections/BeliefFillTextSection.tsx
  - sections/SharedCrafteryPathSection.tsx
  - sections/ValuesArrowFieldSection.tsx
  - sections/LookingForTeamSection.tsx
  - ui/Dialog.tsx (or Radix-based)
- /lib
  - figma/get_figma_data.ts (adapter wrapper)
  - figma/normalizeFigma.ts (mapping nodes → components props)
  - motion/gsap.ts (register plugins once)
  - motion/scroll.ts (shared ScrollTrigger helpers)
- /styles
  - globals.css (tokens + typography utilities)
  - typography.css (optional)

## `get_figma_data` Adaptation Rules
- Treat `get_figma_data` as an external provider returning:
  - nodes, frames, text layers, styles, constraints, absolute/relative bounds.
- Write a normalization layer:
  - map figma node names → component slots (by heuristics: section/frame titles, node ids, or naming conventions)
  - extract text content reliably
  - fallback behavior if node missing (do not crash; render placeholder)

## Quality Bar (“Always choose the best consideration”)
Prioritize, in order:
1. Visual hierarchy and spacing parity with Figma
2. Motion feel (smoothness, timing, easing) and performance
3. Maintainable architecture (clean components + helpers)
4. Accessibility (keyboard, focus, reduced motion)
5. SEO basics (titles, meta, semantic structure)

## Performance Constraints
- Avoid layout thrashing; animate transforms/opacity only.
- Use `will-change` carefully and remove when not needed.
- Use `prefers-reduced-motion` to disable scroll/cursor effects gracefully.
- Keep ScrollTrigger instances scoped and cleaned up on unmount.

## Deliverables
- A new Next.js project with:
  - Design tokens applied globally
  - All sections implemented
  - Animations functional
  - `get_figma_data` integration via adapter
  - Clear README with run instructions and architecture notes
