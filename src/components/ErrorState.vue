<template>
  <v-container class="py-12">
    <v-card
      class="mx-auto pa-8 text-center rounded-xl elevation-2 border"
      max-width="560"
      color="surface"
    >
      <v-avatar
        color="error-lighten-5"
        size="72"
        class="mb-4 text-error"
      >
        <v-icon
          icon="mdi-cloud-alert"
          size="40"
        />
      </v-avatar>

      <h2 class="text-h5 font-weight-bold text-high-emphasis mb-2">
        {{ title || 'Gagal Memuat Data' }}
      </h2>

      <p class="text-body-1 text-medium-emphasis mb-6">
        {{ message || 'Terjadi gangguan saat menghubungi server API. Silakan periksa koneksi Anda dan coba kembali.' }}
      </p>

      <div class="d-flex justify-center ga-3">
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          prepend-icon="mdi-reload"
          class="px-6 font-weight-bold rounded-lg"
          :loading="loading"
          @click="$emit('retry')"
        >
          Coba Lagi (Retry)
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
  loading?: boolean
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
