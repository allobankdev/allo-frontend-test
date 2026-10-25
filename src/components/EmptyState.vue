<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'No rockets found',
    description: 'Try changing your search or filter criteria.',
  },
)
</script>

<template>
  <v-sheet
    border
    rounded="lg"
    class="pa-8 text-center"
  >
    <v-icon
      icon="mdi-rocket-outline"
      size="48"
      class="mb-4"
    />

    <h2 class="text-h6 mb-2">
      {{ title }}
    </h2>

    <p class="text-body-2 text-medium-emphasis mb-0">
      {{ description }}
    </p>
  </v-sheet>
</template>