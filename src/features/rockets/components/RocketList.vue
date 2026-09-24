<template>
  <div>
    <!-- Error State Alert with Retry Button -->
    <v-row v-if="error">
      <v-col cols="12">
        <v-alert
          type="error"
          title="Failed to load rockets"
          :text="error"
          variant="tonal"
        >
          <template #append>
            <v-btn
              color="error"
              variant="flat"
              size="small"
              prepend-icon="mdi-reload"
              @click="$emit('retry')"
            >
              Retry
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Loading State Skeleton -->
    <v-row v-if="loading">
      <v-col
        v-for="n in 10"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          type="card, article, actions"
          elevation="1"
        />
      </v-col>
    </v-row>

    <!-- Rocket Grid -->
    <v-row v-else-if="rockets.length > 0">
      <v-col
        v-for="rocket in rockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col
        cols="12"
        class="text-center py-12"
      >
        <v-icon
          icon="mdi-rocket-off"
          size="64"
          class="text-grey mb-2"
        />
        <p class="text-h6 text-grey">
          No rockets found.
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Rocket } from '../rocket.types';
import RocketCard from './RocketCard.vue';

defineProps<{
  rockets: Rocket[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
