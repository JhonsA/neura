---
name: neura-design
description: Use this skill before any visual, styling, layout, copy hierarchy, or UI component change in Neura. It is the source of truth for the migraine-safe visual system, design tokens, and interaction constraints.
---

# Neura Design Guide

Reference design system for the Neura project. Validate every visual change against this guide before applying it.

> Usage context: Neura is designed for people with an active migraine. Every visual decision must prioritize low cognitive load, gentle contrast, and zero distraction.

## 1. Design Principles

| Principle | Description |
|---|---|
| Calm | No elements competing for attention. Dark background, low saturation. |
| Focused | One primary CTA. The user should not make unnecessary decisions. |
| Distinctive | Darkness with depth. Waves, particles, and surface layers add life without overload. |
| Crisis-accessible | The UI must work during headache pain: legible type, sufficient contrast, large button. |

## 2. Color Palette

These are the only allowed colors. Do not introduce new tones or saturated variations.

### Backgrounds

| Token | Hex | Use |
|---|---|---|
| `--c-bg` | `#0f1319` | Main shell background |
| `--c-bg-alt` | `#0d111f` | Deep background, gradient end |

### Surfaces

| Token | Hex | Use |
|---|---|---|
| `--c-surface` | `#191f37` | Base layer: cards, waves |
| `--c-surface-2` | `#282d51` | Middle layer: button base, separators |
| `--c-surface-3` | `#3c3c6d` | High layer: button top edge, icons |

### Text

| Token | Hex | Use |
|---|---|---|
| `--c-text` | `#c8cef0` | General body text |
| `--c-text-muted` | `#808ab8` | Secondary labels, subtitles, footer |
| `--c-text-strong` | `#e8ebff` | Prominent text inside buttons |

### Accent / Title

| Token | Hex | Use |
|---|---|---|
| `--c-title` | `#7b87d4` | "Neura" title and CTA icon color |

### Borders

| Token | Value | Use |
|---|---|---|
| `--c-border` | `rgba(114, 128, 210, 0.22)` | Subtle card borders |

The RGB value `114, 128, 210` is the decomposition of `#7280d2`, derived from the surface palette. Do not introduce other RGB values for borders.

## 3. Typography

Only font family: `'Inter'`, with fallback `system-ui, -apple-system, 'Segoe UI', sans-serif`.

| Element | Size | Weight | Color |
|---|---|---|---|
| "Neura" title | `3.2rem` | `500` | `var(--c-title)` |
| Primary CTA | `1.45rem` | `600` | `var(--c-text-strong)` |
| CTA subtitle | `0.88rem` | `400` | `var(--c-text-muted)` |
| Card label | `0.8rem` | `400` | `var(--c-text-muted)` |
| Card value | `1rem` | `600` | `var(--c-text-strong)` |
| Hero subtitle | `0.93rem` | `400` | `var(--c-text-muted)` |
| Footer privacy | `0.8rem` | `400` | `var(--c-text-muted)` |

Rules:

- Allowed weights: `400`, `500`, `600` only.
- Do not use `italic` or `uppercase` in text blocks.
- `letter-spacing: 1px` only on the "Neura" title.

## 4. Design Tokens

Defined in `:root` inside `src/styles/index.css`.

```css
--r-shell: 36px;  /* desktop shell border-radius */
--r-btn:   56px;  /* CTA button border-radius */
--r-card:  18px;  /* card border-radius */
```

## 5. Visual Hierarchy

The visual priority order must not change:

```text
1. "Tengo migraña" button   <- highest priority
2. "Neura" title
3. "Última migraña" card
4. Decoration: waves, stars, footer   <- lowest priority
```

The CTA button must always be the most prominent element on the screen.

## 6. Components

### Shell (`.neura-shell`)

- `max-width: 390px`, simulating a mobile screen.
- `padding: 56px 28px 32px`.
- Vertical gradient: `--c-bg` to `--c-bg-alt`.
- On desktop (`>= 480px`): `--r-shell` rounded corners plus `0 24px 64px rgba(0,0,0,0.7)` outer shadow.

### Hero (`.neura-hero`)

- Horizontally centered.
- Contains title, decorative separator (`· ~~~ ·`), and subtitle.
- Separator uses `--c-surface-3` with `opacity: 0.7-0.8`.

