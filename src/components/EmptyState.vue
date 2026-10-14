<template>
  <div class="state d-flex flex-column align-center justify-center text-center pa-8">
    <v-icon
      class="mb-4"
      icon="mdi-rocket-outline"
      size="56"
    />
    <h2 class="text-h6">
      {{ title }}
    </h2>
    <p
      v-if="message"
      class="text-body-2 text-medium-emphasis mt-1"
    >
      {{ message }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-4"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title: string
    message?: string
  }>(), {
    message: '',
  })
</script>

<style scoped>
.state {
  min-height: 240px;
}
</style>
