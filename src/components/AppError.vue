<template>
  <div class="text-center py-12">
    <v-icon
      size="72"
      color="error"
      class="mb-4"
    >
      mdi-rocket-off
    </v-icon>
    <p class="text-h6 mb-1">
      Oops, something went wrong
    </p>
    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      variant="flat"
      @click="$emit('retry')"
    >
      Try Again
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>
