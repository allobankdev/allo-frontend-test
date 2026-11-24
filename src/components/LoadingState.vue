<template>
  <div
    class="d-flex flex-column align-center justify-center py-12"
    role="status"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="48"
    />
    <p class="text-body-1 text-medium-emphasis mt-4">
      {{ label }}
    </p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'Loading...',
  },
)
</script>
