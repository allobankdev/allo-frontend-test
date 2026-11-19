<template>
  <v-container
    class="py-8"
    max-width="1100"
  >
    <!-- Navigation Back Button -->
    <div class="mb-6">
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/')"
      >
        Back to Fleet List
      </v-btn>
    </div>

    <!-- UI State 1: Loading -->
    <LoadingState
      v-if="store.loading"
      message="Fetching launch vehicle specifications..."
    />

    <!-- UI State 2: Error with Retry -->
    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="loadRocketDetail"
    />

    <!-- UI State 3: Detail Content -->
    <div v-else-if="rocket">
      <!-- Main Rocket Showcase Card -->
      <v-card
        rounded="xl"
        elevation="3"
        class="overflow-hidden mb-8"
      >
        <!-- Hero Header Image -->
        <v-img
          :src="rocket.image_url || fallbackImage"
          height="400"
          cover
          class="bg-grey-darken-4 align-end"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                indeterminate
                size="48"
              />
            </div>
          </template>
          <template #error>
            <div class="d-flex flex-column align-center justify-center fill-height bg-grey-darken-3 text-grey">
              <v-icon
                icon="mdi-rocket"
                size="72"
                class="mb-2"
              />
              <span class="text-subtitle-1">No Image Available for this Vehicle</span>
            </div>
          </template>

          <!-- Gradient Overlay with Title -->
          <div class="detail-hero-gradient px-6 py-6">
            <div class="d-flex flex-wrap align-center ga-3 mb-2">
              <v-chip
                v-if="rocket.is_custom"
                color="amber-darken-2"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                Custom Added
              </v-chip>
              <v-chip
                :color="rocket.active ? 'success' : 'grey'"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                {{ rocket.active ? 'ACTIVE STATUS' : 'RETIRED' }}
              </v-chip>
              <v-chip
                v-if="rocket.reusable !== undefined"
                color="info"
                size="small"
                variant="tonal"
              >
                {{ rocket.reusable ? 'REUSABLE' : 'EXPENDABLE' }}
              </v-chip>
            </div>

            <h1 class="text-h3 font-weight-black text-white">
              {{ rocket.full_name || rocket.name || 'Unnamed Vehicle' }}
            </h1>
          </div>
        </v-img>

        <!-- Main Body -->
        <v-card-text class="pa-8">
          <!-- Required Core Info Grid -->
          <h2 class="text-h6 font-weight-bold mb-4 text-primary">
            <v-icon
              icon="mdi-information-outline"
              class="mr-1"
            />
            Key Specifications
          </h2>

          <v-row class="mb-6">
            <!-- 1. Cost per Launch (Required) -->
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                variant="tonal"
                rounded="lg"
                class="pa-4 text-center h-100"
              >
                <v-icon
                  icon="mdi-currency-usd"
                  color="success"
                  size="36"
                  class="mb-1"
                />
                <div class="text-caption text-medium-emphasis text-uppercase">
                  Cost Per Launch
                </div>
                <div class="text-h6 font-weight-bold mt-1">
                  {{ displayCost(rocket.launch_cost) }}
                </div>
              </v-card>
            </v-col>

            <!-- 2. Country (Required) -->
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                variant="tonal"
                rounded="lg"
                class="pa-4 text-center h-100"
              >
                <v-icon
                  icon="mdi-flag-outline"
                  color="purple-lighten-2"
                  size="36"
                  class="mb-1"
                />
                <div class="text-caption text-medium-emphasis text-uppercase">
                  Manufacturer Country
                </div>
                <div class="text-h6 font-weight-bold mt-1">
                  {{ displayCountry(rocket.manufacturer) }}
                </div>
              </v-card>
            </v-col>

            <!-- 3. First Flight (Required) -->
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                variant="tonal"
                rounded="lg"
                class="pa-4 text-center h-100"
              >
                <v-icon
                  icon="mdi-calendar-star"
                  color="amber-lighten-1"
                  size="36"
                  class="mb-1"
                />
                <div class="text-caption text-medium-emphasis text-uppercase">
                  First Flight Date
                </div>
                <div class="text-h6 font-weight-bold mt-1">
                  {{ displayFlightDate(rocket.maiden_flight) }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <!-- Description Section (Required) -->
          <h2 class="text-h6 font-weight-bold mb-3 text-primary">
            <v-icon
              icon="mdi-text-box-outline"
              class="mr-1"
            />
            Vehicle Overview
          </h2>
          <p
            class="text-body-1 text-medium-emphasis line-height-relaxed mb-6"
            style="line-height: 1.8"
          >
            {{ rocket.description || 'No detailed description has been documented for this vehicle configuration.' }}
          </p>

          <!-- Additional Stats (Bonus / Good Polish) -->
          <v-expansion-panels
            variant="accordion"
            class="mt-4"
          >
            <v-expansion-panel
              title="Additional Technical & Mission Statistics"
              rounded="lg"
            >
              <v-expansion-panel-text>
                <v-row
                  dense
                  class="pt-2"
                >
                  <v-col
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-disabled">
                      Manufacturer
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ rocket.manufacturer?.name || 'SpaceX' }}
                    </div>
                  </v-col>

                  <v-col
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-disabled">
                      Length
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ rocket.length ? `${rocket.length} m` : 'N/A' }}
                    </div>
                  </v-col>

                  <v-col
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-disabled">
                      Diameter
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ rocket.diameter ? `${rocket.diameter} m` : 'N/A' }}
                    </div>
                  </v-col>

                  <v-col
                    cols="6"
                    sm="4"
                    class="mt-3"
                  >
                    <div class="text-caption text-disabled">
                      LEO Payload Capacity
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ rocket.leo_capacity ? `${rocket.leo_capacity.toLocaleString()} kg` : 'N/A' }}
                    </div>
                  </v-col>

                  <v-col
                    cols="6"
                    sm="4"
                    class="mt-3"
                  >
                    <div class="text-caption text-disabled">
                      Total Launches
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ rocket.total_launch_count ?? 'N/A' }}
                    </div>
                  </v-col>

                  <v-col
                    cols="6"
                    sm="4"
                    class="mt-3"
                  >
                    <div class="text-caption text-disabled">
                      Successful Launches
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ rocket.successful_launches ?? 'N/A' }}
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import type { Manufacturer } from '@/types/rocket';

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const fallbackImage = 'https://images.unsplash.com/photo-1517976487507-5b3a4a9d7008?auto=format&fit=crop&w=1200&q=80';

// Current active rocket from store
const rocket = computed(() => store.selectedRocket);

onMounted(() => {
  loadRocketDetail();
});

function loadRocketDetail() {
  const id = route.params.id as string;
  if (id) {
    store.fetchRocketDetail(id);
  }
}

// Formatters handling missing/empty data gracefully
function displayCost(cost?: string | number | null): string {
  if (cost === undefined || cost === null || cost === '' || cost === '0') {
    return 'Not Disclosed';
  }
  const num = Number(cost);
  if (isNaN(num)) return String(cost);
  return `$${num.toLocaleString('en-US')} USD`;
}

function displayCountry(manufacturer?: Manufacturer | null): string {
  if (!manufacturer) return 'United States (USA)';
  const code = manufacturer.country_code || manufacturer.country;
  if (!code) return 'United States (USA)';
  return Array.isArray(code) ? code.join(', ') : code;
}

function displayFlightDate(dateStr?: string | null): string {
  if (!dateStr) return 'No Flight Recorded';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.detail-hero-gradient {
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(0, 0, 0, 0) 100%);
  width: 100%;
}
</style>
