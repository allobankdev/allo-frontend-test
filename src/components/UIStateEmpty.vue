<template>
  <div class="empty-state-container my-12 text-center p-8 mx-auto">
    <v-icon
      icon="mdi-rocket-outline"
      size="64"
      color="grey-darken-1"
      class="mb-3"
    />

    <h3 class="text-h6 font-weight-bold text-white mb-2">
      Tidak Ada Roket Ditemukan
    </h3>

    <p class="text-body-2 text-grey mb-6 max-w-sm mx-auto">
      Tidak ada roket yang cocok dengan kriteria pencarian atau filter yang Anda pilih.
    </p>

    <v-btn
      variant="outlined"
      color="white"
      class="text-none font-weight-medium"
      prepend-icon="mdi-refresh"
      @click="$emit('reset')"
    >
      Reset Semua Filter
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'reset'): void
}>()
</script>

<style scoped>
.empty-state-container {
  background-color: #121214;
  border: 1px dashed #27272a;
  border-radius: 12px;
  max-width: 500px;
  padding: 3rem 1.5rem;
}

.max-w-sm {
  max-width: 360px;
}
</style>
