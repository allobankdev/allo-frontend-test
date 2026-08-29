<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="d-flex flex-column align-center justify-center py-16 ga-4">
    <v-icon icon="mdi-rocket-off" size="64" color="error" />
    <p class="text-h6 text-center">Gagal memuat data roket</p>
    <p class="text-body-2 text-medium-emphasis text-center">{{ message }}</p>
    <v-btn color="primary" prepend-icon="mdi-refresh" @click="$emit('retry')">
      Coba Lagi
    </v-btn>
  </div>
</template>
