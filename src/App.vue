<template>
  <v-app>
    <!-- ── Navigation Bar ── -->
    <v-app-bar
      flat
      color="surface"
      border="b"
      style="border-color: rgba(255,255,255,0.06) !important"
    >
      <template #prepend>
        <router-link to="/" class="d-flex align-center text-decoration-none ml-4 ga-2">
          <v-icon color="primary" size="28">mdi-rocket-launch</v-icon>
          <span class="text-h6 font-weight-bold text-white">
            Space<span class="text-primary">X</span> Rockets
          </span>
        </router-link>
      </template>

      <template #append>
        <v-chip
          color="secondary"
          variant="tonal"
          size="small"
          class="mr-4 text-caption font-weight-medium"
          prepend-icon="mdi-satellite-variant"
        >
          Launch Library 2
        </v-chip>
      </template>
    </v-app-bar>

    <!-- ── Main Content ── -->
    <v-main class="main-bg">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>

    <!-- ── Footer ── -->
    <v-footer color="surface" border="t" style="border-color: rgba(255,255,255,0.06) !important">
      <div class="d-flex w-100 align-center justify-center py-1">
        <span class="text-caption text-medium-emphasis">
          Data from
          <a
            href="https://thespacedevs.com"
            target="_blank"
            rel="noopener"
            class="text-primary text-decoration-none"
          >The Space Devs</a>
          · Allo Bank Frontend Test
        </span>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style>
/* ── Global Base ── */
:root {
  --space-bg: #090D1A;
  --space-surface: #111827;
  --space-card: #1A2235;
  --space-border: rgba(255, 255, 255, 0.07);
  --space-primary: #4F8EF7;
  --space-secondary: #22D3EE;
}

html, body {
  background-color: var(--space-bg) !important;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.main-bg {
  background: radial-gradient(ellipse at 20% 0%, rgba(79, 142, 247, 0.07) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 100%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
              var(--space-bg);
  min-height: 100vh;
}

/* ── Page transition ── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Card glass effect ── */
.glass-card {
  background: rgba(26, 34, 53, 0.85) !important;
  backdrop-filter: blur(12px);
  border: 1px solid var(--space-border) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(79, 142, 247, 0.15) !important;
}

/* ── Gradient text ── */
.gradient-text {
  background: linear-gradient(135deg, #4F8EF7, #22D3EE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Stat badge ── */
.stat-badge {
  background: rgba(79, 142, 247, 0.08);
  border: 1px solid rgba(79, 142, 247, 0.2);
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--space-bg); }
::-webkit-scrollbar-thumb { background: rgba(79, 142, 247, 0.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(79, 142, 247, 0.6); }
</style>
