<template>
  <v-alert
    type="error"
    variant="tonal"
    density="comfortable"
    class="my-6 pa-4 rounded-lg"
  >
    <div class="d-flex flex-column flex-sm-row align-center justify-space-between ga-3">
      <div class="d-flex align-center ga-3">
        <v-icon icon="mdi-alert-circle-outline" size="28" />
        <div>
          <div class="text-subtitle-1 font-weight-bold">Failed to load rocket data</div>
          <div class="text-body-2 text-medium-emphasis">{{ message || 'Please check your connection and try again.' }}</div>
        </div>
      </div>
      <v-btn
        color="error"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
