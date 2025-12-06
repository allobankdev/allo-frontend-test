<template>
  <v-text-field
    v-model="search"
    placeholder="search"
    variant="solo"
    prepend-inner-icon="mdi-magnify"
    hide-details
    rounded="xl"
    class="search-bar"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const search = ref("");
</script>

<style scoped>
.search-bar {
  background: none;
  color: #d1d5db !important;
  border-radius: 9999px !important;
  padding-left: 6px;
  padding-right: 6px;

  /* Soft glow / blur feeling */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Subtle shadow to match screenshot depth */
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);
}

/* placeholder style */
.search-bar input::placeholder {
  color: #9ca3af !important; /* Tailwind gray-400 */
  opacity: 1;
}

/* Remove default Vuetify underline/outline */
.search-bar .v-field__outline {
  display: none !important;
}

.search-bar .v-field__overlay {
  background: transparent !important;
}
</style>
