<template>
  <div>
    <div
      v-if="status === 'loading'"
      class="d-flex flex-column align-center justify-center py-16"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="56"
        width="4"
      />
      <p class="text-body-1 text-medium-emphasis mt-4">
        {{ loadingMessage }}
      </p>
    </div>

    <div
      v-else-if="status === 'error'"
      class="d-flex flex-column align-center justify-center text-center py-16 px-4"
    >
      <v-icon
        color="error"
        icon="mdi-alert-circle-outline"
        size="56"
      />
      <p class="text-h6 mt-4 mb-2">
        Something went wrong
      </p>
      <p class="text-body-2 text-medium-emphasis mb-6">
        {{ errorMessage || 'Please try again.' }}
      </p>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>

    <slot v-else-if="status === 'success'" />
  </div>
</template>

<script lang="ts" setup>
  import type { FetchStatus } from '@/types/rocket'

  withDefaults(defineProps<{
    status: FetchStatus
    errorMessage?: string | null
    loadingMessage?: string
  }>(), {
    errorMessage: null,
    loadingMessage: 'Loading...',
  })

  defineEmits<{
    retry: []
  }>()
</script>
