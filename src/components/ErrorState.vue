<template>
  <div class="d-flex justify-center pa-4">
    <v-alert
      class="state"
      :title="title"
      type="error"
      variant="tonal"
    >
      <p>{{ message }}</p>

      <v-btn
        v-if="retryable"
        class="mt-4"
        color="error"
        prepend-icon="mdi-refresh"
        variant="flat"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    message: string
    title?: string
    retryable?: boolean
  }>(), {
    title: 'Something went wrong',
    retryable: true,
  })

  const emit = defineEmits<{
    retry: []
  }>()
</script>

<style scoped>
.state {
  max-width: 560px;
  width: 100%;
}
</style>
