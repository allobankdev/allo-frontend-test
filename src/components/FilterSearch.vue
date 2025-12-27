<script setup lang="ts">
  defineProps<{
  filterKey: string
}>()

defineEmits<{
  (e: 'update:filterKey', value: string): void
}>()
</script>

<template>
  <v-text-field
    variant="outlined"
    placeholder="Input rocket name"
    clearable
    :model-value="filterKey"
    @update:model-value="$emit('update:filterKey', $event)"
  >
  </v-text-field>
</template>
