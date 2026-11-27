<template>
  <v-sheet
    border
    class="pa-8 text-center mx-auto my-8"
    max-width="480"
    rounded="lg"
  >
    <v-icon
      color="error"
      icon="mdi-alert-circle-outline"
      size="56"
    />
    <h2 class="text-h6 mt-4 mb-2">
      {{ title }}
    </h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message || 'Something went wrong while fetching data.' }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      variant="flat"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </v-sheet>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title?: string
    message?: string | null
  }>(), {
    title: 'Failed to load data',
    message: null,
  })

  defineEmits<{
    retry: []
  }>()
</script>