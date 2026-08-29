<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        class="text-center"
      >
        <v-icon
          size="80"
          color="error"
          class="mb-4"
        >
          mdi-alert-circle-outline
        </v-icon>
        <h2 class="text-h5 mb-2">
          {{ title }}
        </h2>
        <p class="text-body-1 text-medium-emphasis mb-6">
          {{ message }}
        </p>
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-refresh"
          size="large"
          @click="$emit('retry')"
        >
          Retry
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: 'Something went wrong',
  message: 'An error occurred while loading the data. Please try again.',
})

defineEmits<{
  (e: 'retry'): void
}>()
</script>
