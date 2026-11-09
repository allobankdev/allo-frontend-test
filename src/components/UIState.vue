<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  type: 'loading' | 'error' | 'empty';
  message?: string;
  retryable?: boolean;
}>();

const emit = defineEmits(['retry']);
</script>

<template>
  <v-container class="text-center py-10">
    <v-progress-circular
      v-if="props.type === 'loading'"
      indeterminate
      color="primary"
      size="64"
    />

    <div v-else-if="props.type === 'error'">
      <v-icon
        color="error"
        size="48"
      >
        mdi-alert-circle-outline
      </v-icon>
      <p class="text-error text-h6">
        {{ props.message || 'An error occurred.' }}
      </p>
      <v-btn
        v-if="props.retryable"
        color="primary"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>

    <div v-else-if="props.type === 'empty'">
      <v-icon
        color="grey"
        size="48"
      >
        mdi-magnify
      </v-icon>
      <p class="text-grey text-h6">
        {{ props.message || 'No data found.' }}
      </p>
    </div>
  </v-container>
</template>
