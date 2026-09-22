# Fonts

## Summary

The project uses **three Google Fonts**, loaded with `next/font/google` in
`src/app/layout.tsx`. There are **no local font files** in the repository — Next.js
downloads the font files at build time and **self-hosts** them under
`/_next/static/media/*`. At runtime the browser never contacts Google.

| Role | Family | CSS variable | Subset(s) | Weights | Styles |
| --- | --- | --- | --- | --- | --- |
| Body / display | **Inter** | `--font-inter` | `latin` | Variable (all) | normal |
| Technical / mono | **JetBrains Mono** | `--font-mono-tech` | `latin` | Variable (all) | normal |
| Arabic / RTL | **Noto Sans Arabic** | `--font-arabic` | `arabic` | Variable (all) | normal |

Declared with `display: "swap"`.

## Declaration (source of truth)

`src/app/layout.tsx`:

```ts
import { Inter, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";

const inter  = Inter({ subsets: ["latin"],  variable: "--font-inter",     display: "swap" });
const mono   = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-tech", display: "swap" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });
```

They are attached to `<html className={`${inter.variable} ${mono.variable} ${arabic.variable}`}>`.

## Consumption

`src/app/globals.css`:

```css
--font-sans:    var(--font-inter), var(--font-arabic), ui-sans-serif, system-ui, sans-serif;
--font-mono:    var(--font-mono-tech), ui-monospace, monospace;
--font-display: var(--font-inter), var(--font-arabic), ui-sans-serif, sans-serif;

body              { font-family: var(--font-sans); }
[dir="rtl"] body  { font-family: var(--font-arabic), var(--font-sans); }
```

- `--font-sans` is exposed to Tailwind via `@theme inline` as `font-sans` (the default
  for `body`).
- `--font-mono` is used by the `.dc-label` class and every `font-mono` utility.
- Arabic is only applied when `<html dir="rtl">`.

## Fallback chain

| Context | Chain |
| --- | --- |
| LTR body | Inter → Noto Sans Arabic → system UI → sans-serif |
| RTL body | Noto Sans Arabic → Inter → system UI → sans-serif |
| Mono | JetBrains Mono → ui-monospace → monospace |

## The brand wordmark is NOT a font

The "Dark Coders" wordmark in the logo is a **raster asset**
(`public/brand/darkcoders-logo.png`), not rendered text. Its typeface is part of the
supplied brand mark and is intentionally not reproduced with a web font. Do not
substitute a Google Font for the wordmark.

## Licensing

All three families are licensed under the **SIL Open Font License 1.1**, which permits
free commercial use, modification and redistribution (including self-hosting via
`next/font`).

| Font | License | Upstream |
| --- | --- | --- |
| Inter | SIL OFL 1.1 | https://fonts.google.com/specimen/Inter |
| JetBrains Mono | SIL OFL 1.1 | https://fonts.google.com/specimen/JetBrains+Mono |
| Noto Sans Arabic | SIL OFL 1.1 | https://fonts.google.com/specimen/Noto+Sans+Arabic |

No font files are redistributed in this package; they are fetched by the build tool.
No attribution requirement is imposed by the OFL for embedding.

## Offline / air-gapped builds

`next/font/google` needs network access **on the first build** to download the font
files. If the receiving environment is air-gapped:

1. Run `npm run build` once on a networked machine, **or**
2. Switch to `next/font/local` and place the font files in `src/app/fonts/`:

```ts
import localFont from "next/font/local";
const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Inter-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});
```

Download the WOFF2 files from the upstream links above (SIL OFL permits this). Weights
used by the design: 400 (body), 500/600 (labels, buttons), 700/800 (headings, data).

## Verification

- After `npm run build`, confirm `Self-hosted font` entries in the build log and
  `.next/static/media/*.woff2` files exist.
- In the browser, DevTools → Network → Font: requests should be same-origin
  (`/_next/static/media/...`), never `fonts.gstatic.com`.
