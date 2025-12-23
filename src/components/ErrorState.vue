<template>
  <div class="error-state">
    <v-icon
      size="48"
      color="error"
      class="mb-4"
    >
      mdi-alert-circle-outline
    </v-icon>
    <h3 class="text-h6 font-weight-medium mb-2">
      {{ title || 'Something went wrong' }}
    </h3>
    <p v-if="message" class="text-body-2 text-medium-emphasis mb-6">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      variant="flat"
      size="large"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  message?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 48px;
  text-align: center;
}
</style>

