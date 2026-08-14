<template>
  <v-container class="py-12 text-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    />
    <p class="text-body-1 mt-4">
      {{ message }}
    </p>
  </v-container>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    message?: string
  }>(), {
    message: 'Loading rockets...',
  })
</script>
