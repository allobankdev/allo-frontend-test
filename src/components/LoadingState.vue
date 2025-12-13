<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <v-progress-circular indeterminate color="primary" :size="size"></v-progress-circular>
      <p class="mt-4">{{ message }}</p>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  size?: number | string;
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  size: 64,
});
</script>

<style scoped></style>
