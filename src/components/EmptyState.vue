<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-space-700 px-6 py-16 text-center">
    <p
      v-if="code"
      class="data-label"
    >
      {{ code }}
    </p>
    <h2 class="font-display text-2xl font-semibold uppercase tracking-wide text-white">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="max-w-md text-sm text-slate-400"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-3 flex flex-wrap justify-center gap-3"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    title: string
    description?: string
    /** Short monospace status code shown above the title, e.g. "0 results". */
    code?: string
  }>(), {
    description: '',
    code: '',
  })
</script>
