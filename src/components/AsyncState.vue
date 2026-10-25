<template>
  <div>
    <div
      v-if="status === 'idle' || status === 'loading'"
      class="d-flex justify-center align-center py-12"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="56"
      />
    </div>

    <div
      v-else-if="status === 'error'"
      class="d-flex flex-column align-center text-center py-12"
    >
      <v-icon
        class="mb-4"
        color="error"
        icon="mdi-alert-circle-outline"
        size="56"
      />
      <p class="text-body-1 mb-4">
        {{ error || 'Something went wrong while loading the data.' }}
      </p>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>

    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    status: 'idle' | 'loading' | 'success' | 'error'
    error?: string | null
  }

  defineProps<Props>()

  const emit = defineEmits<{ retry: [] }>()
</script>
