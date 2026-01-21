<template>
  <div class="error-container">
    <v-icon :size="iconSize" color="error" class="mb-4">
      mdi-alert-circle-outline
    </v-icon>
    <h2 class="error-title">{{ title }}</h2>
    <p class="error-message">{{ message }}</p>
    <v-btn
      v-if="showRetry"
      color="primary"
      variant="elevated"
      size="large"
      @click="$emit('retry')"
      class="mt-4"
    >
      <v-icon start>mdi-refresh</v-icon>
      Retry
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  showRetry?: boolean
  iconSize?: number
}

withDefaults(defineProps<Props>(), {
  title: 'Oops! Something went wrong',
  message: 'An error occurred while loading the data. Please try again.',
  showRetry: true,
  iconSize: 80,
})

defineEmits<{
  retry: []
}>()
</script>
