<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    hover
    @click="navigateToDetail"
  >
    <v-img
      :src="imageSrc"
      height="220"
      cover
      class="bg-grey-darken-4"
      @error="handleImageError"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>

      <div class="d-flex justify-space-between p-2 ma-2">
        <v-chip
          v-if="rocket.manufacturer?.country_code"
          size="small"
          color="primary"
          variant="flat"
        >
          {{ rocket.manufacturer.country_code }}
        </v-chip>
        <v-chip
          v-if="rocket.is_custom"
          size="small"
          color="secondary"
          variant="flat"
        >
          User Added
        </v-chip>
      </div>
    </v-img>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold text-truncate">
        {{ rocket.full_name || 'Unnamed Rocket' }}
      </v-card-title>
      <v-card-subtitle v-if="rocket.maiden_flight">
        First Flight: {{ formatDate(rocket.maiden_flight) }}
      </v-card-subtitle>
      <v-card-subtitle v-else>
        First Flight: N/A
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p class="text-body-2 text-medium-emphasis description-text">
        {{ rocket.description || 'No description available for this launcher configuration.' }}
      </p>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-4 py-3">
      <span class="text-caption text-medium-emphasis">
        Cost: {{ formatCost(rocket.launch_cost) }}
      </span>
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        size="small"
        append-icon="mdi-arrow-right"
        @click.stop="navigateToDetail"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Rocket } from '@/types/rocket';

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();
const imageFailed = ref(false);

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517976487507-5b3b4a45097c?auto=format&fit=crop&w=800&q=80';

const imageSrc = computed(() => {
  if (imageFailed.value || !props.rocket.image_url) {
    return DEFAULT_IMAGE;
  }
  return props.rocket.image_url;
});

function handleImageError() {
  imageFailed.value = true;
}

function navigateToDetail() {
  router.push(`/rockets/${props.rocket.id}`);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatCost(cost: string | number | null | undefined): string {
  if (cost === null || cost === undefined || cost === '') return 'N/A';
  const num = typeof cost === 'number' ? cost : parseFloat(cost);
  if (isNaN(num)) return String(cost);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
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

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
</style>
