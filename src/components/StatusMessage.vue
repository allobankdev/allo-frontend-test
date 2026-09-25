<template>
  <div
    class="d-flex flex-column align-center justify-center text-center py-16 px-4"
    :role="role"
  >
    <v-avatar
      :color="color"
      size="72"
      variant="tonal"
    >
      <v-icon
        :icon="icon"
        size="36"
      />
    </v-avatar>
    <component
      :is="headingTag"
      class="text-h6 font-weight-bold mt-5"
    >
      {{ title }}
    </component>
    <p class="text-body-2 text-medium-emphasis mt-2 mb-6 message">
      {{ message }}
    </p>
    <div class="d-flex flex-wrap ga-3 justify-center">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    icon: string
    title: string
    message: string
    color?: string
    headingTag?: 'h1' | 'h2'
    role?: 'alert' | 'status'
  }>(), {
    color: 'primary',
    headingTag: 'h2',
    role: 'status',
  })
</script>

<style scoped>
.message {
  max-width: 420px;
}
</style>
