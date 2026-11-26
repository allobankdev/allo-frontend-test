<template>
  <div class="state">
    <v-icon
      color="medium-emphasis"
      :icon="icon"
      size="56"
    />
    <h2 class="text-h6 mt-4">
      {{ title }}
    </h2>
    <p
      v-if="message"
      class="text-medium-emphasis mt-2"
    >
      {{ message }}
    </p>
    <div
      v-if="$slots.actions"
      class="mt-6"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title: string
    message?: string | null
    icon?: string
  }>(), {
    message: null,
    icon: 'mdi-magnify-remove-outline',
  })
</script>

<style scoped>
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 16px;
    text-align: center;
  }
</style>
