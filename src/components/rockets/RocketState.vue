<template>
  <v-sheet
    class="state-panel text-center"
    :color="tone"
    rounded="xl"
  >
    <v-progress-circular
      v-if="status === 'loading'"
      color="primary"
      indeterminate
      size="56"
      width="4"
    />

    <v-icon
      v-else
      :icon="icon"
      size="56"
    />

    <div class="text-h6 font-weight-bold mt-4">
      {{ title }}
    </div>

    <p class="text-body-1 text-medium-emphasis mt-2 mb-0">
      {{ message }}
    </p>

    <v-btn
      v-if="status === 'error' && retryLabel"
      class="mt-6"
      color="primary"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      {{ retryLabel }}
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import type { RequestStatus } from '@/types/rocket'

  const props = withDefaults(defineProps<{
    status: RequestStatus | 'empty'
    title: string
    message: string
    retryLabel?: string
  }>(), {
    retryLabel: 'Retry',
  })

  defineEmits<{
    retry: []
  }>()

  const icon = computed(() => {
    if (props.status === 'error') {
      return 'mdi-alert-circle-outline'
    }

    if (props.status === 'empty') {
      return 'mdi-rocket-outline'
    }

    return 'mdi-progress-clock'
  })

  const tone = computed(() => {
    if (props.status === 'error') {
      return 'error'
    }

    if (props.status === 'empty') {
      return 'surface-variant'
    }

    return 'surface'
  })
</script>

<style scoped>
  .state-panel {
    border: 1px solid rgba(15, 23, 42, 0.08);
    padding: 40px 24px;
  }
</style>
