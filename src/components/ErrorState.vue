<template>
  <v-alert
    type="error"
    variant="tonal"
    title="Couldn't load rockets"
    :text="message"
    class="my-8"
  >
    <template #append>
      <v-btn
        color="error"
        variant="flat"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </template>
  </v-alert>
</template>

<script lang="ts" setup>
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>
