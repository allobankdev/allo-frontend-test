<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-icon size="80" color="error" class="mb-4">
          mdi-alert-circle-outline
        </v-icon>
        <h2 class="text-h5 mb-4">Oops! Something went wrong</h2>
        <p class="text-body-1 mb-6">{{ message }}</p>
        <v-btn
          color="primary"
          size="large"
          @click="$emit('retry')"
        >
          <v-icon start>mdi-refresh</v-icon>
          Retry
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Failed to load data. Please try again.',
  }
)

defineEmits<{
  retry: []
}>()
</script>
