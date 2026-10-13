<template>
  <div class="error-container my-10 mx-auto text-center p-8">
    <v-icon
      icon="mdi-alert-circle-outline"
      size="56"
      color="grey-lighten-2"
      class="mb-4"
    />
    
    <h3 class="text-h5 font-weight-bold text-white mb-2">
      Gagal Memuat Data
    </h3>

    <p class="text-body-2 text-grey-lighten-1 max-w-md mx-auto mb-6">
      {{ message || 'Terjadi gangguan koneksi saat menghubungi server API. Silakan periksa koneksi internet Anda dan coba lagi.' }}
    </p>

    <div class="d-flex justify-center gap-3">
      <v-btn
        variant="flat"
        color="white"
        class="text-black font-weight-bold text-none px-6"
        prepend-icon="mdi-reload"
        @click="$emit('retry')"
      >
        Coba Lagi (Retry)
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  message?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>

<style scoped>
.error-container {
  background-color: #141416;
  border: 1px solid #27272a;
  border-radius: 12px;
  max-width: 540px;
  padding: 2.5rem 1.5rem;
}

.max-w-md {
  max-width: 440px;
}

.gap-3 {
  gap: 0.75rem;
}
</style>
