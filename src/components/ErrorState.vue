<template>
  <div class="error-container pa-8 text-center my-8 mx-auto rounded-2xl bg-white">
    <div class="error-icon-wrapper mb-4">
      <v-icon icon="mdi-alert-circle-outline" size="32" color="error" />
    </div>

    <h3 class="text-h6 font-weight-bold text-slate-900 mb-2">
      {{ title || 'Unable to Load Rockets' }}
    </h3>

    <p class="text-body-2 text-slate-500 mb-6 max-w-400 mx-auto">
      {{ message || 'There was a problem communicating with the Launch Library API. Please check your network connection and try again.' }}
    </p>

    <div class="d-flex justify-center align-center ga-3">
      <v-btn
        color="primary"
        variant="flat"
        rounded="lg"
        prepend-icon="mdi-refresh"
        class="text-none font-weight-semibold px-5 action-btn"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>

      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>

<style scoped>
.error-container {
  border: 1px solid #fee2e2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  max-width: 520px;
}

.error-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: #fef2f2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.max-w-400 {
  max-width: 400px;
}

.action-btn {
  background-color: #0f172a !important;
  color: #ffffff !important;
}
</style>
