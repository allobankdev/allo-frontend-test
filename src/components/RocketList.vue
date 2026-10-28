<template>
  <!-- Loading Skeleton -->
  <v-row v-if="loading">
    <v-col
      v-for="n in 6"
      :key="n"
      cols="12"
      sm="6"
      md="4"
    >
      <v-skeleton-loader
        type="image, article"
        rounded="lg"
      />
    </v-col>
  </v-row>

  <!-- Error State -->
  <v-row v-else-if="error" justify="center">
    <v-col cols="12" sm="8" md="6" class="text-center">
      <v-icon icon="mdi-alert-circle-outline" size="80" color="error" class="mb-4" />
      <h2 class="text-h6 mb-2">Something went wrong</h2>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </v-col>
  </v-row>

  <!-- Empty State -->
  <v-row v-else-if="rockets.length === 0" justify="center">
    <v-col cols="12" sm="8" md="6" class="text-center">
      <v-icon icon="mdi-rocket-outline" size="80" color="grey" class="mb-4" />
      <h2 class="text-h6 mb-2">No rockets found</h2>
      <p class="text-body-2 text-medium-emphasis">Try adjusting the search or filter.</p>
    </v-col>
  </v-row>

  <!-- Success State -->
  <v-row v-else>
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      cols="12"
      sm="6"
      md="4"
    >
      <RocketCard
        :rocket="rocket"
        @click="$emit('select', rocket)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import RocketCard from './RocketCard.vue'

defineProps<{
  rockets: Rocket[]
  loading: boolean
  error: string | null
}>()

defineEmits<{
  retry: []
  select: [rocket: Rocket]
}>()
</script>

