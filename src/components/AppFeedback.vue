<template>
  <v-sheet
    class="feedback"
    border
    rounded="lg"
    role="status"
  >
    <v-progress-circular
      v-if="state === 'loading'"
      color="primary"
      indeterminate
      size="28"
    />
    <v-icon
      v-else
      :color="state === 'error' ? 'error' : 'secondary'"
      :icon="state === 'error' ? 'mdi-alert-circle-outline' : 'mdi-information-outline'"
      size="28"
    />
    <div>
      <p class="feedback__title">
        {{ title }}
      </p>
      <p class="feedback__message">
        {{ message }}
      </p>
    </div>
    <v-btn
      v-if="state === 'error' && retryable"
      color="primary"
      min-height="44"
      @click="$emit('retry')"
    >
      Retry request
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  state: 'loading' | 'error' | 'empty'
  title: string
  message: string
  retryable?: boolean
}>(), {
  retryable: true,
})

defineEmits<{ retry: [] }>()
</script>

<style scoped>
.feedback { align-items: center; display: flex; gap: 16px; justify-content: center; min-height: 160px; padding: 24px; text-align: left; }
.feedback__title, .feedback__message { margin: 0; }
.feedback__title { color: #172033; font-weight: 700; }
.feedback__message { color: #52616b; margin-top: 4px; max-width: 520px; }
@media (max-width: 600px) { .feedback { align-items: flex-start; flex-direction: column; } }
</style>
