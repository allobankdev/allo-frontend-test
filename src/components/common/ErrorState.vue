<template>
  <v-sheet
    class="error-state pa-8 text-center"
    rounded="xl"
  >
    <v-icon
      color="error"
      size="52"
    >
      mdi-cloud-alert-outline
    </v-icon>
    <h2 class="mt-4 text-h6 font-weight-bold">
      Data gagal dimuat
    </h2>
    <p class="mx-auto mt-2 mb-5 text-medium-emphasis">
      {{ message }} Silakan periksa koneksi internet lalu coba lagi.
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      rounded="lg"
      @click="emit('retry')"
    >
      Coba lagi
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
  defineProps<{ message: string }>()
  const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
.error-state {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(17, 27, 49, 0.72);
}

.error-state p {
  max-width: 520px;
}
</style>
