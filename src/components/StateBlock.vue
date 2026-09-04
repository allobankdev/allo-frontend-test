<script setup lang="ts">
import type { FetchState } from '@/stores/launchers'

defineProps<{
  state: FetchState
  error?: string | null
  emptyMessage?: string
}>()

const emit = defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div
    v-if="state === 'loading' || state === 'idle'"
    class="text-center py-12"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
    />
    <p class="mt-4 text-medium-emphasis">
      Loading…
    </p>
  </div>

  <div
    v-else-if="state === 'error'"
    class="text-center py-12"
  >
    <v-icon
      size="48"
      icon="mdi-alert-circle-outline"
      color="error"
    />
    <p class="mt-4 font-weight-medium">
      Could not load.
    </p>
    <p class="text-medium-emphasis">
      {{ error || 'Unknown error.' }}
    </p>
    <v-btn
      class="mt-4"
      color="primary"
      prepend-icon="mdi-refresh"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </div>

  <div
    v-else-if="state === 'success'"
    class="text-center py-12"
  >
    <v-icon
      size="48"
      icon="mdi-rocket-launch"
    />
    <p class="mt-4 text-medium-emphasis">
      {{ emptyMessage || 'No items match your filter.' }}
    </p>
  </div>
</template>
