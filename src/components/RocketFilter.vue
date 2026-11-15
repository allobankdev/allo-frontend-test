<template>
  <div class="panel flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
    <label class="relative flex-1">
      <span class="sr-only">Search rockets</span>
      <span
        class="mdi mdi-magnify pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500"
        aria-hidden="true"
      />
      <input
        :value="filters.query"
        type="search"
        placeholder="Search name or description"
        class="form-input pl-10"
        @input="emit('change', { query: ($event.target as HTMLInputElement).value })"
      >
    </label>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label class="relative sm:w-44">
        <span class="sr-only">Filter by country</span>
        <select
          :value="filters.country ?? ''"
          class="form-input appearance-none pr-9 font-mono text-xs uppercase tracking-wider"
          @change="onCountryChange"
        >
          <option value="">All countries</option>
          <option
            v-for="country in countries"
            :key="country"
            :value="country"
          >
            {{ country }}
          </option>
        </select>
        <span
          class="mdi mdi-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
      </label>

      <div
        class="inline-flex rounded-md border border-space-700 bg-space-950 p-0.5"
        role="group"
        aria-label="Filter by source"
      >
        <button
          v-for="option in SOURCE_OPTIONS"
          :key="option.value"
          type="button"
          class="flex-1 rounded-[5px] px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-flare-400"
          :class="filters.source === option.value ? 'bg-space-700 text-white' : 'text-slate-500 hover:text-slate-200'"
          :aria-pressed="filters.source === option.value"
          @click="emit('change', { source: option.value })"
        >
          {{ option.label }}
        </button>
      </div>

      <button
        type="button"
        class="btn-ghost font-mono text-xs uppercase tracking-wider"
        :disabled="!hasActiveFilters"
        @click="emit('reset')"
      >
        <span
          class="mdi mdi-close"
          aria-hidden="true"
        />
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { RocketFilters, RocketSource } from '@/types/rocket'

  defineProps<{
    filters: RocketFilters
    countries: string[]
    hasActiveFilters: boolean
  }>()

  const emit = defineEmits<{
    change: [patch: Partial<RocketFilters>]
    reset: []
  }>()

  const SOURCE_OPTIONS: ReadonlyArray<{ value: RocketSource, label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'api', label: 'API' },
    { value: 'local', label: 'Local' },
  ]

  function onCountryChange (event: Event): void {
    const value = (event.target as HTMLSelectElement).value
    emit('change', { country: value || null })
  }
</script>
