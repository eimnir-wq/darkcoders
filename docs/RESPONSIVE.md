# Responsive Specification

## Verification method

Every width below was measured in headless Chrome via the DevTools Protocol
(`Emulation.setDeviceMetricsOverride`) against the running production build at
`http://localhost:5555`, with `prefers-reduced-motion: reduce` so all sections render.
The check compared `document.documentElement.scrollWidth` against `innerWidth`.

## Measured results (all PASS — no horizontal overflow)

| Viewport | Device class | scrollWidth | innerWidth | Overflow | Header nav | Hamburger | Page height |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 px | small mobile | 320 | 320 | none | hidden | shown | 14 671 px |
| 360 px | mobile | 360 | 360 | none | hidden | shown | 14 443 px |
| 375 px | iPhone | 375 | 375 | none | hidden | shown | 14 376 px |
| 390 px | iPhone | 390 | 390 | none | hidden | shown | 14 227 px |
| 414 px | large mobile | 414 | 414 | none | hidden | shown | 14 065 px |
| 430 px | large mobile | 430 | 430 | none | hidden | shown | 13 963 px |
| 768 px | tablet | 758 | 768 | none | hidden | shown | 12 492 px |
| 820 px | tablet | 810 | 820 | none | hidden | shown | 12 512 px |
| 1024 px | laptop | 1014 | 1024 | none | **shown** | hidden | 9 060 px |
| 1280 px | desktop | 1270 | 1280 | none | shown | hidden | 7 694 px |
| 1440 px | desktop | 1430 | 1440 | none | shown | hidden | 7 705 px |
| 1920 px | full HD | 1910 | 1920 | none | shown | hidden | 7 835 px |
| 2560 px | 2K/QHD | 2550 | 2560 | none | shown | hidden | 7 835 px |

Notes:

- `scrollWidth < innerWidth` at ≥768 px is the hidden scrollbar gutter (the capture
  uses `--hide-scrollbars`); it is not content overflow.
- Page height decreases as width grows because text reflows into fewer lines.
- Content is capped at `max-width: 1280px` (1480 px ≥1920 px), so 1920/2560 px show
  generous margins rather than stretched content.

## Breakpoints

Tailwind defaults, plus two custom tokens declared in `globals.css`:

| Token | Min-width | What changes |
| --- | --- | --- |
| base | 0 | Single column, mobile composition |
| `sm` | 640 px | 2-up grids (capabilities, trust, KPIs), trial button appears |
| `md` | 768 px | Login button appears; 2-col copilot/settings |
| `lg` | 1024 px | **Full desktop nav**; hero 2-column; sticky copilot; 3-col dashboard |
| `xl` | 1280 px | Capabilities become 5 columns; wider hero gaps |
| `2xl` | 1536 px | Header tagline appears |
| `3xl` | 1920 px | Container widens to 1480 px |
| `4xl` | 2400 px | (token available) |

## Component behaviour by area

### Navigation
- **≥1024 px:** horizontal nav with hover/click dropdowns; search, language, log in,
  Start Free Trial all inline.
- **<1024 px:** hamburger opens a full-height end-anchored drawer (max 88vw/380px) with
  accordion sections, stacked CTAs, search and language switcher; `Escape` and backdrop
  close; body scroll locked.
- The header is fixed at 68 px; hero adds `pt-[68px]`.

### Hero
- **<1024 px:** single column — copy first, then the globe (centred, `max-w-[620px]`),
  then the live panel stacked below. Floating globe labels are hidden below `sm`/`md`
  to avoid clutter.
- **≥1024 px:** two columns; the globe aligns to the start of the right column with a
  negative inline margin; the live panel is absolutely positioned at the end and
  overlaps the globe's right side (layered HUD look).

### Metrics
- 2 columns below `lg`, 4 columns at `lg`+ with vertical dividers.

### Capabilities
- 1 → 2 (`sm`) → 5 (`xl`) columns; cards are equal-height flex columns.

### Threat map
- Map keeps a 2:1 aspect ratio at all widths; the legend wraps; the selected-node
  callout is anchored bottom-start; the top-threats panel stacks below `lg`.

### Compliance + Copilot
- Stacked below `lg`; two columns at `lg`+ with the copilot `sticky top-24`.
- Framework tiles: 2 → 3 (`sm`/`lg`) → 4 (`xl`) columns.

### Dashboard
- KPI row: 2 → 4 columns at `lg`.
- Tab bar scrolls horizontally (`overflow-x-auto`) — 11 tabs never wrap or overflow
  the page.
- Tables have `min-w-[560px]` inside `overflow-x-auto`, so wide tables scroll within
  their panel, not the page.
- The chart is `ResponsiveContainer`-driven at a fixed 240 px height.

### Footer
- 1 column → 2 (`sm`) → 4 (`lg`) link columns; newsletter form is full-width on mobile.

### Modals & dialogs
- `max-w-lg` panel with `p-4` page padding; scrollable search results (`max-h-[52vh]`).

## Overflow-prevention rules used

1. All wide tables live inside `overflow-x-auto` wrappers.
2. All long text uses `truncate` / `line-clamp-*` or wrapping with `min-w-0` on flex
   children.
3. `body { overflow-x: hidden }` prevents decorative blurred glows (absolutely
   positioned, larger than the viewport) from creating a scrollbar.
4. Images use `max-width: 100%` (Tailwind preflight) with intrinsic aspect ratio.

## Testing a new breakpoint change

```bash
npm run build && npm run start
# then re-run a width sweep (320 → 2560) checking scrollWidth === innerWidth
```
