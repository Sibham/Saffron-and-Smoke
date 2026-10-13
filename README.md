# Saffron & Smoke — Indian Fine Dining Website

A production-quality, fully responsive restaurant website built with HTML5, CSS3, and vanilla JavaScript (ES modules, no frameworks).

---

## 🚀 How to Run

### Option A — VS Code Live Server (recommended)
1. Open the `Dom project` folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`

### Option B — Python HTTP Server
```bash
cd "d:/Dom project"
python -m http.server 8080
# Open http://localhost:8080
```

### Option C — Node.js `serve`
```bash
cd "d:/Dom project"
npx serve .
```

> ⚠️ **Must be served over HTTP**, not opened as a `file://` URL.  
> ES modules (`type="module"`) require an HTTP server due to browser CORS restrictions.

---

## 📁 File Structure

```
Dom project/
├── index.html              — Full HTML scaffold (semantic, accessible, SEO-ready)
├── README.md
│
├── css/
│   ├── reset.css           — Meyer reset + modern baselines
│   ├── variables.css       — Design tokens (colors, spacing, typography, shadows)
│   ├── layout.css          — Containers, sections, grid helpers, scroll-reveal states
│   ├── components.css      — All UI components (nav, hero, cards, gallery, form…)
│   └── responsive.css      — Breakpoint overrides (480 / 640 / 768 / 1024 / 1280px)
│
├── js/
│   ├── main.js             — Entry point; orchestrates all modules
│   ├── dom.js              — Utilities: qs, qsa, createElement, debounce, throttle, delegate
│   ├── nav.js              — Sticky header, hamburger toggle, active-link observer
│   ├── ui.js               — Theme toggle, scroll-reveal, back-to-top, parallax + renderers
│   ├── gallery.js          — Gallery filter + lightbox (keyboard + ARIA)
│   ├── accordion.js        — FAQ accordion (ARIA expanded/controls)
│   └── form.js             — Real-time validation, inline errors, success state
│
└── assets/
    └── images/             — All generated images (hero, about, dishes, gallery)
```

---

## 🧩 JS Module Architecture

| Module | Responsibilities |
|---|---|
| `main.js` | Bootstrap: apply theme → render data → init nav → init UI → init gallery → init form |
| `dom.js` | `qs()`, `qsa()`, `createElement()`, `debounce()`, `throttle()`, `delegate()`, `trapFocus()` |
| `nav.js` | Sticky header scroll listener (throttled), hamburger open/close with ARIA + Esc, smooth anchor scrolling, active-link IntersectionObserver |
| `ui.js` | Theme toggle (localStorage), scroll-reveal IntersectionObserver, back-to-top, hero parallax; renders dishes / testimonials / pricing from JS data arrays |
| `gallery.js` | Builds gallery from data array; filter tabs via event delegation; lightbox with keyboard nav (←→Esc) and focus management |
| `accordion.js` | Builds FAQ from data array; toggle open/close with `aria-expanded` / `aria-controls` via event delegation |
| `form.js` | Per-field validation rules; real-time errors on blur/input; `aria-invalid`; success state on submit |

---

## 🎨 Design System

- **Palette:** Deep black (#080807) × warm gold (#c9a84c) with warm off-white text
- **Headings:** Cormorant Garamond (Google Fonts) — luxury serif
- **Body:** Inter (Google Fonts) — clean modern sans
- **Fluid type:** All headings use `clamp()` for viewport-responsive sizing
- **Spacing:** 13-step scale (sp-1 → sp-32) as CSS custom properties
- **Dark/light mode:** Full token swap via `[data-theme="light"]` attribute

---

## ♿ Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Single `<h1>`, logical h2→h3 heading hierarchy
- Skip-to-content link
- All interactive elements have `aria-label` / `aria-expanded` / `aria-controls`
- Focus trapped in modal/drawer
- `prefers-reduced-motion` disables all animations
- WCAG AA contrast (gold on black ≥ 4.5:1)
- All form inputs have associated `<label>` elements
- Live regions (`aria-live="polite"`) for form errors and lightbox counter

---

## 📱 Responsive Breakpoints

| Width | Layout |
|---|---|
| 320px–479px | Single column, hamburger nav |
| 480px | 2-col gallery grid |
| 640px | 2-col form, 2-col testimonials, 2-col footer |
| 768px | 2-col about, 3-col gallery, 2-col pricing, horizontal nav |
| 1024px | 4-col gallery, 3-col pricing/testimonials/dishes, nav reserve button |
| 1280px+ | Max container, wider gutters |
