<script setup lang="ts">
  defineProps<{ loading: boolean, error: string, errorTitle: string }>()

  const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <v-progress-linear
    v-if="loading"
    indeterminate
    color="primary"
    class="mb-4"
  />

  <v-alert
    v-else-if="error"
    type="error"
    :title="errorTitle"
    class="mb-4"
  >
    {{ error }}
    <template #append>
      <v-btn
        variant="text"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </v-alert>

  <slot v-else />
</template>
