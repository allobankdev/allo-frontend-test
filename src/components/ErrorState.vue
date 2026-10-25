<template>
  <div class="d-flex flex-column align-center justify-center pa-12">
    <v-icon
      icon="mdi-alert-circle-outline"
      size="48"
      color="error"
    />
    <p class="mt-4 text-medium-emphasis text-center">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      class="mt-4"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: "Failed to load data.",
});
defineEmits<{ retry: [] }>();
</script>
