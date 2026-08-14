<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6 px-0 text-none"
      @click="router.back()"
      color="primary"
    >
      Kembali ke Daftar
    </v-btn>

    <!-- State Feedback -->
    <StateFeedback 
      v-if="store.isLoading || store.errorMessage"
      :is-loading="store.isLoading"
      :error-message="store.errorMessage"
      @retry="fetchRocketData"
    />

    <!-- Rocket Detail View -->
    <v-row v-else-if="rocket">
      <v-col cols="12" md="5" lg="4">
        <v-card rounded="xl" elevation="4" class="overflow-hidden">
          <v-img
            :src="imageUrl"
            height="500"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon icon="mdi-rocket-outline" size="64" color="grey"></v-icon>
              </div>
            </template>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="12" md="7" lg="8" class="pl-md-8">
        <div class="d-flex align-center mb-2">
          <v-chip color="primary" variant="flat" size="small" class="font-weight-bold mr-3">
            {{ rocket.manufacturer?.country_code || 'N/A' }}
          </v-chip>
          <span class="text-caption text-medium-emphasis">ID: {{ rocket.id }}</span>
        </div>
        
        <h1 class="text-h3 font-weight-bold mb-6">{{ rocket.full_name }}</h1>
        
        <v-card variant="outlined" rounded="xl" class="mb-8 border-opacity-50">
          <v-row no-gutters>
            <v-col cols="6" class="pa-4 border-e border-opacity-50">
              <div class="text-caption text-medium-emphasis mb-1 text-uppercase font-weight-bold">Biaya Peluncuran</div>
              <div class="text-h6 font-weight-bold text-primary">
                {{ formattedCost }}
              </div>
            </v-col>
            <v-col cols="6" class="pa-4">
              <div class="text-caption text-medium-emphasis mb-1 text-uppercase font-weight-bold">Penerbangan Perdana</div>
              <div class="text-h6 font-weight-bold">
                {{ formattedDate }}
              </div>
            </v-col>
          </v-row>
        </v-card>

        <h3 class="text-h5 font-weight-bold mb-3">Tentang Roket Ini</h3>
        <p class="text-body-1 text-medium-emphasis" style="line-height: 1.8;">
          {{ rocket.description || 'Deskripsi tidak tersedia untuk roket ini.' }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '../../stores/rocketStore';
import StateFeedback from '../../components/StateFeedback.vue';

const route = useRoute('/rockets/[id]');
const router = useRouter();
const store = useRocketStore();

const rocket = computed(() => store.selectedRocket);

const imageUrl = computed(() => {
  return rocket.value?.image_url || 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800&auto=format&fit=crop';
});

const formattedCost = computed(() => {
  if (rocket.value?.launch_cost == null) return 'N/A';
  const cost = Number(rocket.value.launch_cost);
  if (isNaN(cost)) return String(rocket.value.launch_cost);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cost);
});

const formatCurrency = (value: string | number | null) => {
  if (!value) return 'Unknown';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return value.toString();
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(numValue);
};

const formattedDate = computed(() => {
  if (!rocket.value?.maiden_flight) return 'N/A';
  try {
    const date = new Date(rocket.value.maiden_flight);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch (e) {
    return rocket.value.maiden_flight;
  }
});

const fetchRocketData = () => {
  const id = route.params.id;
  if (id) {
    store.fetchRocketById(id as string);
  }
};

onMounted(() => {
  fetchRocketData();
});
</script>

<style scoped>
.border-opacity-50 {
  border-color: rgba(var(--v-border-color), 0.5) !important;
}
</style>
