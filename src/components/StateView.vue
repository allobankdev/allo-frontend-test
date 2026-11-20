<template>
  <!-- Loading: shown while waiting for the API (and before the first request). -->
  <div
    v-if="status === 'loading' || status === 'idle'"
    class="state-view"
    data-testid="loading"
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

  <!-- Error: show the message and let the user retry. -->
  <div
    v-else-if="status === 'error'"
    class="state-view"
    data-testid="error"
  >
    <v-icon
      color="error"
      icon="mdi-alert-circle-outline"
      size="48"
    />
    <p class="mt-4">
      {{ error || 'Something went wrong.' }}
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

  <!-- Success: render whatever the parent put inside <StateView>...</StateView>. -->
  <slot v-else />
</template>

<script lang="ts" setup>
import type { LoadStatus } from '../types/rocket'
import { defineProps } from 'vue';

withDefaults(defineProps<{
  status: LoadStatus
  error?: string | null
  loadingText?: string
}>(), {
  error: null,
  loadingText: 'Loading…',
})

// The parent decides what "retry" means (reload the list, reload the detail...).
const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
.state-view {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
}
</style>
