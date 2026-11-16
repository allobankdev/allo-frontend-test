<script setup lang="ts">
/**
 * AppState.vue
 *
 * Reusable wrapper for the four request states: loading, error, empty, success.
 * Screens pass their own content through slots, so this component knows nothing
 * about rockets.
 */

// Types
import type { RequestStatus } from '@/types/api'

withDefaults(defineProps<{
  status: RequestStatus
  error?: string | null
  empty?: boolean
  emptyTitle?: string
  emptyText?: string
  loadingText?: string
  errorTitle?: string
}>(), {
  error: null,
  empty: false,
  emptyTitle: 'Nothing here yet',
  emptyText: 'Try adjusting your search or filters.',
  loadingText: 'Loading data…',
  errorTitle: 'Failed to load data',
})

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div>
    <slot
      v-if="status === 'loading' || status === 'idle'"
      name="loading"
    >
      <div class="d-flex flex-column align-center py-12">
        <v-progress-circular
          color="primary"
          indeterminate
          size="48"
        />
        <p class="mt-4 text-body-2 text-medium-emphasis">
          {{ loadingText }}
        </p>
      </div>
    </slot>

    <slot
      v-else-if="status === 'error'"
      name="error"
      :message="error"
      :retry="() => emit('retry')"
    >
      <v-alert
        class="text-left"
        type="error"
        variant="tonal"
      >
        <div class="font-weight-medium mb-1">
          {{ errorTitle }}
        </div>
        <div class="text-body-2">
          {{ error }}
        </div>
        <v-btn
          class="mt-3"
          color="error"
          prepend-icon="mdi-refresh"
          variant="flat"
          @click="emit('retry')"
        >
          Retry
        </v-btn>
      </v-alert>
    </slot>

    <slot
      v-else-if="empty"
      name="empty"
    >
      <div class="text-center py-12">
        <v-icon
          class="mb-4 text-medium-emphasis"
          icon="mdi-rocket-launch-outline"
          size="56"
        />
        <h3 class="text-h6 mb-2">
          {{ emptyTitle }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ emptyText }}
        </p>
        <slot name="empty-action" />
      </div>
    </slot>

    <slot v-else />
  </div>
</template>
