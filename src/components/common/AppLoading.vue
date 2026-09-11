<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-progress-circular indeterminate color="primary" size="48" width="4" />

    <p v-if="message" class="text-body-2 text-medium-emphasis mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
