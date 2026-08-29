<template>
  <div class="d-flex justify-center align-center" style="min-height: 400px;">
    <div class="text-center">
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <div class="text-h6 mb-2">{{ title }}</div>
      <div class="text-body-1 mb-4 text-medium-emphasis">{{ message }}</div>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: 'Error',
  message: 'Something went wrong. Please try again.',
})

defineEmits<{
  retry: []
}>()
</script>

