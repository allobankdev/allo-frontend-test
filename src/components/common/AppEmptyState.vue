<template>
  <div class="d-flex flex-column align-center justify-center text-center py-16">
    <v-icon
      :icon="icon"
      size="64"
      class="mb-4"
      color="grey"
    />

    <h2 class="text-h6 mb-2">
      {{ title }}
    </h2>

    <p
      v-if="message"
      class="text-body-2 text-medium-emphasis"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    message?: string;
    icon?: string;
  }>(),
  {
    icon: "mdi-information-outline",
  },
);
</script>
