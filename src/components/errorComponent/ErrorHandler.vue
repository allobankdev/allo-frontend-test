<template>
  <div
    class="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"
    role="alert"
  >
    <div class="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
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
          d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        />
      </svg>
    </div>
    <p class="font-medium text-red-800">
      {{ title }}
    </p>
    <p
      v-if="message"
      class="max-w-sm text-sm text-red-700"
    >
      {{ message }}
    </p>
    <button
      type="button"
      class="mt-2 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
      @click="$emit('retry')"
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
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
      {{ retryLabel }}
    </button>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title?: string
    message?: string | null
    retryLabel?: string
  }>(), {
    title: 'Something went wrong',
    message: 'We couldn\u2019t load the data. Please check your connection and try again.',
    retryLabel: 'Retry',
  })

  defineEmits<{
    (e: 'retry'): void
  }>()
</script>
