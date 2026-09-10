<template>
  <div class="d-flex flex-column align-center justify-center py-16 text-center">
    <v-icon
      color="error"
      icon="mdi-alert-circle-outline"
      size="48"
    />
    <h2 class="text-h6 mt-4">
      {{ title }}
    </h2>
    <p class="text-body-2 mt-2 mb-6 text-medium-emphasis state-error__message">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      variant="flat"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{ title?: string, message: string }>(), {
    title: 'Something went wrong',
  })

  const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
  .state-error__message {
    max-width: 32rem;
  }
</style>
