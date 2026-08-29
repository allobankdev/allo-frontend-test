<template>
  <v-card class="pa-6 text-center">
    <v-icon size="48" color="error">mdi-alert-circle</v-icon>

    <h3 class="mt-3">Something went wrong</h3>
    <p>{{ message }}</p>

    <v-btn color="primary" @click="emit('retry')"> Retry </v-btn>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits(["retry"]);
const props = defineProps<{ message: string }>();
</script>
