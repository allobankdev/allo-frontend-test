<template>
  <!-- Centered error layout -->
  <v-container class="d-flex flex-column align-center justify-center py-12">
    <v-icon color="error" size="80" class="mb-4">mdi-alert-circle-outline</v-icon>
    <h3 class="text-h5 font-weight-bold mb-2">Oops! Something went wrong</h3>
    <p class="text-body-1 text-grey-darken-1 mb-6 text-center" style="max-width: 400px;">
      {{ message }}
    </p>
    
    <!-- Emit retry event to parent -->
    <v-btn color="blue-darken-2" variant="flat" prepend-icon="mdi-refresh" size="large" @click="$emit('retry')">
      Try Again
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
// Receive error message from parent component
defineProps<{ message: string }>()

// Define custom events
defineEmits<{ (e: 'retry'): void }>()
</script>
