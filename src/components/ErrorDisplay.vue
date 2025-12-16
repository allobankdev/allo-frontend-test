<template>
  <div class="error-container">
    <v-icon color="error" size="64">mdi-alert-circle</v-icon>
    <h3 class="mt-4">{{ title }}</h3>
    <p class="mb-4">{{ message }}</p>
    <v-btn color="primary" @click="$emit('retry')">
      <v-icon start>mdi-refresh</v-icon>
      Retry
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 20px;
}
</style>
