<!--
  ErrorState.vue
  Displayed when a data fetch fails. Shows the error message and a Retry button.
-->
<template>
  <div
    class="error-state d-flex flex-column align-center justify-center py-16"
    role="alert"
  >
    <v-icon size="56" color="error">mdi-alert-circle-outline</v-icon>
    <p class="text-h6 mt-4">{{ title }}</p>
    <p v-if="message" class="text-body-2 text-grey mt-1 text-center" style="max-width: 400px">
      {{ message }}
    </p>
    <v-btn
      class="mt-6"
      color="primary"
      variant="elevated"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Failed to load data.',
    message: undefined,
  }
)

defineEmits<{
  (e: 'retry'): void
}>()
</script>
