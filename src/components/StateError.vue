<template>
  <v-sheet
    class="d-flex flex-column align-center justify-center py-12 text-center"
    rounded
  >
    <v-icon
      color="error"
      size="48"
    >
      mdi-alert-circle-outline
    </v-icon>
    <p class="mt-4 text-h6">
      {{ title }}
    </p>
    <p class="text-body-2 text-medium-emphasis">
      {{ message }}
    </p>
    <v-btn
      class="mt-4"
      color="primary"
      prepend-icon="mdi-refresh"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </v-sheet>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ title?: string, message?: string }>(), {
  title: 'Failed to load rockets',
  message: 'Something went wrong while fetching data. Please try again.',
})

const emit = defineEmits<{ retry: [] }>()
</script>
