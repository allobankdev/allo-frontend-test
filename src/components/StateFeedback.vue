<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height py-10">
    <template v-if="isLoading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <div class="text-h6 mt-4 text-medium-emphasis">Memuat data roket...</div>
    </template>

    <template v-else-if="errorMessage">
      <v-icon
        icon="mdi-alert-circle-outline"
        color="error"
        size="64"
        class="mb-4"
      ></v-icon>
      <div class="text-h6 text-error mb-2">Terjadi Kesalahan</div>
      <div class="text-body-1 mb-6 text-center text-medium-emphasis">
        {{ errorMessage }}
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
        rounded="pill"
        elevation="2"
      >
        Coba Lagi
      </v-btn>
    </template>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean;
  errorMessage: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
