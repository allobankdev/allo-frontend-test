<template>
  <v-alert
    type="error"
    variant="tonal"
  >
    <div class="d-flex align-center justify-space-between flex-wrap ga-4">
      <span>
        {{ message }}
      </span>

      <v-btn
        v-if="retryable"
        variant="outlined"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string;
    retryable?: boolean;
  }>(),
  {
    retryable: true,
  },
);

const emit = defineEmits<{
  retry: [];
}>();
</script>
