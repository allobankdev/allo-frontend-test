<template>
  <div
    class="text-center py-16"
    role="status"
  >
    <v-progress-circular
      v-if="loading"
      color="primary"
      indeterminate
      size="56"
    />
    <template v-else>
      <v-icon
        color="error"
        icon="mdi-alert-circle-outline"
        size="56"
      />
      <p class="my-4">
        {{ error }}
      </p>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{ loading: boolean, error?: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>
