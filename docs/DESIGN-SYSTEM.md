# Design System

All tokens live in **`src/app/globals.css`**. Tailwind v4 is configured CSS-first:
`:root` declares the raw variables, and `@theme inline` re-exports them as Tailwind
utilities (`bg-dc-surface`, `text-dc-green`, …). There is no `tailwind.config.*`.

---

## 1. Colour tokens

### Brand core (source: `globals.css` `:root`)

| Variable | Value | Role |
| --- | --- | --- |
| `--dc-black` | `#050807` | Page background, deepest surface |
| `--dc-bg` | `#07110d` | Section background |
| `--dc-surface` | `#0b1511` | Card/panel base |
| `--dc-surface-2` | `#111714` | Raised panel |
| `--dc-elevated` | `#161c19` | Highest surface |
| `--dc-border` | `rgba(0,255,136,0.14)` | Default hairline border |
| `--dc-border-strong` | `rgba(0,255,136,0.34)` | Hover/emphasis border |

### Neon green ramp

| Variable | Value | Role |
| --- | --- | --- |
| `--dc-green` | `#00ff88` | Primary brand accent, CTAs, active states |
| `--dc-green-bright` | `#19f58a` | (available) |
| `--dc-green-soft` | `#7cffbe` | Soft accent text |
| `--dc-green-deep` | `#00e676` | Gradient stop |

### Text

| Variable | Value | Role |
| --- | --- | --- |
| `--dc-text` | `#e9fff6` | Primary text |
| `--dc-muted` | `#8ba69c` | Secondary text |
| `--dc-muted-2` | `#5f776e` | Tertiary/meta text |

### Semantic security states (never brand-dominant)

| Variable | Value | Used for |
| --- | --- | --- |
| `--sev-critical` | `#ff3b5c` | Critical severity |
| `--sev-high` | `#ff8a3d` | High severity |
| `--sev-medium` | `#ffc53d` | Medium severity |
| `--sev-low` | `#38bdf8` | Low severity |
| `--sev-info` | `#7cffbe` | Informational |

These map to Tailwind colours `sev-critical`, `sev-high`, `sev-medium`, `sev-low`,
`sev-info`, and are also available as `severityVar` / `severityClasses` /
`severityGlyph` in `src/lib/utils.ts`.

### Effects & shape

| Variable | Value |
| --- | --- |
| `--dc-glow` | `0 0 0 1px rgba(0,255,136,.14), 0 0 34px -12px rgba(0,255,136,.45)` |
| `--dc-glow-strong` | `0 0 0 1px rgba(0,255,136,.4), 0 0 60px -10px rgba(0,255,136,.6)` |
| `--dc-radius` | `14px` |
| `--dc-radius-lg` | `20px` |
| `--dc-header-h` | `68px` |

---

## 2. Typography

| Token | Source | Family |
| --- | --- | --- |
| `--font-sans` | `next/font` → `--font-inter`, `--font-arabic` | Inter / Noto Sans Arabic |
| `--font-mono` | `next/font` → `--font-mono-tech` | JetBrains Mono |
| `--font-display` | same as sans | Inter |

Fonts are declared in `src/app/layout.tsx` and applied via CSS variables. In RTL,
`[dir="rtl"] body` switches the primary family to Noto Sans Arabic.

### Scale in use

| Role | Classes (examples) |
| --- | --- |
| Hero H1 | `text-[38px] sm:text-[52px] lg:text-[58px] xl:text-[64px] font-extrabold leading-[1.03] tracking-[-0.03em]` |
| Section H2 | `text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.08] tracking-[-0.02em]` |
| Section H3 (cards) | `text-[16px] font-bold tracking-tight` |
| Body | `text-[15px] leading-relaxed text-dc-muted` |
| Small/meta | `text-[11px]`–`text-[12.5px]` |
| Technical label | `.dc-label` → `font-mono text-[11px] uppercase tracking-[0.18em] text-dc-green` |
| Data numerals | `font-mono text-[10px]`–`text-2xl` |

