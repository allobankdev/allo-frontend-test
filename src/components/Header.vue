<template>
  <v-card
    variant="tonal"
    class="mb-4 pa-4 d-flex justify-space-between align-center"
  >
    <h3>{{ title }}</h3>
    <slot />
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>
