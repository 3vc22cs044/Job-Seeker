# KodNest Premium Build System

Design system for a serious B2C product. One mind, no visual drift. Not a student project—this must feel like a product company.

---

## Design philosophy

**Calm, Intentional, Coherent, Confident.**

- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise
- Everything must feel like one mind designed it

---

## Color system (maximum 4 colors)

| Role       | Token       | Value    |
|-----------|-------------|----------|
| Background| `--kn-bg`   | `#F7F6F3` (off-white) |
| Primary text | `--kn-text` | `#111111` |
| Accent    | `--kn-accent` | `#8B0000` (deep red) |
| Semantic  | `--kn-success` / `--kn-warning` | Muted green / muted amber |

Derived: `--kn-text-muted`, `--kn-border`, `--kn-border-focus` (from the four above). No additional colors.

---

## Typography

- **Headings:** Serif font (`Source Serif 4`), large, confident, generous spacing
- **Body:** Clean sans-serif (`Source Sans 3`), 16–18px, line-height 1.6–1.8
- **Text blocks:** Max width `720px` for readability
- No decorative fonts, no random sizes

---

## Spacing system (consistent scale only)

Use only: **8px, 16px, 24px, 40px, 64px**

Tokens: `--kn-space-1` (8) through `--kn-space-5` (64). Never use values like 13px or 27px. Whitespace is part of the design.

---

## Global layout structure

Every page must follow this order:

1. **Top Bar** — Left: project name · Center: progress (Step X / Y) · Right: status badge
2. **Context Header** — Large serif headline, one-line subtext, clear purpose, no hype
3. **Primary Workspace (70%) + Secondary Panel (30%)** — Main interaction + step explanation and actions
4. **Proof Footer** — Checklist with proof input per item (□ UI Built □ Logic Working □ Test Passed □ Deployed)

---

## Top Bar

- **Left:** Project name
- **Center:** Progress indicator (e.g. “Step 2 / 5”)
- **Right:** Status badge: `kn-badge--not-started` | `kn-badge--progress` (In Progress) | `kn-badge--shipped` (Shipped)

---

## Context Header

- One large serif headline
- One-line subtext
- Clear purpose, no hype language

---

## Primary Workspace

- ~70% width
- Where main product interaction happens
- Clean cards, predictable components, no crowding

---

## Secondary Panel

- ~30% width
- Step explanation (short)
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

---

## Proof Footer

- Persistent bottom section
- Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed
- Each checkbox can have an optional **proof input** (link, file, or text) via `.kn-proof-input`

---

## Component rules

- **Primary button:** Solid deep red (`kn-btn--primary`)
- **Secondary button:** Outlined (`kn-btn--secondary`)
- **Ghost buttons:** Transparent, for tertiary actions
- Same hover effect and border radius everywhere (`--kn-radius`, `--kn-duration`, `--kn-ease`)
- **Inputs:** Clean borders, no heavy shadows, clear focus state
- **Cards:** Subtle border, no drop shadows, balanced padding (spacing scale only)

---

## Interaction rules

- **Transitions:** 150–200ms, ease-in-out (`--kn-duration`, `--kn-ease`)
- No bounce, no parallax

---

## Error and empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user.
- **Empty states:** Provide the next action. Never feel dead.

---

## Usage

Link the single entry file and load fonts before it:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="design-system/kodnest-design-system.css" />
```

---

## File structure

| File | Purpose |
|------|--------|
| `kodnest-design-system.css` | Single entry; imports tokens, base, layout, components |
| `tokens.css` | Colors, typography, spacing scale, motion, radius |
| `base.css` | Reset, body, headings, body text, links, focus |
| `layout.css` | Top bar, context header, workspace + panel, proof footer |
| `components.css` | Buttons, badge, card, input, prompt box, error/empty states |
