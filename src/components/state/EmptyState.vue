<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  message?: string
  icon?: string
}>(), {
  message: undefined,
  icon: 'mdi-telescope',
})
</script>

<template>
  <v-sheet
    class="state-panel d-flex flex-column align-center text-center mx-auto pa-8"
    color="surface"
    rounded="lg"
    border
  >
    <v-avatar
      color="primary"
      size="64"
      variant="tonal"
    >
      <v-icon
        :icon="icon"
        size="32"
      />
    </v-avatar>
    <h2 class="text-h6 mt-4">
      {{ title }}
    </h2>
    <p
      v-if="message"
      class="text-body-2 text-medium-emphasis mt-2"
    >
      {{ message }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-6"
    >
      <slot />
    </div>
  </v-sheet>
</template>

<style scoped>
.state-panel {
  max-width: 480px;
}
</style>
