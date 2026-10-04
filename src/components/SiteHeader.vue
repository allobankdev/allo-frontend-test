<template>
  <header class="site-header">
    <RouterLink
      to="/"
      class="brand"
      aria-label="Allo Space home"
    >
      <span class="brand-mark">A</span>
      <span>allo<span class="brand-light">space</span></span>
    </RouterLink>

    <RouterLink
      v-if="backLink"
      to="/"
      class="header-link"
    >
      &larr; Back to collection
    </RouterLink>
    <div
      v-else
      class="header-status"
    >
      <span class="live-dot" />Space exploration
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ backLink?: boolean }>()
</script>
