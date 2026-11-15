<template>
  <div class="border-l border-space-600 pl-4">
    <dt class="data-label">
      {{ label }}
    </dt>
    <dd
      class="mt-1.5 font-mono"
      :class="value ? 'text-xl text-white' : 'text-sm italic text-slate-600'"
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
