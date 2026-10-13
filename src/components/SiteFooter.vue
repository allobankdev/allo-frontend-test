<template>
  <footer class="site-footer">
    <span>ALLO SPACE <span class="brand-light">ARCHIVE</span></span>
    <span class="footer-credit">Data from Launch Library 2 · Made for the curious</span>
    <button
      v-if="backToTop"
      class="footer-action"
      type="button"
      @click="scrollToTop"
    >
      Back to top ↑
    </button>
    <RouterLink
      v-else
      to="/"
      class="footer-action"
    >
      All launchers ↗
    </RouterLink>
  </footer>
</template>

<script setup lang="ts">
defineProps<{ backToTop?: boolean }>()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
