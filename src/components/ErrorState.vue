<template>
  <StatusMessage
    color="error"
    :icon="icon"
    :message="message"
    role="alert"
    :title="title"
  >
    <template #actions>
      <v-btn
        v-if="retryable"
        color="primary"
        prepend-icon="mdi-refresh"
        size="large"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
      <slot name="actions" />
    </template>
  </StatusMessage>
</template>

<script lang="ts" setup>
  import StatusMessage from './StatusMessage.vue'

  withDefaults(defineProps<{
    message: string
    title?: string
    icon?: string
    /** Hide the retry button when retrying cannot succeed (e.g. 404). */
    retryable?: boolean
  }>(), {
    title: 'Something went wrong',
    icon: 'mdi-alert-circle-outline',
    retryable: true,
  })

  const emit = defineEmits<{
    retry: []
  }>()
</script>
