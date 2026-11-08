<script setup lang="ts">
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import EmptyState from '@/components/state/EmptyState.vue'

useDocumentTitle('Page not found')
</script>

<template>
  <div class="py-10">
    <EmptyState
      icon="mdi-map-marker-question-outline"
      title="Page not found"
      message="The page you're looking for drifted out of orbit."
    >
      <v-btn
        color="primary"
        prepend-icon="mdi-home-outline"
        to="/"
        variant="flat"
      >
        Back to rockets
      </v-btn>
    </EmptyState>
  </div>
</template>
