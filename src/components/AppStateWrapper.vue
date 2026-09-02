<template>
  <!-- Loading -->
  <div
    v-if="status === 'loading'"
    class="app-state-wrapper app-state-wrapper--loading"
  >
    <slot name="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="56"
      />
    </slot>
  </div>

  <!-- Error -->
  <div
    v-else-if="status === 'error'"
    class="app-state-wrapper app-state-wrapper--error"
  >
    <slot name="error">
      <v-icon
        icon="mdi-alert-circle-outline"
        color="error"
        size="56"
      />
      <p class="text-error mt-3">
        {{ errorMessage || 'Something went wrong.' }}
      </p>
      <v-btn
        variant="tonal"
        color="error"
        prepend-icon="mdi-refresh"
        class="mt-4"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </slot>
  </div>

  <!-- Success -->
  <slot v-else />
</template>

<script lang="ts" setup>
defineProps<{
  status: 'idle' | 'loading' | 'success' | 'error'
  errorMessage?: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.app-state-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
}
</style>
