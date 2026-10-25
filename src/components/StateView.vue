<!--
  StateView renders one of the three UI states (loading, error, success) so both
  screens handle them consistently. On error it shows a Retry button that emits `retry`.
-->
<template>
  <div class="state-view">
    <div
      v-if="status === 'loading'"
      class="state-view__center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="56"
      />
      <p class="mt-4 text-medium-emphasis">
        {{ loadingText }}
      </p>
    </div>

    <div
      v-else-if="status === 'error'"
      class="state-view__center"
    >
      <v-icon
        color="error"
        icon="mdi-alert-circle-outline"
        size="48"
      />
      <p class="mt-3 mb-4 text-medium-emphasis">
        {{ errorText }}
      </p>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>

    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
  import type { RequestStatus } from '@/stores/rockets'

  withDefaults(
    defineProps<{
      status: RequestStatus
      loadingText?: string
      errorText?: string
    }>(),
    {
      loadingText: 'Loading…',
      errorText: 'Something went wrong while loading data.',
    },
  )

  const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
.state-view__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 16px;
}
</style>
