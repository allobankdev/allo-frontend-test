<script setup lang="ts">
const props = defineProps<{
  error: string;
  onRetry: () => void;
}>();
</script>

<template>
  <v-alert type="error" class="error-alert">
    <template #title>
      <v-icon icon="mdi-alert-circle" class="error-icon" />
      Error Loading Data
    </template>

    <p class="error-message">
      {{ props.error }}
    </p>

    <template #append>
      <v-btn color="error" class="retry-button" @click="onRetry">
        <v-icon left icon="mdi-refresh" />
        Retry
      </v-btn>
    </template>
  </v-alert>
</template>

<style lang="scss" scoped>
.error-alert {
  max-width: 600px;
  margin: 2rem auto;

  .error-icon {
    margin-right: 0.5rem;
  }

  .error-message {
    margin: 1rem 0;
    color: #d32f2f;
  }

  .retry-button {
    margin-left: 1rem;
  }
}
</style>
