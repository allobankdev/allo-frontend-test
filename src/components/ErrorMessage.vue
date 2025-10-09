<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
  showRetry?: boolean;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
}>();
</script>

<template>
  <v-container class="text-center py-10">
    <v-icon color="error" size="64" class="mb-4">
      mdi-alert-circle-outline
    </v-icon>

    <h2 class="text-h5 font-weight-bold mb-2">
      {{ title }}
    </h2>

    <p class="text-body-1 mb-4">
      {{ message }}
    </p>

    <v-btn
      v-if="showRetry"
      color="error"
      variant="elevated"
      rounded="lg"
      prepend-icon="mdi-refresh"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </v-container>
</template>

<style scoped>
.v-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
