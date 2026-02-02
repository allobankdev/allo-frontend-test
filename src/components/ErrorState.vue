<template>
  <div class="error-state">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-icon size="100" color="error" class="mb-4">
            mdi-alert-circle-outline
          </v-icon>

          <h2 class="text-h4 mb-2">Oops! Something went wrong</h2>

          <p class="text-body-1 text-grey mb-6">
            {{
              message ||
              "An error occurred while fetching data. Please try again."
            }}
          </p>

          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-refresh"
            @click="handleRetry"
          >
            Retry
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

interface Emits {
  (e: "retry"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleRetry = () => {
  emit("retry");
};
</script>

<style scoped>
.error-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
