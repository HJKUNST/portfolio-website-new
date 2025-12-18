<!-- prompts.md -->

# Reusable Prompts (Cursor MCP + GPT-5.1 Codex Max)

## 0) Project Bootstrap
Prompt:
Create a new Next.js (App Router) project, desktop-first. Install Tailwind CSS and GSAP (with ScrollTrigger). Configure fonts (Manrope, Crimson Pro) and implement CSS variables for the provided design tokens. Create the folder structure (/components/sections, /lib/figma, /lib/motion). Add a minimal landing page that composes all sections in order with placeholders.

Acceptance:
- `globals.css` contains tokens and typography utilities.
- `lib/motion/gsap.ts` registers ScrollTrigger once.
- Each section is a separate component file.

## 1) Figma Data Adapter (get_figma_data)
Prompt:
Implement `lib/figma/get_figma_data.ts` adapter wrapper and `lib/figma/normalizeFigma.ts`. Assume `get_figma_data` returns raw Figma nodes. Create a normalization layer that maps node ids/names to:
- global styles/tokens usage
- section frames
- text strings
- image fills (if any)
Expose a typed `PortfolioFigmaModel` used by page.tsx to render sections. Include safe fallbacks if nodes are missing.

Acceptance:
- No hard crashes on missing nodes.
- Strong typing and clear mapping heuristics.
- Logs are dev-only and minimal.

## 2) Global Typography + Gradient Text Utility
Prompt:
Create typography utility classes:
- `.text-h1-gradient` for h1 with main-gradient fill (background-clip text)
- `.text-h2`, `.text-h2-em`, `.text-h3-em`, `.text-h4-em`, `.text-em`, `.text-body`
Match sizes and letter spacing exactly. Ensure color tokens match. Include font-loading via next/font.

Acceptance:
- One source of truth in CSS vars.
- Minimal duplication.

## 3) Hero Section: 2D → Scroll-only 3D Carousel
Prompt:
Implement HeroSection with a default 2D presentation. When user scrolls through the Hero section’s range, switch to 3D carousel animation:
- Use GSAP ScrollTrigger to toggle a state/class (e.g., `is3DActive`).
- When active: enable perspective rotation animation and brightness cycling for cards.
- When inactive: disable 3D transforms and show static 2D.
- Hover pauses animation.
Use the provided CSS as reference but adapt to React component structure.

Acceptance:
- Clearly noticeable mode switch tied to scroll.
- Smooth transitions, no popping.
- Hover pause works.

## 4) Teams Section: Living Cards + Click → Dialog
Prompt:
Implement “Teams that I’ve made great outputs with” section:
- Cards subtly drift (micro motion: 700ms loops, eased).
- Clicking a card opens an accessible Dialog with details.
- Dialog entrance/exit: smooth, snappy but not abrupt.
Use Radix Dialog or a custom accessible dialog. Visual and motion should evoke avara.xyz feel without copying exact styling.

Acceptance:
- Cards animate at rest.
- Dialog is keyboard accessible (Esc, focus trap).
- Background scroll is locked when dialog open.

## 5) Fill Text (Belief Statement)
Prompt:
Implement FillText effect for `.fillText`:
- base: gray-300 text with background gradient masked
- on scroll: background-size from 0% to 100% (scrub)
- keep the substring “shared craft” always orange (Secondary) and not affected by fill
Use GSAP ScrollTrigger start/end similar to:
start: "top 80%"
end: "top 20%"

Acceptance:
- Smooth scrub.
- “shared craft” always orange.

## 6) Shared Craftery Path Draw + 3-stage Spotlight
Prompt:
Implement an SVG path draw animation:
- compute path length
- set strokeDasharray/offset
- animate strokeDashoffset 100% → 0 based on scroll
Add a text block where lines highlight based on scroll progress:
- 0–30% highlight first line
- 30–60% highlight second line
- 60–100% highlight third line
Use ScrollTrigger `onUpdate` progress to toggle classes.

Acceptance:
- Path draws from top endpoint correctly.
- Highlight phases are precise and smooth.

## 7) Values Arrow Field (Cursor Look)
Prompt:
Implement a grid of arrow/line elements that rotate to face the cursor:
- Use requestAnimationFrame loop and store elements with center points.
- Use `transform: rotate(rad)` only.
- Keep element count reasonable and responsive to viewport size.
- Ensure cleanup on unmount.
Optional: reduce motion when prefers-reduced-motion is set.

Acceptance:
- Snappy response without jank.
- No memory leaks.

## 8) Looking For Team: Falling Letters + CTA Reveal
Prompt:
Implement a text reveal where letters fly in from above and settle:
- stagger per character, easing, no pop
- tied to scroll; once complete, reveal “Contact me” and icons with 300ms transition
Use GSAP timeline + ScrollTrigger.

Acceptance:
- Legible final text.
- CTA appears only after full reveal.

## 9) Motion Governance
Prompt:
Create shared motion constants:
- `MICRO_FAST = 300ms`, `MICRO_SLOW = 700ms`
- easing presets (e.g., cubic-bezier equivalents)
Create helpers to apply consistent durations and ensure “no sudden pop.” Use these constants everywhere.

Acceptance:
- Consistent motion feel across sections.

## 10) QA Checklist Prompt
Prompt:
Review the implementation for:
- token accuracy (fonts, sizes, letter spacing, colors)
- scroll triggers start/end offsets (early 100ms, late 100ms feel)
- performance (only transform/opacity)
- reduced motion
- dialog accessibility
Return a punch-list with exact file/line references and fixes.

Acceptance:
- Actionable checklist, not generic.
