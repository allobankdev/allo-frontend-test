
<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
    retryLabel?: string
    showRetry?: boolean
  }>(),
  {
    title: 'Something went wrong',
    message: 'An unexpected error occurred.',
    retryLabel: 'Try Again',
    showRetry: true,
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <v-card
    class="error-state"
    variant="outlined"
    rounded="lg"
    role="alert"
    border="error"
  >
    <v-card-text class="pa-6 pa-md-12 text-center">
      <v-avatar
        class="error-icon mb-5"
        size="48"
        color="error"
        variant="tonal"
      >
        <v-icon icon="mdi-alert-circle-outline" size="30" />
      </v-avatar>

      <p class="eyebrow mb-3">REQUEST FAILED</p>

      <v-card-title class="error-title justify-center pa-0 mb-3">
        {{ title }}
      </v-card-title>

      <v-card-subtitle class="error-message pa-0">
        {{ message }}
      </v-card-subtitle>

      <v-btn
        v-if="showRetry"
        class="mt-6"
        color="blue-lighten-2"
        variant="flat"
        prepend-icon="mdi-refresh"
        @click="emit('retry')"
      >
        {{ retryLabel }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.error-state {
  background: #111621;
  border-color: #49303a;
}

.error-icon {
  border: 1px solid rgba(255, 181, 181, 0.5);
}

.eyebrow {
  color: #ffb5b5;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.error-title {
  color: #f4f6fa;
  font-size: 22px;
  font-weight: 700;
  overflow-wrap: anywhere;
  white-space: normal;
}

.error-message {
  color: #a1aabd;
  font-size: 14px;
  line-height: 1.7;
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>
