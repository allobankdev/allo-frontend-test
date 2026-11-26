<template>
  <v-text-field
    v-model="store.filter"
    aria-label="Filter rockets"
    clearable
    hide-details
    label="Filter by name or description"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
  />
</template>

<script lang="ts" setup>
  import { useRocketStore } from '@/stores/rocket'

  const store = useRocketStore()
</script>
