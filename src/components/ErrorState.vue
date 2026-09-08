<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <div class="text-center">
      <v-icon
        color="error"
        icon="mdi-alert-circle-outline"
        size="64"
      />
      <h3 class="text-h6 mt-4">
        Terjadi Kesalahan
      </h3>
      <p class="text-body-2 text-medium-emphasis mt-2 mb-6">
        {{ message }}
      </p>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        variant="elevated"
        @click="$emit('retry')"
      >
        Coba Lagi
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>
