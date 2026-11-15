<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-lg border border-rose-500/30 bg-rose-950/20 px-6 py-16 text-center"
    role="alert"
  >
    <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-rose-400">
      Signal lost
    </p>
    <h2 class="font-display text-2xl font-semibold uppercase tracking-wide text-white">
      {{ title }}
    </h2>
    <p class="max-w-md text-sm text-slate-400">
      {{ message || 'Something went wrong. Please try again.' }}
    </p>
    <div class="mt-3 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        class="btn-primary"
        @click="emit('retry')"
      >
        <span
          class="mdi mdi-refresh"
          aria-hidden="true"
        />
        Retry
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    title?: string
    message?: string | null
  }>(), {
    title: 'Failed to load data',
    message: null,
  })

  const emit = defineEmits<{ retry: [] }>()
</script>
