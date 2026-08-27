<template>
  <!-- Komponen Reusable UI Error State + Tombol Retry -->
  <v-alert
    type="error"
    variant="tonal"
    prominent
    border="start"
    class="my-6 mx-auto max-width-600"
  >
    <template #title>
      <div class="text-h6 font-weight-bold">Error Occurred</div>
    </template>

    <div class="my-2">
      {{ message || 'Failed to load rocket data. Please check your network connection.' }}
    </div>

    <!-- Tombol Retry untuk Panggil Ulang API -->
    <template #append>
      <v-btn
        color="error"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </v-alert>
</template>

<script lang="ts" setup>
// Props: Pesan error
defineProps<{
  message?: string | null
}>()

// Emits: Mengirimkan event 'retry' ke parent component saat tombol Retry diklik
defineEmits<{
  (e: 'retry'): void
}>()
</script>

<style scoped>
.max-width-600 {
  max-width: 600px;
}
</style>
