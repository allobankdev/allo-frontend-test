<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    hover
    rounded="lg"
    @click="navigateToDetail"
  >
    <!-- Rocket Image with Fallback -->
    <v-img
      :src="rocket.image_url || fallbackImage"
      cover
      height="220"
      class="bg-grey-darken-4 align-end"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="primary"
            indeterminate
            size="32"
          />
        </div>
      </template>
      <template #error>
        <div class="d-flex flex-column align-center justify-center fill-height bg-grey-darken-3 text-grey">
          <v-icon
            icon="mdi-rocket"
            size="48"
            class="mb-1"
          />
          <span class="text-caption">No Image Available</span>
        </div>
      </template>

      <!-- Gradient Overlay & Title -->
      <div class="image-gradient px-4 py-2">
        <div class="d-flex align-center justify-space-between">
          <span class="text-subtitle-1 font-weight-bold text-white text-truncate">
            {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
          </span>
          <v-chip
            v-if="rocket.is_custom"
            color="amber-darken-2"
            size="x-small"
            variant="flat"
            class="font-weight-bold ml-2"
          >
            Custom
          </v-chip>
        </div>
      </div>
    </v-img>

    <!-- Card Content -->
    <v-card-text class="flex-grow-1 pb-2">
      <!-- Badges / Chips -->
      <div class="d-flex flex-wrap ga-1 mb-3">
        <v-chip
          :color="rocket.active ? 'success' : 'grey'"
          size="x-small"
          variant="tonal"
          prepend-icon="mdi-circle-medium"
        >
          {{ rocket.active ? 'Active' : 'Retired / Inactive' }}
        </v-chip>

        <v-chip
          v-if="rocket.reusable !== undefined"
          color="info"
          size="x-small"
          variant="outlined"
          prepend-icon="mdi-recycle"
        >
          {{ rocket.reusable ? 'Reusable' : 'Expendable' }}
        </v-chip>

        <v-chip
          v-if="countryDisplay"
          color="purple-lighten-2"
          size="x-small"
          variant="tonal"
          prepend-icon="mdi-earth"
        >
          {{ countryDisplay }}
        </v-chip>
      </div>

      <!-- Description -->
      <p class="text-body-2 text-medium-emphasis description-clamp">
        {{ rocket.description || 'No detailed description available for this vehicle.' }}
      </p>
    </v-card-text>

    <!-- Card Footer / Actions -->
    <v-divider />
    <v-card-actions class="px-4 py-2 bg-surface-variant">
      <span class="text-caption text-medium-emphasis">
        <v-icon
          icon="mdi-cash"
          size="14"
          class="mr-1"
        />
        {{ formatCost(rocket.launch_cost) }}
      </span>
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        size="small"
        append-icon="mdi-arrow-right"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Rocket } from '@/types/rocket';

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

// Fallback image using a high quality public SpaceX rocket visual
const fallbackImage = 'https://images.unsplash.com/photo-1517976487507-5b3a4a9d7008?auto=format&fit=crop&w=600&q=80';

const countryDisplay = computed(() => {
  const c = props.rocket.manufacturer?.country_code;
  if (!c) return null;
  return Array.isArray(c) ? c.join(', ') : c;
});

function formatCost(cost?: string | number | null): string {
  if (cost === undefined || cost === null || cost === '' || cost === '0') {
    return 'Cost: N/A';
  }
  const num = Number(cost);
  if (isNaN(num)) return `Cost: ${cost}`;
  return `$${(num / 1_000_000).toFixed(1)}M / launch`;
}

function navigateToDetail() {
  router.push(`/rockets/${props.rocket.id}`);
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.rocket-card:hover {
  transform: translateY(-4px);
}
.image-gradient {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 100%);
  width: 100%;
}
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.2em;
}
</style>
