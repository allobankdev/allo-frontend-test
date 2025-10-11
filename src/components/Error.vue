<template>
  <div class="error-display">
    <v-alert
      type="error"
      title="Error"
      :text="error"
      class="mb-4"
    />
    <v-btn
      color="primary"
      @click="$emit('retry')"
    >
      <v-icon class="mr-2">mdi-refresh</v-icon>
      Retry
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string;
}>();
defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style scoped>
.error-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>