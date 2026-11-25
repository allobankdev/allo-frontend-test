<!--
  Fungsi: Wrapper utama aplikasi (<v-app> + <router-view />), sekalian nyimpen variabel
          CSS global, font, focus state, sama fix animasi layout bawaan Vuetify.
  Dipakai di:
    - src/main.ts
-->

<template>
  <v-app>
    <v-main class="orbital-canvas">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
:root {
  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  --void: #0e0f11;
  --hull: #16181c;
  --console: #1e2126;
  --ink: #f4f4f5;
  --ink-secondary: #a1a1aa;
  --ink-muted: #8a8a93;
  --line: rgba(255, 255, 255, 0.09);
  --line-active: rgba(255, 255, 255, 0.24);
  --accent: #ea580c;
  --accent-soft: rgba(234, 88, 12, 0.14);
}

body,
.v-application {
  font-family: var(--font-sans) !important;
  background-color: var(--void) !important;
  color: var(--ink) !important;
  -webkit-font-smoothing: antialiased;
}

/* Clean carbon surface — no decorative grid lines */
.orbital-canvas {
  min-height: 100vh;
  background-color: var(--void);
}

/* Fix Vuetify default transition: height / layout animations */
.v-card,
.v-field,
.v-input,
.v-btn {
  transition-property: transform, opacity, background-color, border-color, color, box-shadow !important;
}

.font-display {
  font-family: var(--font-display) !important;
}

.font-mono {
  font-family: var(--font-mono) !important;
  font-variant-numeric: tabular-nums;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>