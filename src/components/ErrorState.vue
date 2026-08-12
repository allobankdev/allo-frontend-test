<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-icon color="error" icon="mdi-alert-circle-outline" size="40" />
    <p class="mt-4 text-body-2" style="color: var(--color-ink-soft);">
      {{ message }}
    </p>
    <v-btn class="mt-4" color="primary" rounded="0" variant="flat" @click="emit('retry')">
      Retry
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{ message?: string }>(), {
    message: 'Failed to load rockets.',
  })

  const emit = defineEmits<{ retry: [] }>()
</script>