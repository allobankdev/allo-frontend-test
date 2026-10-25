<template>
  <div class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
    <label class="relative w-full sm:max-w-sm">
      <span class="sr-only">Filter by name or description</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        />
      </svg>
      <input
        :value="modelValue"
        type="text"
        placeholder="Filter by name or description"
        class="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </label>

    <div class="flex items-center justify-between gap-4 sm:justify-end">
      <span class="text-sm text-slate-500 whitespace-nowrap">
        {{ visibleCount }} {{ visibleCount === 1 ? 'rocket' : 'rockets' }} visible
      </span>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        @click="$emit('add-click')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add rocket
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    modelValue: string
    visibleCount: number
  }>()

  defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'add-click'): void
  }>()
</script>
