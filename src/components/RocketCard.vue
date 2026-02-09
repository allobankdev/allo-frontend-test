<template>
  <v-card
    class="rocket-card"
    elevation="2"
    hover
    @click="navigateToDetail"
  >
    <v-img
      :src="rocket.flickr_images[0] || 'https://via.placeholder.com/400x300?text=No+Image'"
      height="250"
      cover
      class="rocket-image"
    >
      <div class="card-overlay">
        <v-chip
          v-if="rocket.active"
          color="success"
          size="small"
          class="ma-2"
        >
          Active
        </v-chip>
        <v-chip
          v-else
          color="error"
          size="small"
          class="ma-2"
        >
          Inactive
        </v-chip>
      </div>
    </v-img>

    <v-card-title class="text-h6">
      {{ rocket.name }}
    </v-card-title>

    <v-card-subtitle class="pb-2">
      <v-icon size="small" start>mdi-earth</v-icon>
      {{ rocket.country }}
    </v-card-subtitle>

    <v-card-text>
      <p class="rocket-description">
        {{ truncatedDescription }}
      </p>

      <v-divider class="my-3" />

      <div class="d-flex justify-space-between align-center">
        <div>
          <v-icon size="small" color="primary">mdi-currency-usd</v-icon>
          <span class="text-caption ml-1">
            {{ formatCost(rocket.cost_per_launch) }}
          </span>
        </div>
        <div>
          <v-icon size="small" color="primary">mdi-calendar</v-icon>
          <span class="text-caption ml-1">
            {{ formatDate(rocket.first_flight) }}
          </span>
        </div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        block
        @click="navigateToDetail"
      >
        View Details
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

const truncatedDescription = computed(() => {
  const maxLength = 150
  if (props.rocket.description.length > maxLength) {
    return props.rocket.description.substring(0, maxLength) + '...'
  }
  return props.rocket.description
})

function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(cost)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function navigateToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-image {
  position: relative;
}

.card-overlay {
  position: absolute;
  top: 0;
  right: 0;
}

.rocket-description {
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  min-height: 72px;
}
</style>
