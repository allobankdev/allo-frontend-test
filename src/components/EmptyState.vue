<template>
  <v-card class="pa-8 text-center my-6" elevation="1" rounded="lg">
    <v-icon icon="mdi-magnify-remove-outline" size="64" color="medium-emphasis" class="mb-4" />
    <h2 class="text-h6 font-weight-bold mb-2">No Rockets Found</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message || 'No rocket configurations match your current search or filter criteria.' }}
    </p>
    <v-btn
      variant="tonal"
      color="primary"
      prepend-icon="mdi-filter-off"
      @click="$emit('clear')"
    >
      Clear Filters
    </v-btn>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  message?: string;
}>();

defineEmits<{
  (e: 'clear'): void;
}>();
</script>
