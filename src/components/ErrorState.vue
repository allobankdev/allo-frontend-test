<script setup lang="ts">
defineProps<{
  error: string | null;
}>();
const emit = defineEmits<{
  retry: [];
}>();
</script>
<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
      <v-icon icon="mdi-alert-circle-outline" size="30" class="text-red-500" />
    </div>

    <h2 class="mt-4 text-lg font-semibold text-gray-900">
      Failed to load rockets
    </h2>

    <p class="mt-2 max-w-md text-sm text-gray-500">
      {{ error }}
    </p>

    <div class="mt-2 flex items-center gap-2">
      <slot name="actions" />
      <button type="button" @click="emit('retry')"
      class="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 active:scale-[0.98]">
      <v-icon icon="mdi-refresh" size="18" />
      Retry
    </button>
    </div>
  </div>
</template>