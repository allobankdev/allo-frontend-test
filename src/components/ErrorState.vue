<template>
  <v-container class="text-center pa-8">
    <v-card
      variant="outlined"
      class="pa-8"
    >
      <v-icon
        size="80"
        color="error"
        class="mb-4"
      >
        mdi-alert-circle-outline
      </v-icon>

      <h2 class="text-h5 mb-2">
        Oops! Something went wrong
      </h2>

      <v-alert
        type="error"
        variant="tonal"
        class="mb-4 text-left"
      >
        {{ message }}
      </v-alert>

      <p class="text-body-1 text-grey mb-4">
        We couldn't load the rockets. Please try again.
      </p>

      <v-btn
        color="primary"
        size="large"
        @click="$emit('retry')"
      >
        <v-icon start>
          mdi-refresh
        </v-icon>
        Retry
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits(['retry'])
</script>
