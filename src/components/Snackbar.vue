<script setup lang="ts">
import { ref, watch } from 'vue';

const snackbar = ref(false);
const timeout = ref(2000);

const emit = defineEmits<{
  (e: 'retry'): void;
}>();

const props = defineProps<{
  snackbarData?: {
    message?: string;
    showSnackbar?: boolean;
    status?: number;
  };
}>();

// Update snackbar state when props change
watch(
  () => props.snackbarData?.showSnackbar,
  (val) => {
    snackbar.value = val ?? false;
  },
  { immediate: true }
);
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    location="bottom left"
    :color="props.snackbarData?.status === 400 ? 'red-darken-1' : 'green-darken-1'"
  >
    {{ props.snackbarData?.message }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="emit('retry')">
        Retry
      </v-btn>
    </template>
  </v-snackbar>
</template>