### Title (`.neura-title`)

```css
font-size: 3.2rem;
font-weight: 500;
letter-spacing: 1px;
color: var(--c-title);
opacity: 0.9;
```

### CTA Button (`.migraine-cta`)

```css
min-height: 112px;
padding: 32px 24px 20px;
border-radius: var(--r-btn);
border: 1px solid rgba(114, 128, 210, 0.35);
background: linear-gradient(160deg, --c-surface-3, --c-surface-2, --c-surface);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.06),
  0 12px 32px rgba(0, 0, 0, 0.45),
  0 0 25px rgba(60, 60, 109, 0.25);
```

- The icon (`CloudLightning` / `CloudSun` from `lucide-react`) floats over the top border inside a `52x52px` circle.
- `top: -26px`, half the circle above the button.
- Icon color: `#c8d0f8`, derived from `--c-text`.
- `strokeWidth: 2.2`.

### "Última migraña" Card (`.last-migraine-card`)

```css
border-radius: var(--r-card);
border: 1px solid rgba(114, 128, 210, 0.30);
background: rgba(25, 31, 55, 0.72);
padding: 14px 16px;
```

- Icons: `CalendarDays` and `ChevronRight` from `lucide-react`.
- `strokeWidth: 1.5` for informational icons, `1.8` for the chevron.
- Icon color: `--c-surface-3`.

### Footer Privacy (`.neura-privacy`)

- `margin-top: auto`, pushed to the bottom of the flex container.
- `opacity: 0.75`.
- Icon: `ShieldCheck`, `14px`, `strokeWidth: 1.8`.

## 7. Decorative Background

Implemented in `WaveBackground.tsx`. It must be `aria-hidden="true"`, `pointer-events: none`, and `z-index: 0`.

### Stars

- Maximum 10 dots.
- Dot opacity: `0.10-0.18`, never above `0.20`.
- Radius: `0.7-1.4px`.
- Color: implicit white at very low opacity.
- Static SVG layer, rendered behind waves.

### SVG Waves

Three stacked layers, back to front:

| Layer | Fill | Opacity | Description |
|---|---|---|---|
| Layer 1 | `#191f37` (`--c-surface`) | `0.65` | Deep swell |
| Layer 2 | `#282d51` (`--c-surface-2`) | `0.45` | Middle wave |
| Layer 3 | `#3c3c6d` (`--c-surface-3`) | `0.28` | Surface ripple |

- Container height: `380px`.
- `wave-slide` animation is controlled by `VITE_WAVE_ANIMATED=true`.
- Must respect `prefers-reduced-motion`.

## 8. Spacing And Layout

| Property | Value |
|---|---|
| Shell padding | `56px 28px 32px` |
| Gap between actions | `18px` |
| Actions margin-top from hero | `52px` |
| Shell max-width | `390px` |

## 9. Interactions And States

### CTA Button

| State | Effect |
|---|---|
| `:hover` | `translateY(-1px)` plus a slightly larger shadow |
| `:active` | `translateY(0)`, returning to base position |
| `:focus-visible` | `outline: 2px solid rgba(114,128,210,0.7)`, `offset: 3px` |

- Transition: `0.18s ease` for `transform` and `box-shadow`.
- Do not add color, glow, or scale transitions.

## 10. Strict Constraints

### Do Not

- Add new sections, components, text, or iconography unless the feature explicitly requires it.
- Change layout or element position without a product reason.
- Introduce colors outside this guide's palette.
- Add loud gradients, intense glow, or new animations.
- Use `backdrop-filter`, `filter`, or other CSS effects not covered here.
- Add navbars, menus, dashboards, or tooltips to the main migraine capture flow.

### Allowed Changes

- Opacity adjustments within existing ranges.
- Soft shadows composed from palette colors.
- Small contrast adjustments: border opacity, background opacity.
- Conservative refinements to `letter-spacing` or `line-height`.

## 11. Checklist Before Visual Changes

Before any visual modification, every answer should be yes:

- Does the change use only the defined palette?
- Is the CTA still the most prominent element?
- Is the UI still calm, with no sensory overload?
- Does the visual identity remain intact: depth, waves, darkness?
- Is every new text, icon, or section required by the feature?
- Do `npm run lint` and `npm run build` pass?

If any answer is no, do not apply the change.