Technical labels are always **mono, uppercase, letter-spaced, neon green** — a core
part of the identity.

---

## 3. Spacing, layout & grid

| Token/utility | Value |
| --- | --- |
| Container | `.dc-container` → `max-width:1280px` (1480px ≥1920), padding 20px (32px ≥768) |
| Section rhythm | `py-20 lg:py-28` (large), `py-16 lg:py-20` (medium) |
| Card padding | `p-4` / `p-5` |
| Grid gaps | `gap-3` / `gap-4` / `gap-12` |
| Header height | `68px` (`--dc-header-h`) |

### Breakpoints (Tailwind defaults + two custom)

| Name | Min width | Custom? |
| --- | --- | --- |
| — | 320px base | |
| `sm` | 640px | |
| `md` | 768px | |
| `lg` | 1024px | |
| `xl` | 1280px | |
| `2xl` | 1536px | |
| `3xl` | 1920px | ✅ `--breakpoint-3xl` |
| `4xl` | 2400px | ✅ `--breakpoint-4xl` |

---

## 4. Borders, radius, elevation

| Concern | Rule |
| --- | --- |
| Default border | `1px solid var(--dc-border)` (set globally on `*`) |
| Radius | `rounded-lg` (8px) controls, `rounded-[10px]` buttons/inputs, `var(--dc-radius)` cards, `var(--dc-radius-lg)` panels, `rounded-full` pills |
| Card elevation | `.dc-card` gradient + border; hover adds `--dc-glow` + `translateY(-3px)` |
| Panel | `.dc-panel` — glassy surface + `backdrop-filter: blur(10px)` |
| Hairline | `.dc-hairline` — gradient 1px divider |

---

## 5. Component classes (source: `globals.css`)

| Class | Purpose |
| --- | --- |
| `.dc-container` | Centered responsive container |
| `.dc-card` | Base card surface |
| `.dc-card-hover` | Hover lift + glow |
| `.dc-panel` | Elevated glass panel |
| `.dc-label` | Technical uppercase mono label |
| `.dc-chip` | Pill badge with green tint |
| `.dc-grid-bg` | 46px neon grid background |
| `.dc-radial-fade` | Radial mask for grid backgrounds |
| `.dc-text-glow` | Neon text shadow |
| `.dc-hairline` | Gradient divider |
| `.dc-dash-path` | Animated dashed stroke (attack arcs) |

---

## 6. Buttons

Source: `src/components/ui/Button.tsx`.

- **Base:** `inline-flex items-center gap-2 rounded-[10px] font-semibold tracking-tight transition-all`
- **Variants**
  - `primary` — neon green bg, black text, glow on hover
  - `secondary` — transparent, green border/text, green tint on hover
  - `ghost` — transparent, muted → green on hover
  - `danger` — critical-tinted
- **Sizes:** `sm` (h-9), `md` (h-11), `lg` (h-[52px])
- **Behaviour:** renders `<button>` or `<Link>` (internal) or `<a target="_blank" rel="noopener noreferrer">` (external); focus ring via `focus-visible:outline-dc-green`; `disabled:opacity-50`.

## 7. Badges & status indicators

Source: `src/components/ui/Badge.tsx`, `src/lib/utils.ts`.

- `Chip` — `.dc-chip` pill
- `SeverityBadge` — colour + **glyph** (`▲ ◆ ■ ● ○`) + label (never colour alone)
- `StatusDot` — 2.5px glowing dot, optional `pulse`
- `LiveBadge` — pulsing "LIVE" pill

## 8. Inputs

Source: `src/components/ui/Field.tsx`.

- Base: `rounded-[10px] border bg-dc-black/60 px-3.5 py-2.5 text-sm`
- Focus: `focus:border-dc-green focus:ring-1 focus:ring-dc-green/40`
- Invalid: `border-[color:var(--sev-critical)]/60` + `aria-invalid`
- `Field` wires `id`, `aria-describedby` (hint + error), and `role="alert"` on error.

