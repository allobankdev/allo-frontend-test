<template>
  <div
    v-if="isLoading"
    class="d-flex flex-column align-center ga-4 py-16"
    role="status"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="48"
    />
    <span class="text-medium-emphasis">{{ loadingText }}</span>
  </div>

  <v-alert
    v-else-if="status === 'error'"
    class="my-8"
    type="error"
    variant="tonal"
  >
    <div class="d-flex flex-wrap align-center justify-space-between ga-4">
      <span>{{ error ?? 'Terjadi kesalahan.' }}</span>
      <v-btn
        color="error"
        prepend-icon="mdi-refresh"
        variant="flat"
        @click="emit('retry')"
      >
        Coba lagi
      </v-btn>
    </div>
  </v-alert>

  <slot v-else />
</template>

<script lang="ts" setup>
  /**
   * Pembungkus tiga state UI pengambilan data: Loading, Fail dengan tombol Retry, dan Success.
   * Konten slot default hanya dirender saat status `success`.
   */
  import { computed } from 'vue'
  import type { LoadStatus } from '@/stores/rocket'

  const props = withDefaults(defineProps<{
    /** Status pengambilan data saat ini. */
    status: LoadStatus
    /** Pesan error yang ditampilkan saat status `error`. */
    error?: string | null
    /** Teks di bawah indikator loading. */
    loadingText?: string
  }>(), {
    error: null,
    loadingText: 'Memuat data...',
  })

  const emit = defineEmits<{
    /** Dipicu saat pengguna menekan tombol Coba lagi. */
    retry: []
  }>()

  // `idle` diperlakukan seperti loading karena fetch dimulai begitu komponen dipasang.
  const isLoading = computed(() => props.status === 'loading' || props.status === 'idle')
</script>
