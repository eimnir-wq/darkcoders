# Visual Reproduction

Why the UI looks the way it does, and how to reproduce each visual decision. Pair this
with `DESIGN-SYSTEM.md` (tokens) and the reference screenshots in
`docs/screenshots/`.

## 1. Overall composition

A single dark page composed of full-width bands separated by hairlines
(`.dc-hairline`) or `border-y border-dc-border`. Content is constrained by
`.dc-container` (1280px, 1480px ≥1920px). The page reads top-to-bottom as a narrative:
**promise → capability → proof → compliance → trust → architecture → product → scale → action**.

Band order and backgrounds:

| Band | Background | Signature visual |
| --- | --- | --- |
| Hero | `--dc-black` + grid + radial glow | Rotating dot globe + live panel |
| Metrics | `--dc-bg/60` + top/bottom border | Four large green numerals |
| Capabilities | `--dc-black` | 5 bordered cards in a row (≥1280px) |
| Threat map | `--dc-bg` + grid | Dot-matrix world + glowing nodes |
| Compliance + Copilot | `--dc-black` | 11 tiles + chat panel |
| Trust | `--dc-bg/60` + borders | 6 sector cards |
| Architecture | `--dc-black` + top glow | 7 stages with chevrons |
| Dashboard | `--dc-black` | Bordered console frame with tabs |
| Scale | gradient + grid + glow | Cinematic statement + counters |
| CTA | neon green gradient card | High-contrast inversion |
| Footer | `--dc-bg` + top border | Columns + newsletter |

## 2. The neon-green identity

- Green is used for **accents, labels, data and CTAs** — never as a page background
  except the single final CTA card, which deliberately inverts to black-on-green.
- Glow is achieved with layered shadows (`--dc-glow`) and blurred radial divs
  (`blur-[140px]`, `bg-dc-green/8`), not with images.
- Text glow only on the hero accent word (`.dc-text-glow`).
- Red/orange/yellow/blue appear **only** as severity semantics.

## 3. Typography hierarchy

1. **Hero H1** — 38→64px, `font-extrabold`, tight tracking; the last word
   (`Strike.`) is green with text-glow.
2. **Section H2** — 30→42px extrabold, with the second line often green
   (`Global Threat / Visibility`, `Meet Global Standards / with Confidence`).
3. **Card H3** — 16px bold.
4. **Body** — 15px `--dc-muted`, `leading-relaxed`, max-width `2xl` for readability.
5. **Technical labels** — mono, uppercase, `tracking-[0.18em]`, green.
6. **Data** — mono numerals; `dir="ltr"` so they stay correct in RTL.

## 4. The threat globe (`ThreatGlobe.tsx`)

An **orthographic projection rendered as SVG**, not a 3D engine:

- 2,323 world cells are subsampled to ~620 points.
- Each frame, every point is projected with
  `x = R·cosφ·sinθ`, `y = −R·sinφ`, `z = cosφ·cosθ` where `θ = lon + rotation`.
- Points with `z ≤ 0.03` (back hemisphere) are skipped; radius and opacity scale with
  depth (`0.45 + 0.55·z`).
- All visible points are emitted into **one `<path>`** (`d` built from tiny arc
  segments) and written directly to the DOM via `setAttribute` — one element update per
  frame, ~30fps, paused when the tab is hidden.
- Wireframe meridians/parallels are static ellipses; two dashed orbit rings rotate via
  CSS (`animate-dc-spin-slow`).
- Under reduced motion the globe renders once at a fixed rotation.

## 5. The world threat map (`WorldThreatMap.tsx`)

- Equirectangular projection into a `720×360` viewBox; Antarctica filtered (`lat < −58`).
- All land dots are emitted into **one `<path>`** built from 1.15px-radius arcs, drawn
  twice (solid green at 0.9, plus a bright overlay at 0.18) for depth.
- Threat nodes are `<g>` groups with a pulsing halo (`animate-dc-pulse`), a glowing
  core (`feGaussianBlur` filter), and a leader line + tip when selected.
- Attack arcs are quadratic Béziers between sampled nodes with `dc-dash-path`
  (animated `stroke-dashoffset`) and staggered delays.
- Nodes are interactive and accessible: `role="button"`, `tabIndex=0`, `aria-label`,
  `<title>`, Enter/Space activation.

## 6. The live intelligence panel

A `.dc-panel` (glass) with a 3-column stat grid and a scrolling activity list. The
"live" feel comes from `useLiveFeed` prepending an event every 4.2s with a colour-coded
severity dot, category, region and relative timestamp. `useLiveStats` nudges the
"Threats Blocked" number every 3s.

## 7. The dashboard

A single bordered frame containing a horizontally scrollable ARIA tablist, a 4-up KPI
row (value + delta + sparkline), and the active tab panel. Charts use the semantic
palette; the MITRE heatmap uses token-tinted cells (`background: <sev>22`,
`border: <sev>66`). Recharts animation is disabled so the chart renders immediately.

## 8. The AI Copilot

A glass panel with a greeting bubble, message thread (user right / assistant left),
quick-action chips, input with a circular green send button, and a typing indicator
(three blinking dots). Assistant messages show a headline, summary, bullet evidence,
"Suggested actions" and a sources + confidence footer.

## 9. Reveal & motion

Entrances are CSS keyframes triggered by IntersectionObserver (`Reveal`), so content is
**always visible by default** and animates in only once observed. Interactive overlays
(modal, toast, drawer, dropdown, copilot messages) use Framer Motion. All motion is
clamped under `prefers-reduced-motion`.

## 10. Responsive rules (summary — full detail in `RESPONSIVE.md`)

- Header: full nav ≥1024px, hamburger below.
- Hero: two columns ≥1024px; globe + panel stack and centre below.
- Capabilities: 1 → 2 (≥640) → 5 (≥1280) columns.
- Dashboard: KPI 2 → 4 columns; tabs scroll horizontally; tables scroll within their
  own container (never the page).
- Compliance/Copilot: stacked below `lg`, sticky copilot ≥1024px.

## 11. RTL

Driven by `dir="rtl"` on `<html>`. Layout uses logical properties
(`ms/me/start/end/ps/pe`), arrows get `rtl:rotate-180`, and `[dir="rtl"] body` switches
to Noto Sans Arabic. See `I18N.md`.

## 12. Reproducing a change safely

1. Find the token in `DESIGN-SYSTEM.md`; adjust it in `src/app/globals.css` (global) or
   the component (local).
2. Never hardcode a hex value — use `dc-*` / `sev-*` tokens.
3. Verify at 1440 / 768 / 390 and in Arabic (`dir="rtl"`).
4. Compare against `docs/screenshots/`.
