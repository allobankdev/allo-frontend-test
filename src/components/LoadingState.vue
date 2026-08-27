<template>
  <!-- Komponen Reusable UI Loading State -->
  <v-container class="py-8 text-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
      width="6"
      class="mb-4"
    ></v-progress-circular>
    <p class="text-subtitle-1 text-medium-emphasis">
      {{ message || 'Loading rocket data...' }}
    </p>
  </v-container>
</template>

<script lang="ts" setup>
// Props: Menyediakan pesan kustom saat proses loading
defineProps<{
  message?: string
}>()
</script>
