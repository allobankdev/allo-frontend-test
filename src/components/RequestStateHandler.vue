<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['idle', 'loading', 'success', 'error'].includes(value),
  },
  errorMessage: {
    type: String,
    default: 'Something went wrong.',
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div>
    <div v-if="status === 'loading'" class="d-flex flex-column align-center justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="text-body-2 text-medium-emphasis mt-4">{{ loadingText }}</p>
    </div>

    <div v-else-if="status === 'error'" class="d-flex flex-column align-center justify-center py-16">
      <v-icon icon="mdi-alert-circle-outline" color="error" size="48" class="mb-3" />
      <p class="text-body-1 mb-4 text-center">{{ errorMessage }}</p>
      <v-btn color="primary" prepend-icon="mdi-refresh" @click="emit('retry')">
        Retry
      </v-btn>
    </div>

    <slot v-else />
  </div>
</template>
