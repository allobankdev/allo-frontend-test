<template>
  <v-row justify="center" class="mt-4">
    <v-col cols="12">
      <v-alert type="error" prominent variant="tonal" border="start" class="rounded-lg">
        <v-alert-title class="text-h6 mb-2">
          {{ title }}
        </v-alert-title>

        <div class="text-body-1 mb-4">
          {{ message }}
        </div>

        <v-btn color="error" variant="elevated" prepend-icon="mdi-refresh" @click="handleRetry">
          Retry
        </v-btn>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  title?: string;
  message?: string;
}

const router = useRouter();

const handleRetry = () => {
  router.go(0);
};

withDefaults(defineProps<Props>(), {
  title: 'Error',
  message: 'An error occurred',
});
</script>

<style scoped></style>
