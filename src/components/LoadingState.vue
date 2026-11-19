<template>
  <div class="py-12 text-center">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
      width="6"
      class="mb-4"
    />
    <h3 class="text-h6 font-weight-medium text-medium-emphasis">
      {{ message || 'Loading SpaceX rocket fleet data...' }}
    </h3>
    <p class="text-caption text-disabled">
      Fetching from Launch Library 2
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
