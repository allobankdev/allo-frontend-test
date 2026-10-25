<template>
  <v-container class="py-8">
    <!-- Back Navigation -->
    <div class="mb-6">
      <v-btn
        color="secondary"
        exact
        prepend-icon="mdi-arrow-left"
        to="/"
        variant="tonal"
      >
        Back to Rocket List
      </v-btn>
    </div>

    <!-- UI State: Loading -->
    <v-card
      v-if="isLoading"
      class="pa-6 rounded-xl border"
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader
            class="rounded-xl"
            height="400"
            type="image"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-skeleton-loader type="article, table-heading, list-item-two-line, list-item-two-line" />
        </v-col>
      </v-row>
    </v-card>

    <!-- UI State: Error / Not Found -->
    <StateError
      v-else-if="errorMessage || !rocket"
      :message="errorMessage || 'Rocket configuration not found.'"
      title="Failed to Load Rocket Details"
      @retry="fetchRocketDetail"
    >
      <template #extra-actions>
        <v-btn
          color="secondary"
          to="/"
          variant="outlined"
        >
          Go Back Home
        </v-btn>
      </template>
    </StateError>

    <!-- UI State: Success -->
    <v-card
      v-else
      class="rounded-xl border overflow-hidden"
      elevation="3"
    >
      <v-row no-gutters>
        <!-- Rocket Image Column -->
        <v-col
          cols="12"
          md="5"
          lg="5"
        >
          <v-img
            alt="Rocket Detail Image"
            class="fill-height bg-grey-darken-4"
            cover
            min-height="360"
            :src="getSafeImage(rocket.image_url)"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="primary"
                  indeterminate
                />
              </div>
            </template>
            <template #error>
              <div class="d-flex flex-column align-center justify-center fill-height bg-grey-darken-3 text-medium-emphasis py-12">
                <v-icon
                  icon="mdi-rocket-launch-outline"
                  size="64"
                />
                <span class="text-caption mt-2">Image Not Available</span>
              </div>
            </template>
          </v-img>
        </v-col>

        <!-- Details Column -->
        <v-col
          class="d-flex flex-column justify-space-between pa-6 pa-md-8"
          cols="12"
          md="7"
          lg="7"
        >
          <div>
            <!-- Top badges -->
            <div class="d-flex flex-wrap align-center ga-2 mb-3">
              <v-chip
                color="primary"
                prepend-icon="mdi-rocket"
                size="small"
                variant="flat"
              >
                SpaceX Launcher
              </v-chip>

              <v-chip
                v-if="rocket.manufacturer?.country_code"
                color="info"
                prepend-icon="mdi-earth"
                size="small"
                variant="tonal"
              >
                {{ formatCountry(rocket.manufacturer.country_code) }}
              </v-chip>

              <v-chip
                v-if="rocket.is_custom"
                color="secondary"
                prepend-icon="mdi-account-plus"
                size="small"
                variant="tonal"
              >
                Custom Added
              </v-chip>
            </div>

            <!-- Rocket Name -->
            <h1 class="text-h4 font-weight-bold mb-4">
              {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
            </h1>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="text-subtitle-2 text-medium-emphasis font-weight-bold text-uppercase mb-2">
                Description
              </h3>
              <p class="text-body-1 text-high-emphasis text-justify leading-relaxed">
                {{ rocket.description || 'No detailed technical description is available for this rocket configuration.' }}
              </p>
            </div>

            <v-divider class="my-4" />

            <!-- Key Specifications Grid -->
            <h3 class="text-subtitle-2 text-medium-emphasis font-weight-bold text-uppercase mb-3">
              Key Specifications
            </h3>

            <v-row dense>
              <!-- Cost Per Launch -->
              <v-col
                cols="12"
                sm="6"
              >
                <v-sheet
                  class="pa-3 rounded-lg border bg-surface-light d-flex align-center ga-3"
                  elevation="0"
                >
                  <v-avatar
                    color="primary-lighten-5"
                    size="40"
                  >
                    <v-icon
                      color="primary"
                      icon="mdi-currency-usd"
                    />
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">
                      Cost Per Launch
                    </div>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{ formatCurrency(rocket.launch_cost) }}
                    </div>
                  </div>
                </v-sheet>
              </v-col>

              <!-- Country -->
              <v-col
                cols="12"
                sm="6"
              >
                <v-sheet
                  class="pa-3 rounded-lg border bg-surface-light d-flex align-center ga-3"
                  elevation="0"
                >
                  <v-avatar
                    color="info-lighten-5"
                    size="40"
                  >
                    <v-icon
                      color="info"
                      icon="mdi-flag"
                    />
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">
                      Country Origin
                    </div>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{ formatCountry(rocket.manufacturer?.country_code) }}
                    </div>
                  </div>
                </v-sheet>
              </v-col>

              <!-- First Flight Date -->
              <v-col
                cols="12"
                sm="6"
              >
                <v-sheet
                  class="pa-3 rounded-lg border bg-surface-light d-flex align-center ga-3"
                  elevation="0"
                >
                  <v-avatar
                    color="success-lighten-5"
                    size="40"
                  >
                    <v-icon
                      color="success"
                      icon="mdi-calendar-start"
                    />
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">
                      First Flight (Maiden Flight)
                    </div>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{ formatDate(rocket.maiden_flight) }}
                    </div>
                  </div>
                </v-sheet>
              </v-col>

              <!-- Manufacturer Name -->
              <v-col
                cols="12"
                sm="6"
              >
                <v-sheet
                  class="pa-3 rounded-lg border bg-surface-light d-flex align-center ga-3"
                  elevation="0"
                >
                  <v-avatar
                    color="warning-lighten-5"
                    size="40"
                  >
                    <v-icon
                      color="warning"
                      icon="mdi-domain"
                    />
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">
                      Manufacturer
                    </div>
                    <div class="text-subtitle-1 font-weight-bold text-truncate">
                      {{ rocket.manufacturer?.name || 'SpaceX' }}
                    </div>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </div>

          <!-- Footer Action -->
          <div class="d-flex justify-end mt-6">
            <v-btn
              color="primary"
              prepend-icon="mdi-arrow-left"
              to="/"
              variant="flat"
            >
              Return to Catalog
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, formatCountry, getSafeImage } from '@/utils/formatters'

const route = useRoute()
const { getRocketById } = useRockets()

const rocket = ref<Rocket | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

async function fetchRocketDetail() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const id = route.params.id as string
    const found = await getRocketById(id)
    if (!found) {
      errorMessage.value = 'Rocket not found in current fleet catalog.'
    } else {
      rocket.value = found
    }
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Error fetching rocket details.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRocketDetail()
})
</script>

<style scoped>
.leading-relaxed {
  line-height: 1.7;
}
</style>
