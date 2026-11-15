<template>
  <div
    class="flex flex-col items-center justify-center gap-4 py-24"
    role="status"
    aria-live="polite"
  >
    <div
      class="relative h-px w-48 overflow-hidden bg-space-700"
      aria-hidden="true"
    >
      <div class="absolute inset-y-0 left-0 w-2/5 animate-scan bg-gradient-to-r from-transparent via-flare-500 to-transparent motion-reduce:animate-none" />
    </div>
    <p class="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ label?: string }>(), {
    label: 'Loading',
  })
</script>
