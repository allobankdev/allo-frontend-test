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
      <div>{{ friendlyError }}</div>
      <div class="text-caption text-medium-emphasis">
        Coba tekan Retry setelah memastikan koneksi internet stabil.
      </div>
      <div>
        <v-btn
          color="error"
          variant="flat"
          :loading="retrying"
          :disabled="retrying"
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
  import { computed } from 'vue'
  import type { UiStatus } from '@/types/rocket'

  interface Props {
    status: UiStatus
    error?: string | null
    retrying?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    error: null,
    retrying: false,
  })

  const friendlyError = computed(() => {
    return props.error || 'Terjadi kesalahan saat mengambil data rocket.'
  })

  defineEmits<{ (event: 'retry'): void }>()
</script>