## 9. Tables

Dashboard tables use `DataTable` in `src/features/dashboard/parts.tsx`:
`min-w-[560px]` inside an `overflow-x-auto` wrapper, mono uppercase headers, hairline
row dividers, hover tint `hover:bg-dc-green/4`.

## 10. Navigation

Source: `src/components/layout/SiteHeader.tsx`.

- Fixed, 68px, transparent → `bg-dc-black/85 backdrop-blur-xl` after 12px scroll
- Desktop dropdowns: hover + click + keyboard, `Escape` closes, outside-click closes
- Mobile: full-height end-anchored drawer, accordion sections, `Escape` + backdrop close, body scroll lock

## 11. Modals, dropdowns, drawers

Source: `src/components/ui/Modal.tsx`, `SiteHeader`, `LanguageSwitcher`, `SearchDialog`.

- Framer Motion entrance (opacity + translate/scale), disabled under reduced motion
- Focus trap (Tab/Shift+Tab), initial focus, focus restore, `Escape`, backdrop click
- `role="dialog" aria-modal="true"`

## 12. Charts & visualizations

| Visualization | Technology | Source |
| --- | --- | --- |
| Live Threat Activity area chart | Recharts (`AreaChart`) | `dashboard/ThreatActivityChart.tsx` |
| KPI sparklines | Inline SVG `polyline` | `dashboard/parts.tsx` |
| MITRE ATT&CK heatmap | Semantic HTML table + tokens | `dashboard/MitreHeatmap.tsx` |
| Rotating threat globe | Custom SVG orthographic projection | `hero/ThreatGlobe.tsx` |
| World threat map | Custom SVG dot-matrix + arcs | `threat-intelligence/WorldThreatMap.tsx` |
| Severity/coverage bars | CSS width + gradient | `FrameworkTiles`, `ComplianceTab` |

Chart colours are the semantic tokens (green `#00ff88`, blue `#38bdf8`, orange
`#ff8a3d`), grid lines are `rgba(0,255,136,0.08)`.

## 13. Motion

| Name | Source | Use |
| --- | --- | --- |
| `dc-reveal-in` | `globals.css` + `ui/Reveal.tsx` | Scroll/mount entrance (opacity + translateY) |
| `dc-pulse` | `globals.css` | Glowing node pulse |
| `dc-scan` | `globals.css` | Scan line (available) |
| `dc-marquee` | `globals.css` | (available) |
| `dc-spin-slow` | `globals.css` | Globe orbit rings |
| `dc-dash` / `.dc-dash-path` | `globals.css` | Animated attack arcs |
| `dc-blink` | `globals.css` | Copilot "thinking" dots |

Durations: 0.55–0.6 s entrances, 0.16–0.28 s interactive transitions, easing
`cubic-bezier(0.22, 1, 0.36, 1)`.

**Reduced motion:** the global `@media (prefers-reduced-motion: reduce)` block clamps
all animations/transitions to `0.001ms`, and `useMotionOK()` additionally disables the
JS/CSS reveal path so content renders in its final state.

## 14. Backgrounds & visual effects

- `.dc-grid-bg` — 46px neon grid, combined with `.dc-radial-fade` mask
- Large blurred radial glows (`blur-[140px]`, `bg-dc-green/8–10`)
- `.dc-text-glow` on the hero accent word
- Glow shadows on cards (`--dc-glow`), buttons and the final CTA card
  (`shadow-[0_0_90px_-30px_rgba(0,255,136,0.7)]`)

## 15. Accessibility tokens

- Focus ring: `outline: 2px solid var(--dc-green); outline-offset: 2px` (global `:focus-visible`)
- Selection: `rgba(0,255,136,0.28)`
- Scrollbar: dark track + green-tinted thumb
- Severity never conveyed by colour alone (glyph + text)
