<template>
  <v-card
    variant="outlined"
    rounded="lg"
    class="pa-8 text-center my-6 mx-auto"
    max-width="500"
  >
    <v-avatar
      color="surface-variant"
      size="64"
      class="mb-4"
    >
      <v-icon
        icon="mdi-rocket-outline"
        size="36"
        color="medium-emphasis"
      />
    </v-avatar>

    <h2 class="text-h6 font-weight-bold mb-2">
      {{ title }}
    </h2>

    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message }}
    </p>

    <v-btn
      v-if="showReset"
      color="primary"
      variant="tonal"
      prepend-icon="mdi-filter-remove-outline"
      class="text-none"
      @click="$emit('reset')"
    >
      Clear Filters
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  showReset?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'No Rockets Found',
  message: 'Try adjusting your search query or status filter to find what you are looking for.',
  showReset: true,
})

defineEmits<{
  reset: []
}>()
</script>
