<template>
  <div>
    <div
      v-if="status === 'idle' || status === 'loading'"
      class="d-flex flex-column align-center justify-center py-16 ga-4"
      role="status"
      aria-live="polite"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
      <span class="text-body-1 text-medium-emphasis">{{ loadingText }}</span>
    </div>

    <v-alert
      v-else-if="status === 'error'"
      type="error"
      variant="tonal"
      class="my-8"
      role="alert"
      :text="error ?? 'Something went wrong.'"
    >
      <template #append>
        <v-btn
          variant="outlined"
          @click="emit('retry')"
        >
          Try again
        </v-btn>
      </template>
    </v-alert>

    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import type { LoadStatus } from '@/types/rocket'

withDefaults(
  defineProps<{
    status: LoadStatus
    error: string | null
    loadingText?: string
  }>(),
  { loadingText: 'Loading...' },
)

const emit = defineEmits<{ retry: [] }>()
</script>
