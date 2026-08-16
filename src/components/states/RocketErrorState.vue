<template>
  <v-alert
    type="error"
    variant="tonal"
    class="my-8"
  >
    <v-alert-title> Failed to load rockets </v-alert-title>

    <p class="mt-2">
      {{ message }}
    </p>

    <v-btn
      class="mt-4"
      variant="outlined"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
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
