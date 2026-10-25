<script setup lang="ts">
defineProps<{
  title?: string
  message: string | null
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <v-alert
    type="error"
    variant="tonal"
    class="my-4 justify-center text-center"
  >
      <template #title>{{ title || 'Failed to Load Data' }}</template>
      {{ message }}
      <div class="mt-3">
        <v-btn color="error" variant="flat" @click="emit('retry')">
          Retry
        </v-btn>
      </div>
    </v-alert>
</template>

