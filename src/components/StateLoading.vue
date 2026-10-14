<template>
  <v-sheet
    class="d-flex flex-column align-center justify-center py-12"
    rounded
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="48"
    />
    <p class="mt-4 text-body-1">
      {{ message }}
    </p>
  </v-sheet>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ message?: string }>(), {
  message: 'Loading rockets…',
})
</script>
