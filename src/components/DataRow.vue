<template>
  <div class="flex items-baseline justify-between gap-4 border-b border-space-700/60 py-2.5 last:border-b-0">
    <dt class="data-label">
      {{ label }}
    </dt>
    <dd
      class="text-right font-mono text-sm"
      :class="value ? 'text-slate-100' : 'italic text-slate-600'"
    >
      {{ value || fallback }}
    </dd>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    label: string
    value: string | null
    fallback?: string
  }>(), {
    fallback: 'Not available',
  })
</script>
