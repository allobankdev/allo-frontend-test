<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-icon color="error" icon="mdi-alert-circle-outline" size="48" />
    <p class="mt-4 text-body-2 text-medium-emphasis">
      {{ message }}
    </p>
    <v-btn class="mt-2" color="primary" variant="tonal" @click="emit('retry')">
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