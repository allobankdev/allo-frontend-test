<template>
  <v-container class="py-12 text-center">
    <v-icon
      color="error"
      icon="mdi-alert-circle-outline"
      size="64"
    />
    <p class="text-h6 mt-4">
      Failed to load rockets
    </p>
    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
  defineProps<{
    message: string
  }>()

  defineEmits<{
    retry: []
  }>()
</script>
