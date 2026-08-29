<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  title?: string
  message?: string
  button?: boolean
}>()

const router = useRouter();

function goToLandingPage() {
  router.push('/');
}
</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center py-10 text-center">
    <!-- Error Icon -->
    <v-icon
      color="error"
      size="64"
      class="mb-4"
    >
      mdi-alert-circle-outline
    </v-icon>

    <!-- Title -->
    <h3 class="text-h6 font-weight-bold">
      {{ title || 'Error Occurred' }}
    </h3>

    <!-- Message -->
    <p class="mt-2 text-body-2 text-grey">
      {{ message || 'Something went wrong. Please try again later.' }}
    </p>

    <!-- Optional Retry Button -->
    <v-btn
      v-if="button"
      color="error"
      class="mt-4"
      @click="goToLandingPage"
    >
      Back
    </v-btn>
  </v-container>
</template>
