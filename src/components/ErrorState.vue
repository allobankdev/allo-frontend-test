<script setup lang="ts">
defineEmits<{
  (e: "retry"): void;
}>();
</script>

<template>
  <div class="error-state">
    <h3>Something went wrong</h3>
    <p>Failed to load rocket data. Please try again.</p>

    <v-btn class="retry-btn" @click="$emit('retry')">Retry</v-btn>
  </div>
</template>
