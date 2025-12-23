<template>
  <v-container class="d-flex flex-column justify-center align-center" style="min-height: 400px">
    <v-icon
      size="64"
      color="error"
      class="mb-4"
    >
      mdi-alert-circle
    </v-icon>
    <v-card-title class="text-h6 mb-2">
      {{ title || 'Something went wrong' }}
    </v-card-title>
    <v-card-text v-if="message" class="text-center mb-4">
      {{ message }}
    </v-card-text>
    <v-btn
      color="primary"
      @click="$emit('retry')"
    >
      <v-icon start>mdi-refresh</v-icon>
      Retry
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  message?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

