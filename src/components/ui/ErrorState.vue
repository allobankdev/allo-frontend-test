<script setup lang="ts">
defineProps<{ onRetry?: () => void }>()
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" md="6" class="text-center">
      <v-alert type="error" variant="tonal">
        Failed to load rocket data
      </v-alert>

      <v-btn
        v-if="onRetry"
        class="mt-4"
        color="primary"
        @click="onRetry"
      >
        Retry
      </v-btn>
    </v-col>
  </v-row>
</template>
