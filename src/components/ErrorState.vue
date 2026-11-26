<template>
  <v-card class="state-panel mx-auto text-center" variant="flat" max-width="560">
    <v-card-text class="pa-8">
      <v-icon icon="mdi-alert-circle-outline" size="56" color="error" class="mb-4" />

      <h2 class="text-h6 mb-2">{{ title }}</h2>
      <p class="text-body-2 text-medium-emphasis mb-6">{{ message }}</p>

      <v-btn color="primary" prepend-icon="mdi-refresh" @click="emit('retry')">
        {{ retryLabel }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
    retryLabel?: string
  }>(),
  {
    title: 'Something went wrong',
    message: 'We could not load the data. Please try again.',
    retryLabel: 'Retry',
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>
