<template>
  <div
    v-if="status === 'loading'"
    aria-live="polite"
    class="text-center py-12"
    role="status"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="48"
    />
    <p class="mt-4 text-medium-emphasis">
      Loading…
    </p>
  </div>

  <v-alert
    v-else-if="status === 'failed'"
    class="my-6"
    type="error"
    variant="tonal"
  >
    {{ message ?? 'Something went wrong.' }}
    <template #append>
      <v-btn
        variant="outlined"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </v-alert>

  <p
    v-else
    class="text-center text-medium-emphasis py-12"
  >
    {{ message ?? 'Nothing to show.' }}
  </p>
</template>

<script lang="ts" setup>
  defineProps<{
    status: 'loading' | 'failed' | 'empty'
    message?: string | null
  }>()

  const emit = defineEmits<{ retry: [] }>()
</script>
