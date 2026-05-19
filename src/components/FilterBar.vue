<script setup lang="ts">
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
</script>

<template>
  <v-text-field
    v-model="store.searchQuery"
    prepend-inner-icon="mdi-magnify"
    label="Cari roket..."
    variant="outlined"
    clearable
    hide-details
    density="comfortable"
  />
</template>
