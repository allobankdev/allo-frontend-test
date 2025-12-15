<template>
  <div class="rocket-detail-page">
    <div v-if="loading" class="loading-section">
      <AppLoading />
    </div>

    <div v-else-if="error" class="error-section">
      <AppError :message="error" :on-retry="fetchRocket" />
    </div>

    <div v-else-if="rocket" class="rocket-detail">
      <button @click="goBack" class="back-button">← Back to Rockets</button>
      
      <div class="detail-header">
        <h1>{{ rocket.name }}</h1>
        <div class="rocket-tags">
          <span class="tag country">{{ rocket.country }}</span>
          <span v-if="isLocalRocket" class="tag local">Local Rocket</span>
          <span class="tag cost">${{ formatCost(rocket.cost_per_launch) }} per launch</span>
        </div>
      </div>

      <div class="detail-content">
        <div class="image-section">
          <img 
            :src="rocket.flickr_images[0]" 
            :alt="rocket.name" 
            class="main-image"
          />
          <div v-if="rocket.flickr_images.length > 1" class="image-grid">
            <img
              v-for="(img, index) in rocket.flickr_images.slice(1, 5)"
              :key="index"
              :src="img"
              :alt="`${rocket.name} ${index + 2}`"
              class="thumbnail"
            />
          </div>
        </div>

        <div class="info-section">
          <div class="info-card">
            <h3>Description</h3>
            <p>{{ rocket.description }}</p>
          </div>

          <div class="specs-grid">
            <div class="spec-item">
              <h4>First Flight</h4>
              <p>{{ formatDate(rocket.first_flight) }}</p>
            </div>
            
            <div class="spec-item">
              <h4>Height</h4>
              <p>{{ rocket.height.meters }} m / {{ rocket.height.feet }} ft</p>
            </div>
            
            <div class="spec-item">
              <h4>Diameter</h4>
              <p>{{ rocket.diameter.meters }} m / {{ rocket.diameter.feet }} ft</p>
            </div>
            
            <div class="spec-item">
              <h4>Mass</h4>
              <p>{{ formatMass(rocket.mass.kg) }} kg</p>
            </div>
            
            <div class="spec-item">
              <h4>Success Rate</h4>
              <p>{{ rocket.success_rate_pct }}%</p>
            </div>
            
            <div class="spec-item">
              <h4>Active Status</h4>
              <p :class="rocket.active ? 'status-active' : 'status-inactive'">
                {{ rocket.active ? 'Active' : 'Inactive' }}
              </p>
            </div>
          </div>

          <div v-if="rocket.engines" class="info-card">
            <h3>Engine Specifications</h3>
            <div class="engine-specs">
              <div class="engine-item">
                <span>Type:</span>
                <strong>{{ rocket.engines.type }}</strong>
              </div>
              <div class="engine-item">
                <span>Version:</span>
                <strong>{{ rocket.engines.version }}</strong>
              </div>
              <div class="engine-item">
                <span>Number:</span>
                <strong>{{ rocket.engines.number }}</strong>
              </div>
              <div class="engine-item">
                <span>Propellant:</span>
                <strong>{{ rocket.engines.propellant_1 }} / {{ rocket.engines.propellant_2 }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Rocket not found</h2>
      <button @click="goBack" class="back-button">← Back to Rockets</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { spacexAPI } from '../api/spacex';
import type { Rocket } from '../types';
import AppLoading from '../components/AppLoading.vue';
import AppError from '../components/AppError.vue';

const route = useRoute();
const router = useRouter();

const rocket = ref<Rocket | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const isLocalRocket = computed(() => {
  return rocket.value?.id?.startsWith('local-') || false;
});

const formatCost = (cost: number): string => {
  return new Intl.NumberFormat('en-US').format(cost);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatMass = (kg: number): string => {
  return new Intl.NumberFormat('en-US').format(kg);
};

const fetchRocket = async (): Promise<void> => {
  loading.value = true;
  error.value = null;
  
  try {
    // Check if it's a local rocket
    if (route.params.id.toString().startsWith('local-')) {
      // For local rockets, create mock data
      rocket.value = {
        id: route.params.id.toString(),
        name: 'Local Rocket',
        description: 'This is a locally added rocket.',
        flickr_images: ['https://via.placeholder.com/800x400'],
        country: 'Unknown',
        cost_per_launch: 0,
        first_flight: new Date().toISOString().split('T')[0],
        active: false,
        stages: 2,
        boosters: 0,
        success_rate_pct: 0,
        type: 'rocket',
        company: 'User Added',
        height: { meters: 0, feet: 0 },
        diameter: { meters: 0, feet: 0 },
        mass: { kg: 0, lb: 0 },
        payload_weights: [],
        first_stage: {
          reusable: false,
          engines: 0,
          fuel_amount_tons: 0,
          burn_time_sec: 0,
          thrust_sea_level: { kN: 0, lbf: 0 },
          thrust_vacuum: { kN: 0, lbf: 0 }
        },
        second_stage: {
          reusable: false,
          engines: 0,
          fuel_amount_tons: 0,
          burn_time_sec: 0,
          thrust: { kN: 0, lbf: 0 }
        },
        engines: {
          number: 0,
          type: 'unknown',
          version: 'unknown',
          layout: 'unknown',
          engine_loss_max: 0,
          propellant_1: 'unknown',
          propellant_2: 'unknown',
          thrust_sea_level: { kN: 0, lbf: 0 },
          thrust_vacuum: { kN: 0, lbf: 0 },
          thrust_to_weight: 0
        },
        landing_legs: {
          number: 0,
          material: null
        },
        wikipedia: '',
        __typename: 'Rocket'
      } as Rocket;
    } else {
      // Fetch from SpaceX API
      const data = await spacexAPI.getRocketById(route.params.id.toString());
      rocket.value = data;
    }
  } catch (err) {
    error.value = 'Failed to load rocket details. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goBack = (): void => {
  router.push('/');
};

onMounted(() => {
  fetchRocket();
});
</script>

<style scoped>
/* CSS sama seperti sebelumnya */
.rocket-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  background: none;
  border: 2px solid #2196f3;
  color: #2196f3;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 30px;
  transition: all 0.3s;
}

.back-button:hover {
  background-color: #2196f3;
  color: white;
}

.detail-header {
  margin-bottom: 40px;
}

.detail-header h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #333;
}

.rocket-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.tag.country {
  background: #e3f2fd;
  color: #1976d2;
}

.tag.local {
  background: #e8f5e9;
  color: #2e7d32;
}

.tag.cost {
  background: #fff3e0;
  color: #f57c00;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 992px) {
  .detail-content {
    grid-template-columns: 1fr;
  }
}

.image-section {
  border-radius: 12px;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5rem;
}

.info-card p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.spec-item {
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.spec-item h4 {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-item p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.status-active {
  color: #2e7d32;
  font-weight: bold;
}

.status-inactive {
  color: #d32f2f;
  font-weight: bold;
}

.engine-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.engine-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.engine-item:last-child {
  border-bottom: none;
}

.engine-item span {
  color: #666;
}

.engine-item strong {
  color: #333;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found h2 {
  color: #d32f2f;
  margin-bottom: 20px;
}
</style>