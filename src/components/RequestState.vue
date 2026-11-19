<template>
  <div>
    <div
      v-if="status === 'loading' || status === 'idle'"
      class="text-center py-12"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="48"
      />
      <p class="mt-4 text-medium-emphasis">
        {{ loadingMessage }}
      </p>
    </div>

    <div
      v-else-if="status === 'error'"
      class="text-center py-12"
    >
      <v-icon
        class="mb-3"
        color="error"
        size="48"
      >
        mdi-alert-circle-outline
      </v-icon>
      <p class="text-body-1 mb-4">
        {{ errorMessage || "Something went wrong" }}
      </p>
      <v-btn
        v-if="showRetry"
        color="primary"
        prepend-icon="mdi-refresh"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>

    <div
      v-else-if="isEmpty"
      class="text-center py-12"
    >
      <v-icon
        class="mb-3"
        size="48"
      >
        mdi-rocket-outline
      </v-icon>
      <p class="text-body-1 text-medium-emphasis">
        {{ emptyMessage }}
      </p>
    </div>

    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
  import type { RequestStatus } from "@/types";

  withDefaults(
    defineProps<{
      status: RequestStatus;
      errorMessage?: string | null;
      isEmpty?: boolean;
      loadingMessage?: string;
      emptyMessage?: string;
      showRetry?: boolean;
    }>(),
    {
      errorMessage: null,
      isEmpty: false,
      loadingMessage: "Loading rockets...",
      emptyMessage: "No rockets found",
      showRetry: true,
    },
  );

  const emit = defineEmits<{
    retry: [];
  }>();
</script>
