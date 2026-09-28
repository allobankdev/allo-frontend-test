<script setup lang="ts">
defineProps<{ loading?: boolean; error?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="request-state" role="status" aria-live="polite">
    <span class="loader" aria-hidden="true" />
    <p>Memuat data roket…</p>
  </div>
  <div v-else-if="error" class="request-state error-state" role="alert">
    <h2>Data belum dapat ditampilkan</h2>
    <p>{{ error }}</p>
    <button class="button" type="button" @click="$emit('retry')">Coba lagi</button>
  </div>
</template>
