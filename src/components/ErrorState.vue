<template>
  <div class="text-center py-12">
    <v-icon
      color="error"
      icon="mdi-alert-circle-outline"
      size="56"
    />
    <h2 class="text-h6 mt-4">
      Gagal memuat data
    </h2>
    <p class="text-medium-emphasis mb-6">
      {{ message || 'Terjadi kesalahan. Silakan coba lagi.' }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{ message?: string | null }>()
  const emit = defineEmits<{ retry: [] }>()
</script>