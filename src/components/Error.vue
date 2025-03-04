<script setup lang="ts">
defineProps<{
  error: string
}>()
defineEmits<{ (event: "retry"): void }>();
</script>

<template>
  <div
    class="d-flex flex-column text-center pa-10 ga-4"
  >
    <h3>{{ error || "Something went wrong" }}</h3>
    <v-btn
      class="mx-auto"
      icon="mdi-cached"
      @click="$emit('retry')"
    />
  </div>
</template>
