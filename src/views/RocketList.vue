<template>
  <div>
    <!-- Header and Stats -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card
          class="pa-4"
          color="primary"
          dark
        >
          <v-row align="center">
            <v-col
              cols="12"
              md="8"
            >
              <h1 class="text-h4 text-md-h3 font-weight-bold">
                🚀 SpaceX Rockets
              </h1>
              <p class="text-subtitle-1 mt-2">
                Explore all SpaceX rockets and their specifications
              </p>
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="text-right"
            >
              <v-btn 
                color="white" 
                variant="outlined" 
                prepend-icon="mdi-plus"
                size="large"
                @click="showAddDialog = true"
              >
                Add New Rocket
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Stats Cards -->
      <v-col
        cols="12"
        md="4"
      >
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon
              color="primary"
              size="large"
              class="mr-3"
            >
              mdi-rocket-launch
            </v-icon>
            <div>
              <div class="text-subtitle-2 text-grey">
                Total Rockets
              </div>
              <div class="text-h5 font-weight-bold">
                {{ store.filteredRockets.length }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon
              color="green"
              size="large"
              class="mr-3"
            >
              mdi-cash
            </v-icon>
            <div>
              <div class="text-subtitle-2 text-grey">
                Avg Cost/Launch
              </div>
              <div class="text-h5 font-weight-bold">
                ${{ (store.totalCostPerLaunch / store.rockets.length / 1000000).toFixed(1) }}M
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon
              color="orange"
              size="large"
              class="mr-3"
            >
              mdi-trending-up
            </v-icon>
            <div>
              <div class="text-subtitle-2 text-grey">
                Avg Success Rate
              </div>
              <div class="text-h5 font-weight-bold">
                {{ store.totalSuccessRate.toFixed(1) }}%
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Section -->
    <v-card class="mb-6">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Filter Rockets</span>
        <v-btn 
          variant="text" 
          color="primary" 
          prepend-icon="mdi-filter-remove"
          size="small"
          @click="store.resetFilters"
        >
          Clear Filters
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="store.filterOptions.active"
              :items="activeOptions"
              label="Status"
              clearable
              prepend-icon="mdi-check-circle"
              @update:model-value="store.filterRockets"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="store.filterOptions.country"
              :items="store.countries"
              label="Country"
              clearable
              prepend-icon="mdi-earth"
              @update:model-value="store.filterRockets"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-slider
              v-model="store.filterOptions.successRate"
              label="Min Success Rate"
              min="0"
              max="100"
              step="10"
              thumb-label="always"
              prepend-icon="mdi-chart-line"
              @change="store.filterRockets"
            >
              <template
                #thumb-label="{ modelValue }"
              >
                {{ modelValue }}%
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <div
      v-if="store.isLoading"
      class="text-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="6"
      />
      <div class="mt-4 text-h6">
        Loading rockets...
      </div>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="store.error"
      type="error"
      class="mb-4"
    >
      <div class="d-flex justify-space-between align-center">
        <div>{{ store.error }}</div>
        <v-btn 
          color="error" 
          variant="tonal" 
          prepend-icon="mdi-refresh"
          @click="store.fetchRockets"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Success State -->
    <div v-else>
      <!-- No Results -->
      <div
        v-if="store.filteredRockets.length === 0"
        class="text-center py-12"
      >
        <v-icon
          size="64"
          color="grey-lighten-1"
        >
          mdi-rocket-off
        </v-icon>
        <div class="text-h5 mt-4 text-grey">
          No rockets found
        </div>
        <div class="text-subtitle-1 mt-2 text-grey">
          Try adjusting your filters
        </div>
        <v-btn 
          class="mt-4" 
          color="primary" 
          prepend-icon="mdi-filter-remove"
          @click="store.resetFilters"
        >
          Clear Filters
        </v-btn>
      </div>

      <!-- Rocket Cards Grid -->
      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </div>

    <!-- Add Rocket Dialog -->
    <v-dialog
      v-model="showAddDialog"
      max-width="600"
    >
      <AddRocketDialog @close="showAddDialog = false" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';
import RocketCard from '../components/RocketCard.vue';
import AddRocketDialog from '../components/AddRocketDialog.vue';

const store = useRocketStore();
const showAddDialog = ref(false);

const activeOptions = [
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
];

onMounted(() => {
  store.fetchRockets();
});
</script>