<template>
  <v-card
    color="error"
    variant="tonal"
    class="pa-6 rounded-xl mx-auto my-6 text-center"
    max-width="600"
    elevation="0"
    border
  >
    <v-icon
      icon="mdi-alert-circle-outline"
      size="48"
      color="error"
      class="mb-3"
    />
    <h3 class="text-h6 font-weight-bold mb-2">
      {{ title }}
    </h3>
    <p class="text-body-2 text-medium-emphasis mb-5">
      {{ message }}
    </p>
    <div class="d-flex justify-center ga-3">
      <v-btn
        color="error"
        variant="elevated"
        prepend-icon="mdi-reload"
        :loading="loading"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
      <slot name="extra-actions" />
    </div>
  </v-card>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    message: string
    loading?: boolean
  }>(),
  {
    title: 'Unable to Load Rocket Data',
    loading: false,
  }
)

defineEmits<{
  (e: 'retry'): void
}>()
</script>
