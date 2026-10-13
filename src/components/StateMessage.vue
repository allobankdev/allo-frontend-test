<template>
  <section
    class="state-message"
    :aria-live="loading ? 'polite' : 'assertive'"
  >
    <span
      v-if="loading"
      class="loader"
      aria-hidden="true"
    />
    <span
      v-else
      class="state-icon"
      aria-hidden="true"
    >↻</span>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button
      v-if="!loading"
      class="action-button"
      type="button"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  title: string
  message: string
}>()

defineEmits<{ retry: [] }>()
</script>
