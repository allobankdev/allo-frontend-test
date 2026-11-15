<template>
  <section class="panel p-5 sm:p-7">
    <header class="mb-6 flex items-center gap-4">
      <span class="font-mono text-xs text-flare-400">{{ index }}</span>
      <h2 class="font-display text-xl font-semibold uppercase tracking-[0.08em] text-white">
        {{ title }}
      </h2>
      <span
        class="h-px flex-1 bg-space-700"
        aria-hidden="true"
      />
      <span
        v-if="subtitle"
        class="data-label hidden sm:block"
      >{{ subtitle }}</span>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    /** Section number shown before the title, e.g. "01". */
    index: string
    title: string
    subtitle?: string
  }>(), {
    subtitle: '',
  })
</script>
