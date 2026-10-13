<!--
  LoadingState.vue
  Generic loading indicator with a configurable message.
-->
<template>
  <div class="loading-state d-flex flex-column align-center justify-center py-16" role="status">
    <v-progress-circular indeterminate color="primary" size="56" />
    <p class="text-body-1 text-grey mt-6">{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Loading...',
  }
)
</script>
