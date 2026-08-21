<template>
  <v-app :theme="currentTheme">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { currentTheme } = useTheme()
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: var(--hig-font-stack);
  background-color: var(--hig-bg-primary);
  color: var(--hig-label);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hig-title1 {
  font-size: var(--hig-title1-size);
  font-weight: var(--hig-title1-weight);
  line-height: var(--hig-title1-lh);
  color: var(--hig-label);
  font-family: var(--hig-font-stack);
  letter-spacing: -0.5px;
  margin: 0;
}

.hig-title2 {
  font-size: var(--hig-title2-size);
  font-weight: var(--hig-title2-weight);
  line-height: var(--hig-title2-lh);
  color: var(--hig-label);
  font-family: var(--hig-font-stack);
  margin: 0;
}

.hig-body {
  font-size: var(--hig-body-size);
  font-weight: var(--hig-body-weight);
  line-height: var(--hig-body-lh);
  font-family: var(--hig-font-stack);
  color: var(--hig-label);
}

.hig-subhead {
  font-size: var(--hig-subhead-size);
  font-weight: var(--hig-subhead-weight);
  line-height: var(--hig-subhead-lh);
  font-family: var(--hig-font-stack);
}

.hig-secondary-label {
  color: var(--hig-secondary-label);
}
</style>
