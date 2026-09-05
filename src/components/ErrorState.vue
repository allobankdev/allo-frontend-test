<template>
  <div class="py-8">
    <v-alert
      type="error"
      variant="tonal"
    >
      {{ message }}
    </v-alert>

    <v-btn
      class="mt-4"
      color="primary"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    message: string
  }>()

  defineEmits<{
    retry: []
  }>()
</script>