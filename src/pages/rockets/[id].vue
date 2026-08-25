<template>
  <v-container class="py-10 px-6 max-width-container" v-if="rocket">
    <!-- Back Button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6 rounded-pill px-4 font-weight-bold"
      @click="router.back()"
    >
      Back to Fleet
    </v-btn>

    <v-row>
      <!-- Rocket Image & Title -->
      <v-col cols="12" md="6" v-motion-fade-visible-once>
        <v-img
          :src="rocket.flickr_images[0]"
          class="rounded-xl shadow-lg border-glass"
          cover
          height="500"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>

      <v-col cols="12" md="6" class="ps-md-10 mt-6 mt-md-0" v-motion-fade-visible-once>
        <div class="d-flex align-center gap-4 mb-4">
          <h1 class="text-h2 font-weight-black text-white">{{ rocket.name }}</h1>
          <v-chip color="primary" variant="flat" class="font-weight-bold">ACTIVE</v-chip>
        </div>
        
        <p class="text-h6 text-medium-emphasis mb-8 line-height-relaxed">
          {{ rocket.description }}
        </p>

        <!-- Stats Grid -->
        <v-row class="mb-8">
          <v-col cols="6" sm="4">
            <div class="stat-item">
              <span class="text-caption text-uppercase text-medium-emphasis">Cost per Launch</span>
              <div class="text-h5 font-weight-bold mt-1 text-primary">
                ${{ rocket.cost_per_launch.toLocaleString() }}
              </div>
            </div>
          </v-col>
          <v-col cols="6" sm="4">
            <div class="stat-item">
              <span class="text-caption text-uppercase text-medium-emphasis">Country</span>
              <div class="text-h5 font-weight-bold mt-1 text-white">
                {{ rocket.country }}
              </div>
            </div>
          </v-col>
          <v-col cols="6" sm="4">
            <div class="stat-item">
              <span class="text-caption text-uppercase text-medium-emphasis">First Flight</span>
              <div class="text-h5 font-weight-bold mt-1 text-white">
                {{ rocket.first_flight }}
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="mb-8 opacity-10"></v-divider>

        <!-- Specifications -->
        <h3 class="text-h5 font-weight-bold mb-4">Technical Specifications</h3>
        <v-row>
          <v-col cols="4">
            <div class="spec-card">
              <div class="text-caption text-medium-emphasis">Height</div>
              <div class="text-h6 font-weight-bold">{{ rocket.height.meters }}m</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="spec-card">
              <div class="text-caption text-medium-emphasis">Diameter</div>
              <div class="text-h6 font-weight-bold">{{ rocket.diameter.meters }}m</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="spec-card">
              <div class="text-caption text-medium-emphasis">Mass</div>
              <div class="text-h6 font-weight-bold">{{ (rocket.mass.kg / 1000).toFixed(0) }}t</div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <!-- Loading State -->
  <v-container v-else-if="loading" class="fill-height">
    <StatusState loading />
  </v-container>

  <!-- Error State -->
  <v-container v-else class="fill-height">
    <StatusState :error="'Rocket not found'" @retry="loadRocket" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import StatusState from '@/components/StatusState.vue';

const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();

const loading = ref(true);
const rocketId = computed(() => route.params.id as string);
const rocket = computed(() => rocketStore.getRocketById(rocketId.value));

const loadRocket = async () => {
  loading.value = true;
  if (rocketStore.rockets.length === 0) {
    await rocketStore.loadRockets();
  }
  loading.value = false;
};

onMounted(loadRocket);
</script>

<style scoped>
.max-width-container {
  max-width: 1400px;
  margin: 0 auto;
}

.shadow-lg {
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
}

.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.spec-card {
  padding: 12px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}

.line-height-relaxed {
  line-height: 1.6;
}

.gap-4 {
  gap: 16px;
}
</style>
