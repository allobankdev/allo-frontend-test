<template>
  <div class="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
    <div class="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        />
      </svg>
    </div>
    <p class="font-medium text-slate-700">
      {{ title }}
    </p>
    <p
      v-if="message"
      class="max-w-sm text-sm text-slate-500"
    >
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title?: string
    message?: string | null
  }>(), {
    title: 'No rockets found',
    message: 'Try a different search term.',
  })
</script>
