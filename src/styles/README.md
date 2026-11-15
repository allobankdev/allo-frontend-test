# Styles

This directory configures the styles of the application.

| File | Purpose |
| --- | --- |
| `tailwind.css` | Tailwind entry (`base`, `components`, `utilities`), imported in `main.ts` after Vuetify's styles. Also defines a few shared component classes (`.btn-*`, `.form-input`, `.panel`, `.badge`, `.eyebrow`, `.data-label`, `.starfield`). |
| `settings.scss` | Vuetify Sass settings, loaded by `vite-plugin-vuetify`. Vuetify's utility and color classes are disabled (`$utilities: false`, `$color-pack: false`) because several use `!important` and share names with Tailwind utilities (e.g. `.rounded-xl`, `.text-white`). |

Design tokens (the `space` and `flare` colors, font families, the `scan` animation) live in `tailwind.config.js`.
