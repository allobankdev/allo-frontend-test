<template>
  <div
    :aria-label="text"
    class="placeholder d-flex flex-column align-center justify-center text-medium-emphasis"
    role="img"
  >
    <v-avatar
      color="primary"
      size="56"
      variant="tonal"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="28"
      />
    </v-avatar>
    <span class="text-caption mt-3">{{ text }}</span>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    text: string
  }>()
</script>

<style scoped>
/* Fill the aspect-ratio box of the parent instead of stretching it. */
.placeholder {
  position: absolute;
  inset: 0;
}
</style>
