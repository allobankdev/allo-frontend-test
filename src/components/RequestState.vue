<template>
  <div>
    <div
      v-if="status === 'loading' || status === 'idle'"
      class="request-state text-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="48"
        width="3"
      />
      <p class="mt-4 text-body-1 text-medium-emphasis mb-0">
        {{ loadingMessage }}
      </p>
    </div>

    <div
      v-else-if="status === 'error'"
      class="request-state text-center"
    >
      <v-avatar
        class="mb-4"
        color="error"
        size="64"
        variant="tonal"
      >
        <v-icon size="32">
          mdi-alert-circle-outline
        </v-icon>
      </v-avatar>
      <h2 class="text-h6 font-weight-bold mb-2">
        {{ errorMessage || "Something went wrong" }}
      </h2>
      <p
        v-if="showRetry"
        class="text-body-2 text-medium-emphasis mb-6"
      >
        Check your connection, then try again.
      </p>
      <p
        v-else
        class="text-body-2 text-medium-emphasis mb-6"
      >
        Use Back to list to continue browsing.
      </p>
      <v-btn
        v-if="showRetry"
        color="primary"
        prepend-icon="mdi-refresh"
        size="large"
        variant="flat"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>

    <div
      v-else-if="isEmpty"
      class="request-state text-center"
    >
      <v-avatar
        class="mb-4"
        color="primary"
        size="64"
        variant="tonal"
      >
        <v-icon size="32">
          mdi-rocket-outline
        </v-icon>
      </v-avatar>
      <h2 class="text-h6 font-weight-bold mb-2">
        {{ emptyMessage }}
      </h2>
      <p
        v-if="emptyHint"
        class="text-body-2 text-medium-emphasis mb-0"
      >
        {{ emptyHint }}
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
      emptyHint?: string;
      showRetry?: boolean;
    }>(),
    {
      errorMessage: null,
      isEmpty: false,
      loadingMessage: "Loading rockets...",
      emptyMessage: "No rockets found",
      emptyHint: "Try a different filter or add a local rocket.",
      showRetry: true,
    },
  );

  const emit = defineEmits<{
    retry: [];
  }>();
</script>

<style scoped>
  .request-state {
    padding: 4rem 1rem;
  }
</style>
