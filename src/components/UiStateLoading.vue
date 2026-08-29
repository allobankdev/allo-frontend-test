<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
      width="4"
    />
    <p class="text-body-1 mt-4 text-medium-emphasis">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{ message?: string }>(),
  { message: 'Loading...' }
)
</script>
