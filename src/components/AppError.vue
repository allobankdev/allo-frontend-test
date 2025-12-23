<template>
  <v-sheet
    class="d-flex flex-column align-center justify-center pa-4 text-center mx-auto"
    color="transparent"
    height="100%"
  >
    <v-icon
      icon="mdi-alert-circle-outline"
      color="error"
      size="64"
      class="mb-4"
    ></v-icon>

    <div class="text-h6 font-weight-bold mb-2">Oops! Something went wrong.</div>

    <div class="text-body-1 text-medium-emphasis mb-6">
      {{ message }}
    </div>

    <v-btn
      color="primary"
      prepend-icon="mdi-reload"
      @click="$emit('retry')"
      elevation="2"
    >
      Type to Retry
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();

defineEmits(["retry"]);
</script>
