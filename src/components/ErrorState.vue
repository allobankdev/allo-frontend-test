<template>
  <v-alert
    class="my-4"
    type="error"
    variant="tonal"
  >
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3">
      <span>{{ message }}</span>
      <v-btn
        color="error"
        variant="outlined"
        @click="emit('retry')"
      >
        Try again
      </v-btn>
    </div>
  </v-alert>
</template>

<script lang="ts" setup>
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>
