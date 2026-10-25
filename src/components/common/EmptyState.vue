<template>
  <v-sheet
    color="transparent"
    class="text-center py-12 px-4 rounded-lg border border-dashed"
  >
    <v-icon icon="mdi-rocket-outline" size="64" color="medium-emphasis" class="mb-4" />
    <h3 class="text-h6 font-weight-medium mb-1">No rockets found</h3>
    <p class="text-body-2 text-medium-emphasis mb-6">
      No SpaceX rockets matched your filter "{{ query }}".
    </p>
    <v-btn
      variant="outlined"
      color="primary"
      prepend-icon="mdi-filter-remove"
      @click="$emit('clear')"
    >
      Clear Filter
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
defineProps<{
  query: string
}>()

defineEmits<{
  (e: 'clear'): void
}>()
</script>
