<script lang="ts" setup>
  import type { RequestStatus } from '@/types/rocket'

  defineProps<{
    status: RequestStatus
    errorMessage?: string
  }>()

  defineEmits<{ retry: [] }>()
</script>

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
    <p class="mt-4 text-body-2">
      Loading rockets...
    </p>
  </div>

  <v-alert
    v-else-if="status === 'error'"
    class="my-8"
    :text="errorMessage || 'Failed to load data.'"
    title="Something went wrong"
    type="error"
    variant="tonal"
  >
    <template #append>
      <v-btn
        color="error"
        variant="flat"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </v-alert>

  <slot v-else />
</template>
