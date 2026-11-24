<template>
  <v-alert
    type="error"
    variant="tonal"
    title="Something went wrong"
    :text="message"
  >
    <template #append>
      <v-btn
        variant="outlined"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </v-alert>
</template>

<script lang="ts" setup>
  defineProps<{ message: string }>()
  const emit = defineEmits<{ retry: [] }>()
</script>