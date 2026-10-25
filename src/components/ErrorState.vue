<template>
  <v-alert
    class="my-8"
    type="error"
    variant="tonal"
  >
    <div class="d-flex flex-column flex-sm-row align-sm-center ga-4">
      <div class="flex-grow-1">
        <div class="font-weight-bold">
          Failed to load rockets
        </div>

        <div class="text-body-2 mt-1">
          {{ message }}
        </div>
      </div>

      <v-btn
        color="error"
        variant="flat"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>