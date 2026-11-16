<template>
  <div class="rocket-detail">
    <div class="mb-4 d-flex align-center justify-space-between flex-wrap ga-2">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="tonal"
        color="primary"
        to="/"
      >
        Back to Fleet
      </v-btn>

      <div class="d-flex ga-2">
        <v-chip
          v-if="rocket.isCustom"
          color="info"
          variant="flat"
          prepend-icon="mdi-plus-circle"
        >
          Custom Rocket
        </v-chip>
        <v-chip
          :color="rocket.active ? 'success' : 'default'"
          variant="flat"
          prepend-icon="mdi-radioactive"
        >
          {{ rocket.active ? 'Active Fleet' : 'Retired' }}
        </v-chip>
        <v-chip
          v-if="rocket.reusable !== null && rocket.reusable !== undefined"
          :color="rocket.reusable ? 'primary' : 'warning'"
          variant="tonal"
          prepend-icon="mdi-recycle"
        >
          {{ rocket.reusable ? 'Reusable' : 'Expendable' }}
        </v-chip>
      </div>
    </div>

    <v-card
      class="rounded-xl overflow-hidden mb-6"
      elevation="2"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
          class="bg-grey-darken-4"
        >
          <v-img
            v-if="rocket.image_url && !imageFailed"
            :src="rocket.image_url"
            height="100%"
            min-height="340"
            cover
            @error="handleImageError"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
                <v-progress-circular
                  indeterminate
                  color="primary"
                />
              </div>
            </template>
          </v-img>
          <div
            v-else
            class="d-flex flex-column align-center justify-center fill-height bg-grey-darken-4 text-medium-emphasis pa-8"
            style="min-height: 340px"
          >
            <v-icon
              icon="mdi-rocket-outline"
              size="64"
              class="mb-2"
            />
            <span class="text-body-2">No Image Available</span>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
          class="pa-6 pa-md-8 d-flex flex-column justify-center"
        >
          <div class="d-flex align-center mb-1">
            <v-chip
              size="small"
              color="primary"
              variant="tonal"
              class="font-weight-bold"
            >
              {{ rocket.manufacturer?.name || 'SpaceX' }}
            </v-chip>
            <v-chip
              size="small"
              color="surface-variant"
              variant="flat"
              class="ml-2"
            >
              {{ rocketCountry }}
            </v-chip>
          </div>

          <h1 class="text-h4 font-weight-black mb-3">
            {{ rocketName }}
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-6">
            {{ rocketDescription }}
          </p>

          <v-row
            dense
            class="mt-auto"
          >
            <v-col
              cols="12"
              sm="4"
            >
              <v-card
                variant="tonal"
                color="primary"
                class="pa-3 rounded-lg text-center"
              >
                <div class="text-caption text-medium-emphasis">
                  Cost per Launch
                </div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ launchCostFormatted }}
                </div>
              </v-card>
            </v-col>

            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 rounded-lg text-center"
              >
                <div class="text-caption text-medium-emphasis">
                  Country
                </div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ rocketCountry }}
                </div>
              </v-card>
            </v-col>

            <v-col
              cols="6"
              sm="4"
            >
              <v-card
                variant="tonal"
                class="pa-3 rounded-lg text-center"
              >
                <div class="text-caption text-medium-emphasis">
                  First Flight
                </div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ maidenFlightFormatted }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <v-card
      class="pa-6 rounded-xl mb-6"
      elevation="1"
    >
      <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center">
        <v-icon
          icon="mdi-cogs"
          class="mr-2"
          color="primary"
        />
        Vehicle Specifications & Launch Metrics
      </h2>

      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">Height / Length</span>
            <div class="text-body-1 font-weight-medium">
              {{ rocket.length ? `${rocket.length} m` : 'N/A' }}
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">Diameter</span>
            <div class="text-body-1 font-weight-medium">
              {{ rocket.diameter ? `${rocket.diameter} m` : 'N/A' }}
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">Launch Mass</span>
            <div class="text-body-1 font-weight-medium">
              {{ rocket.launch_mass ? `${rocket.launch_mass.toLocaleString()} t` : 'N/A' }}
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">LEO Capacity</span>
            <div class="text-body-1 font-weight-medium">
              {{ rocket.leo_capacity ? `${rocket.leo_capacity.toLocaleString()} kg` : 'N/A' }}
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">Takeoff Thrust</span>
            <div class="text-body-1 font-weight-medium">
              {{ rocket.to_thrust ? `${rocket.to_thrust.toLocaleString()} kN` : 'N/A' }}
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">Total Launches</span>
            <div class="text-body-1 font-weight-medium">
              {{ fallbackText(rocket.total_launch_count) }}
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">Successful Launches</span>
            <div class="text-body-1 font-weight-medium text-success">
              {{ fallbackText(rocket.successful_launches) }}
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <div class="metric-item">
            <span class="text-caption text-medium-emphasis">Family / Variant</span>
            <div class="text-body-1 font-weight-medium">
              {{ [rocket.family, rocket.variant].filter(Boolean).join(' - ') || 'N/A' }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { RocketItem } from '@/types/rocket'
import {
  fallbackText,
  formatFlightDate,
  formatLaunchCost,
} from '@/utils/formatters'

const props = defineProps<{
  rocket: RocketItem
}>()

const imageFailed = ref(false)

const handleImageError = () => {
  imageFailed.value = true
}

const rocketName = computed(() => {
  return props.rocket.full_name || props.rocket.name || 'Unnamed Rocket'
})

const rocketDescription = computed(() => {
  return props.rocket.description || 'No detailed description available for this launcher configuration.'
})

const rocketCountry = computed(() => {
  return props.rocket.manufacturer?.country_code || 'USA'
})

const maidenFlightFormatted = computed(() => {
  return formatFlightDate(props.rocket.maiden_flight)
})

const launchCostFormatted = computed(() => {
  return formatLaunchCost(props.rocket.launch_cost)
})
</script>

<style scoped>
.metric-item {
  padding: 8px 12px;
  border-left: 2px solid rgba(255, 255, 255, 0.12);
}
</style>
