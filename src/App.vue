<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <a class="skip-link" href="#main">Langsung ke konten</a>
  <header class="site-header">
    <div class="shell header-content">
      <RouterLink class="brand" to="/">Katalog Roket</RouterLink>
      <span class="muted">SpaceX</span>
    </div>
  </header>
  <main id="main" class="shell main-content" tabindex="-1">
    <RouterView />
  </main>
</template>
