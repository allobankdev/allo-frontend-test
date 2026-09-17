<template>
  <div
    v-if="status === 'loading' || status === 'idle'"
    class="card flex flex-col items-center gap-4 py-20 text-center"
  >
    <span class="size-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
    <p class="text-sm text-muted">
      {{ loadingText }}
    </p>
  </div>

  <div
    v-else-if="status === 'error'"
    class="card flex flex-col items-center gap-4 py-20 text-center"
  >
    <span class="flex size-14 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">
      <i class="mdi mdi-alert-circle-outline" />
    </span>
    <div>
      <p class="font-semibold">
        Failed to load data
      </p>
      <p class="mt-1 text-sm text-muted">
        {{ error || 'Something went wrong.' }}
      </p>
    </div>
    <button
      class="btn btn-primary"
      type="button"
      @click="emit('retry')"
    >
      <i class="mdi mdi-refresh text-base" />
      Retry
    </button>
  </div>

  <slot v-else />
</template>

<script lang="ts" setup>
  import type { LoadStatus } from '@/types/rocket'

  withDefaults(defineProps<{
    status: LoadStatus
    error?: string
    loadingText?: string
  }>(), {
    error: '',
    loadingText: 'Loading...',
  })

  const emit = defineEmits<{ retry: [] }>()
</script>
