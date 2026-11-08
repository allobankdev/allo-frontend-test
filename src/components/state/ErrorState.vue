<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message: string
  /** Disables the button while a retry is running. */
  retrying?: boolean
}>(), {
  title: 'Something went wrong',
  retrying: false,
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <v-sheet
    class="state-panel d-flex flex-column align-center text-center mx-auto pa-8"
    color="surface"
    rounded="lg"
    role="alert"
    border
  >
    <v-avatar
      color="error"
      size="64"
      variant="tonal"
    >
      <v-icon
        icon="mdi-cloud-alert-outline"
        size="32"
      />
    </v-avatar>
    <h2 class="text-h6 mt-4">
      {{ title }}
    </h2>
    <p class="text-body-2 text-medium-emphasis mt-2 mb-6">
      {{ message }}
    </p>
    <v-btn
      :loading="retrying"
      color="primary"
      prepend-icon="mdi-refresh"
      variant="flat"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </v-sheet>
</template>

<style scoped>
.state-panel {
  max-width: 480px;
}
</style>
