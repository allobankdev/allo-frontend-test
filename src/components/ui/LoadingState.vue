<template>
  <div
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    role="status"
    aria-label="Loading rockets"
  >
    <div
      v-for="n in count"
      :key="n"
      class="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div class="aspect-[4/3] w-full bg-slate-200" />
      <div class="space-y-3 p-4">
        <div class="h-4 w-2/3 rounded bg-slate-200" />
        <div class="h-3 w-full rounded bg-slate-200" />
        <div class="h-3 w-5/6 rounded bg-slate-200" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    count?: number
  }>(), {
    count: 6,
  })
</script>
