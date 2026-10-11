<template>
  <v-row>
    <v-col
      cols="12"
      md="5"
    >
      <div
        v-if="!rocket.image_url"
        class="d-flex align-center justify-center rounded-lg bg-surface-variant rocket-detail__media"
      >
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="64"
        />
      </div>
      <v-img
        v-else
        :alt="displayText(rocket.full_name)"
        aspect-ratio="4/3"
        class="rounded-lg bg-surface-variant"
        cover
        :src="rocket.image_url"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-surface-variant">
            <v-progress-circular indeterminate />
          </div>
        </template>
        <template #error>
          <div class="d-flex align-center justify-center fill-height bg-surface-variant">
            <v-icon
              icon="mdi-image-off-outline"
              size="64"
            />
          </div>
        </template>
      </v-img>
    </v-col>

    <v-col
      cols="12"
      md="7"
    >
      <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
        {{ displayText(rocket.full_name) }}
      </h1>

      <v-chip
        v-if="rocket.isLocal"
        class="mb-4"
        color="primary"
        size="small"
        variant="tonal"
      >
        Added locally
      </v-chip>

      <p class="text-body-1 mb-6">
        {{ displayText(rocket.description) }}
      </p>

      <v-list
        class="bg-transparent pa-0"
        density="comfortable"
      >
        <v-list-item
          prepend-icon="mdi-currency-usd"
          subtitle="Cost per launch"
          :title="formatLaunchCost(rocket.launch_cost)"
        />
        <v-list-item
          prepend-icon="mdi-earth"
          subtitle="Country"
          :title="displayText(rocket.manufacturer?.country_code)"
        />
        <v-list-item
          prepend-icon="mdi-calendar"
          subtitle="First flight"
          :title="formatDate(rocket.maiden_flight)"
        />
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'
  import { displayText, formatDate, formatLaunchCost } from '@/utils/format'

  defineProps<{
    rocket: Rocket
  }>()
</script>

<style scoped>
  .rocket-detail__media {
    aspect-ratio: 4 / 3;
  }
</style>
