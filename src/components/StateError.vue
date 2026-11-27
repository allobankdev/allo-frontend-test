<template>
  <v-card
    class="mx-auto my-8 pa-6 text-center"
    max-width="480"
    variant="outlined"
  >
    <v-icon
      class="mb-3"
      color="error"
      icon="mdi-alert-circle-outline"
      size="48"
    />
    <h3 class="text-h6 font-weight-bold mb-2">
      {{ title }}
    </h3>
    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      variant="flat"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </v-card>
</template>

<script lang="ts" setup>
  interface Props {
    title?: string
    message: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Something went wrong',
  })

  defineEmits<{
    retry: []
  }>()
</script>