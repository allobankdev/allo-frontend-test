<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-img
        v-if="rocket.flickr_images && rocket.flickr_images.length"
        :src="rocket.flickr_images[0]"
        height="320"
        cover
        class="mb-4"
      />

      <div
        v-else
        class="mb-4"
      >
        <p class="text-subtitle-2 text-medium-emphasis">
          No image available.
        </p>
      </div>
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <h1 class="text-h4 mb-2">
        {{ rocket.name }}
      </h1>
      <p class="mb-4">
        {{ rocket.description }}
      </p>

      <v-list density="comfortable">
        <v-list-item>
          <v-list-item-title class="font-weight-medium">
            Country
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ rocket.country }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="font-weight-medium">
            First flight
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ rocket.first_flight }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="font-weight-medium">
            Cost per launch
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ formattedCostPerLaunch }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  //
  import { computed } from 'vue'
  import type { Rocket } from '@/services/spacexService'

  const props = defineProps<{ rocket: Rocket }>()

  const formattedCostPerLaunch = computed(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })

    return formatter.format(props.rocket.cost_per_launch)
  })
</script>
