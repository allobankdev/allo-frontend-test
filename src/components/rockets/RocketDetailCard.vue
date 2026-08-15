<template>
  <v-card
    elevation="3"
    rounded="xl"
    border
    class="overflow-hidden"
  >
    <!-- Top Hero Banner / Media -->
    <div class="detail-hero-container">
      <v-img
        :src="currentImage"
        :alt="`Hero image of ${rocket.fullName}`"
        height="400"
        cover
        class="bg-grey-darken-4"
        @error="onImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              indeterminate
              color="primary"
              size="48"
            />
          </div>
        </template>

        <!-- Gradient overlay -->
        <div class="hero-overlay d-flex flex-column justify-space-between fill-height pa-6">
          <div class="d-flex justify-space-between align-center">
            <v-btn
              to="/"
              variant="flat"
              color="surface"
              density="comfortable"
              prepend-icon="mdi-arrow-left"
              class="text-none font-weight-bold"
            >
              Back to List
            </v-btn>

            <div class="d-flex ga-2">
              <v-chip
                v-if="rocket.isCustom"
                color="secondary"
                size="default"
                variant="flat"
                class="font-weight-bold"
              >
                Custom Rocket
              </v-chip>

              <v-chip
                :color="rocket.active ? 'success' : 'default'"
                size="default"
                variant="flat"
                class="font-weight-bold"
              >
                {{ rocket.active ? 'Active' : 'Retired' }}
              </v-chip>
            </div>
          </div>

          <div>
            <span class="text-overline text-grey-lighten-2 font-weight-bold">
              {{ rocket.family || 'SpaceX Launcher' }}
            </span>
            <h1 class="text-h4 text-sm-h3 font-weight-bold text-white mb-2">
              {{ rocket.fullName }}
            </h1>
          </div>
        </div>
      </v-img>
    </div>

    <!-- Main Details Body -->
    <v-card-text class="pa-6 pa-md-8">
      <v-row>
        <!-- Left: Description -->
        <v-col
          cols="12"
          md="7"
          class="pr-md-6"
        >
          <div class="d-flex align-center mb-3">
            <v-icon
              icon="mdi-text-box-outline"
              color="primary"
              class="mr-2"
            />
            <h2 class="text-h6 font-weight-bold">
              Vehicle Overview
            </h2>
          </div>

          <p class="text-body-1 text-high-emphasis line-height-relaxed mb-6">
            {{ rocket.description || 'No detailed description is available in the archive for this launch vehicle configuration.' }}
          </p>

          <v-divider class="my-6" />

          <!-- Additional info tags -->
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-if="rocket.reusable"
              color="info"
              variant="tonal"
              prepend-icon="mdi-recycle"
            >
              Stage Reusable
            </v-chip>
            <v-chip
              v-else
              color="default"
              variant="tonal"
              prepend-icon="mdi-close-circle-outline"
            >
              Expendable
            </v-chip>

            <v-chip
              color="primary"
              variant="tonal"
              prepend-icon="mdi-identifier"
            >
              ID: #{{ rocket.id }}
            </v-chip>
          </div>
        </v-col>

        <!-- Right: Specifications Card -->
        <v-col
          cols="12"
          md="5"
        >
          <v-card
            variant="tonal"
            color="surface-variant"
            rounded="lg"
            class="pa-5"
          >
            <h3 class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
              <v-icon
                icon="mdi-information-outline"
                color="primary"
                class="mr-2"
              />
              Key Specifications
            </h3>

            <v-list
              bg-color="transparent"
              density="comfortable"
              lines="two"
              class="pa-0"
            >
              <!-- Cost Per Launch -->
              <v-list-item class="px-0">
                <template #prepend>
                  <v-avatar
                    color="primary"
                    variant="tonal"
                    rounded="lg"
                    size="40"
                    class="mr-3"
                  >
                    <v-icon icon="mdi-currency-usd" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption text-medium-emphasis">
                  Cost Per Launch
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-1 font-weight-bold text-high-emphasis">
                  {{ formattedCost }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2" />

              <!-- Country -->
              <v-list-item class="px-0">
                <template #prepend>
                  <v-avatar
                    color="primary"
                    variant="tonal"
                    rounded="lg"
                    size="40"
                    class="mr-3"
                  >
                    <v-icon icon="mdi-earth" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption text-medium-emphasis">
                  Country of Origin
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-1 font-weight-bold text-high-emphasis">
                  {{ rocket.countryCode || 'USA' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2" />

              <!-- First Flight -->
              <v-list-item class="px-0">
                <template #prepend>
                  <v-avatar
                    color="primary"
                    variant="tonal"
                    rounded="lg"
                    size="40"
                    class="mr-3"
                  >
                    <v-icon icon="mdi-calendar-start" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption text-medium-emphasis">
                  First Flight (Maiden)
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-1 font-weight-bold text-high-emphasis">
                  {{ formattedMaidenFlight }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Rocket } from '@/types/rocket'
import { DEFAULT_ROCKET_IMAGE } from '@/utils/constants'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface Props {
  rocket: Rocket
}

const props = defineProps<Props>()

const imgFailed = ref(false)

watch(() => props.rocket.imageUrl, () => {
  imgFailed.value = false
})

const currentImage = computed(() => {
  if (imgFailed.value || !props.rocket.imageUrl) {
    return DEFAULT_ROCKET_IMAGE
  }
  return props.rocket.imageUrl
})

const formattedCost = computed(() => {
  return formatCurrency(props.rocket.launchCost)
})

const formattedMaidenFlight = computed(() => {
  return formatDate(props.rocket.maidenFlight)
})

function onImageError () {
  imgFailed.value = true
}
</script>

<style scoped>
.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.1) 40%,
    rgba(0, 0, 0, 0.85) 100%
  );
}

.line-height-relaxed {
  line-height: 1.7;
}
</style>
