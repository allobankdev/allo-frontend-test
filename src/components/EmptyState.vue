<template>
  <v-sheet
    class="d-flex flex-column align-center justify-center py-12 text-center"
    rounded
  >
    <v-icon
      color="grey"
      size="48"
    >
      mdi-rocket-launch-outline
    </v-icon>
    <p class="mt-4 text-h6">
      {{ title }}
    </p>
    <p class="text-body-2 text-medium-emphasis">
      {{ message }}
    </p>
    <slot />
  </v-sheet>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ title?: string, message?: string }>(), {
  title: 'No rockets found',
  message: 'Try adjusting your search or filters.',
})
</script>
