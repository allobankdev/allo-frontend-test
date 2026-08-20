<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
</script>

<style>
:root {
  --bg: #0f1117;
  --surface: #1c2030;
  --surface-raised: #232840;
  --border: #2d3347;
  --border-focus: #4f7aff;
  --primary: #4f7aff;
  --primary-hover: #3d6ae6;
  --text: #e2e8f0;
  --text-muted: #8892a4;
  --text-subtle: #56617a;
  --error: #e5534b;
  --error-bg: rgba(229, 83, 75, 0.1);
  --radius: 8px;
  --max-width: 1200px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  background: var(--bg) !important;
  color: var(--text);
  font-family:
    'Roboto',
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.v-main {
  background: var(--bg) !important;
  min-height: 100dvh;
}
</style>
