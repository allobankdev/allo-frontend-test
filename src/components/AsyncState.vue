<template>
  <div
    v-if="status === 'loading' || status === 'idle'"
    class="state"
  >
    <v-progress-circular
      indeterminate
      size="32"
      width="3"
    />
    <p class="text-medium-emphasis">
      {{ loadingText }}
    </p>
  </div>

  <div
    v-else-if="status === 'error'"
    class="state"
  >
    <v-icon
      icon="mdi-alert-circle-outline"
      size="36"
    />
    <p class="text-medium-emphasis">
      {{ error || 'Something went wrong.' }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </div>

  <slot v-else />
</template>

<script lang="ts" setup>
  import type { LoadStatus } from '@/types/rocket'

  withDefaults(defineProps<{
    status: LoadStatus
    error?: string
    loadingText?: string
  }>(), {
    error: '',
    loadingText: 'Loading...',
  })

  const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 72px 16px;
  text-align: center;
}

.state p {
  margin: 0;
}
</style>
