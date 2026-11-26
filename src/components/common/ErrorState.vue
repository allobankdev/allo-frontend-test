<template>
  <div
    class="state"
    role="alert"
  >
    <v-icon
      :color="iconColor"
      :icon="icon"
      size="56"
    />
    <h2 class="text-h6 mt-4">
      {{ title }}
    </h2>
    <p
      v-if="message"
      class="text-medium-emphasis mt-2"
    >
      {{ message }}
    </p>

    <div class="d-flex flex-wrap justify-center ga-3 mt-6">
      <v-btn
        v-if="retryable"
        color="primary"
        prepend-icon="mdi-refresh"
        variant="flat"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title?: string
    message?: string | null
    icon?: string
    iconColor?: string
    retryable?: boolean
  }>(), {
    title: 'Something went wrong',
    message: null,
    icon: 'mdi-alert-circle-outline',
    iconColor: 'error',
    retryable: true,
  })

  const emit = defineEmits<{
    retry: []
  }>()
</script>

<style scoped>
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 16px;
    text-align: center;
  }
</style>
