<template>
  <v-card
    variant="flat"
    color="surface-variant"
    class="pa-8 rounded-xl text-center mx-auto my-8"
    max-width="500"
  >
    <v-icon
      icon="mdi-rocket-outline"
      size="56"
      color="medium-emphasis"
      class="mb-3"
    />
    <h3 class="text-h6 font-weight-bold mb-2">
      {{ title }}
    </h3>
    <p class="text-body-2 text-medium-emphasis mb-4">
      {{ message }}
    </p>
    <slot>
      <v-btn
        v-if="showReset"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-filter-off-outline"
        @click="$emit('reset')"
      >
        Clear Filters
      </v-btn>
    </slot>
  </v-card>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    message?: string
    showReset?: boolean
  }>(),
  {
    title: 'No Rockets Found',
    message: 'Try adjusting your search query or active filter to find rockets.',
    showReset: true,
  }
)

defineEmits<{
  (e: 'reset'): void
}>()
</script>
