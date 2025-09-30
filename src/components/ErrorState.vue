<template>
  <v-container class="d-flex flex-column align-center justify-center py-10 text-center">
    <v-icon
      color="error"
      size="48"
    >
      mdi-alert-circle
    </v-icon>
    <p class="mt-4">
      {{ props.message || "Something went wrong." }}
    </p>
    <v-btn
      color="primary"
      class="mt-2"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  message?: string | null;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
}>();
</script>