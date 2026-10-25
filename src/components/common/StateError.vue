<template>
  <v-card
    variant="tonal"
    color="error"
    rounded="lg"
    class="pa-6 text-center my-6 mx-auto"
    max-width="600"
    role="alert"
  >
    <v-avatar
      color="error"
      variant="flat"
      size="56"
      class="mb-4"
    >
      <v-icon
        icon="mdi-alert-circle-outline"
        color="white"
        size="32"
      />
    </v-avatar>

    <h2 class="text-h6 font-weight-bold text-error mb-2">
      {{ title }}
    </h2>

    <p class="text-body-1 text-medium-emphasis mb-6">
      {{ message || 'An unexpected error occurred while communicating with the rocket API.' }}
    </p>

    <v-btn
      color="error"
      variant="elevated"
      prepend-icon="mdi-reload"
      size="large"
      class="text-none font-weight-bold px-6"
      @click="$emit('retry')"
    >
      Retry Request
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string | null
}

withDefaults(defineProps<Props>(), {
  title: 'Failed to Load Data',
  message: null,
})

defineEmits<{
  retry: []
}>()
</script>
