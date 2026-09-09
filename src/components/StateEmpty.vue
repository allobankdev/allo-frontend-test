<template>
  <div class="d-flex flex-column align-center justify-center py-16 text-center">
    <v-icon
      color="medium-emphasis"
      :icon="icon"
      size="48"
    />
    <h2 class="text-h6 mt-4">
      {{ title }}
    </h2>
    <p
      v-if="message"
      class="text-body-2 mt-2 text-medium-emphasis"
    >
      {{ message }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{ title: string, message?: string, icon?: string }>(), {
    message: '',
    icon: 'mdi-rocket-launch-outline',
  })
</script>
