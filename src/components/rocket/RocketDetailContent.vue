<script lang="ts" setup>
import { mdiRocketLaunchOutline } from '@/constants/icons'
import { formatCurrency, formatDate } from '@/utils/format'
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
</script>

<template>
  <v-card rounded="xl">
    <v-img
      v-if="rocket.imageUrl"
      cover
      height="320"
      :src="rocket.imageUrl"
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
          <v-icon
            :icon="mdiRocketLaunchOutline"
            size="64"
          />
        </div>
      </template>
    </v-img>
    <div
      v-else
      class="d-flex align-center justify-center bg-grey-lighten-2"
      style="height: 320px"
    >
      <v-icon
        :icon="mdiRocketLaunchOutline"
        size="64"
      />
    </div>

    <v-card-text class="pa-6">
      <div class="d-flex flex-wrap align-center ga-3 mb-2">
        <h1 class="text-h4 font-weight-bold">
          {{ rocket.name }}
        </h1>
        <v-chip
          v-if="rocket.country"
          class="text-uppercase font-weight-bold"
          size="small"
          variant="tonal"
        >
          {{ rocket.country }}
        </v-chip>
      </div>

      <p class="text-body-1 text-medium-emphasis mb-6">
        <FallbackText
          fallback="Deskripsi belum tersedia"
          :value="rocket.description"
        />
      </p>

      <v-row>
        <v-col
          cols="12"
          sm="4"
        >
          <div class="text-caption text-medium-emphasis">
            Cost per launch
          </div>
          <div class="text-h6 font-weight-medium">
            <FallbackText
              fallback="Tidak diketahui"
              :value="formatCurrency(rocket.costPerLaunch)"
            />
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <div class="text-caption text-medium-emphasis">
            Country
          </div>
          <div class="text-h6 font-weight-medium">
            <FallbackText
              fallback="Tidak diketahui"
              :value="rocket.country"
            />
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <div class="text-caption text-medium-emphasis">
            First flight
          </div>
          <div class="text-h6 font-weight-medium">
            <FallbackText
              fallback="Tidak diketahui"
              :value="formatDate(rocket.firstFlight)"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
