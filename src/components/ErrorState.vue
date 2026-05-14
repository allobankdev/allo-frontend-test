<template>
  <v-alert
    type="error"
    variant="tonal"
    class="my-4"
    prominent
  >
    <div class="d-flex flex-column flex-sm-row align-sm-center ga-3">
      <div class="flex-grow-1">
        <div class="text-subtitle-1 font-weight-medium">Something went wrong</div>
        <div class="text-body-2">{{ message }}</div>
      </div>
      <v-btn
        color="error"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();

defineEmits<{
  retry: [];
}>();
</script>
