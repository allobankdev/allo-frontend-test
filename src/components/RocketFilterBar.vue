<template>
  <div
    class="inline-flex rounded-full bg-white p-1"
    role="tablist"
  >
    <button
      v-for="option in options"
      :key="option.value"
      :aria-selected="active === option.value"
      class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
      :class="active === option.value ? 'bg-brand-900 text-white' : 'text-muted hover:text-ink'"
      role="tab"
      type="button"
      @click="active = option.value"
    >
      {{ option.label }}
      <span
        class="rounded-full px-1.5 text-[11px]"
        :class="active === option.value ? 'bg-white/20' : 'bg-canvas'"
      >
        {{ counts[option.value] }}
      </span>
    </button>
  </div>
</template>

<script lang="ts" setup>
  import type { ActiveFilter } from '@/types/rocket'

  defineProps<{ counts: Record<ActiveFilter, number> }>()

  const active = defineModel<ActiveFilter>('active', { required: true })

  const options: { label: string, value: ActiveFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Retired', value: 'retired' },
  ]
</script>
