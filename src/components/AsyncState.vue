<template>
  <div
    v-if="status === 'loading' || status === 'idle'"
    class="d-flex flex-column align-center py-12"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="48"
    />
    <p class="mt-4 text-medium-emphasis">
      {{ loadingText }}
    </p>
  </div>

  <v-alert
    v-else-if="status === 'error'"
    class="my-6"
    :text="error || 'Something went wrong.'"
    title="Failed to load data"
    type="error"
    variant="tonal"
  >
    <template #append>
      <v-btn
        color="error"
        prepend-icon="mdi-refresh"
        variant="flat"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </v-alert>

  <slot v-else />
</template>

<script lang="ts" setup>
  import type { AsyncStatus } from '@/types/rocket'

  withDefaults(defineProps<{
    status: AsyncStatus
    error?: string | null
    loadingText?: string
  }>(), {
    error: null,
    loadingText: 'Loading...',
  })

  const emit = defineEmits<{ retry: [] }>()
</script>

