<template>
  <div
    v-if="loading"
    class="d-flex justify-center my-10"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
  </div>

  <v-alert
    v-else-if="error"
    type="error"
    variant="tonal"
    class="my-4"
  >
    {{ error }}
    <template #append>
      <v-btn
        color="error"
        variant="text"
        @click="emit('retry')"
      >
        Coba Lagi
      </v-btn>
    </template>
  </v-alert>

  <slot v-else />
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>
