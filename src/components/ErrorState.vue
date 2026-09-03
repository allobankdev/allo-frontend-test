<template>
  <v-container
    class="d-flex flex-column align-center justify-center py-16"
    style="min-height: 420px;"
  >
    <div class="error-icon-wrapper mb-4">
      <v-icon
        :icon="isRateLimit ? 'mdi-clock-alert-outline' : 'mdi-alert-circle-outline'"
        size="64"
        :color="isRateLimit ? 'warning' : 'error'"
      />
    </div>

    <h2 class="text-h5 font-weight-bold text-slate-800 mb-2">
      {{ isRateLimit ? 'Rate Limit Exceeded' : 'Unable to Load Data' }}
    </h2>

    <p class="text-body-1 text-slate-600 text-center mb-6 error-message">
      {{ message }}
    </p>

    <div
      v-if="isRateLimit"
      class="rate-limit-hint mb-6 pa-4 rounded-lg"
    >
      <v-icon
        icon="mdi-information-outline"
        size="18"
        class="mr-2 text-warning"
      />
      <span class="text-body-2">
        Launch Library 2 allows 15 requests/hour for anonymous users. Please wait a moment before trying again.
      </span>
    </div>

    <v-btn
      color="primary"
      variant="elevated"
      rounded="lg"
      size="large"
      prepend-icon="mdi-refresh"
      :loading="isRetrying"
      class="retry-btn"
      @click="handleRetry"
    >
      Try Again
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Failed to load data. Please check your network connection and try again.',
  },
)

const emit = defineEmits<{
  retry: []
}>()

const isRetrying = ref(false)

const isRateLimit = computed(() => {
  return props.message?.toLowerCase().includes('rate limit') || props.message?.includes('429')
})

function handleRetry() {
  isRetrying.value = true
  emit('retry')
  setTimeout(() => {
    isRetrying.value = false
  }, 1000)
}
</script>

<style scoped>
.error-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background-color: #fee2e2;
}

.error-message {
  max-width: 520px;
  line-height: 1.6;
}

.rate-limit-hint {
  display: flex;
  align-items: center;
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  max-width: 520px;
  color: #92400e;
}

.retry-btn {
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  padding: 0 28px !important;
}
</style>
