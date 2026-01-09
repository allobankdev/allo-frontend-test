<template>
  <v-alert type="error" variant="tonal" class="my-4">
    <div class="d-flex align-center justify-space-between flex-wrap ga-3">
      <div>
        <div class="text-subtitle-2">Something went wrong</div>
        <div class="text-body-2">
          {{ message || "Failed to load data." }}
        </div>
      </div>

      <v-btn color="error" variant="flat" @click="$emit('retry')">
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UiErrorRetry",
  props: {
    message: {
      type: String,
      default: null,
    },
  },
  emits: ["retry"],
});
</script>
