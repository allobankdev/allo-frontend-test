<script setup lang="ts">
defineProps<{
  message?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <v-alert
    type="error"
    variant="tonal"
    class="mb-6"
  >
    <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-3">
      <div class="flex-grow-1">
        {{ message || 'Something went wrong. Please try again.' }}
      </div>

      <v-btn
        color="error"
        variant="flat"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>