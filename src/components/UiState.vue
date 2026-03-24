<template>
  <div
    v-if="status === 'loading'"
    class="py-8 text-center"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="40"
    />
    <div class="mt-3 text-body-2">
      Memuat data rocket...
    </div>
  </div>

  <v-alert
    v-else-if="status === 'error'"
    type="error"
    variant="tonal"
    class="my-4"
  >
    <div class="d-flex flex-column ga-3">
      <div>{{ error || 'Terjadi kesalahan.' }}</div>
      <div>
        <v-btn
          color="error"
          variant="flat"
          @click="$emit('retry')"
        >
          Retry
        </v-btn>
      </div>
    </div>
  </v-alert>

  <slot v-else />
</template>

<script setup lang="ts">
  import type { UiStatus } from '@/types/rocket'

  interface Props {
    status: UiStatus
    error?: string | null
  }

  defineProps<Props>()
  defineEmits<{ (event: 'retry'): void }>()
</script>
