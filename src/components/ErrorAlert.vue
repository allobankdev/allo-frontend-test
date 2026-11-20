<template>
  <v-alert
    type="error"
    variant="tonal"
    rounded="xl"
    class="error-alert"
  >
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
      <div>
        <div class="text-subtitle-1 font-weight-bold">
          {{ title }}
        </div>
        <div
          v-if="message"
          class="text-body-2 mt-1"
        >
          {{ message }}
        </div>
      </div>

      <v-btn
        color="error"
        variant="flat"
        rounded="lg"
        prepend-icon="mdi-refresh"
        class="text-none align-self-start align-self-sm-center"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string | null
}>()

defineEmits<{
  retry: []
}>()
</script>
