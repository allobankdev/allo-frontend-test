<template>
  <div class="d-flex flex-column align-center justify-center pa-12">
    <v-progress-circular
      indeterminate
      size="48"
      color="primary"
    />
    <p class="mt-4 text-medium-emphasis">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: "Loading rockets...",
});
</script>
