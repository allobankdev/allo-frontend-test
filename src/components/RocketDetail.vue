<template>
  <v-card>
    <v-row no-gutters>
      <v-col
        cols="12"
        md="6"
      >
        <RocketImage
          :height="360"
          :name="rocket.name"
          :src="rocket.imageUrl"
        />
      </v-col>

      <v-col
        class="pa-6"
        cols="12"
        md="6"
      >
        <h1 class="text-h4 mb-4">
          {{ rocket.name }}
        </h1>
        <p class="text-body-1 mb-4">
          {{ formatDescription(rocket.description) }}
        </p>

        <v-list bg-color="transparent">
          <v-list-item
            v-for="fact in facts"
            :key="fact.label"
            class="px-0"
            :subtitle="fact.label"
            :title="fact.value"
          />
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import type { Rocket } from '@/types/rocket'
  import {
    formatCountry,
    formatDescription,
    formatFirstFlight,
    formatLaunchCost,
  } from '@/utils/formatters'

  const props = defineProps<{
    rocket: Rocket
  }>()

  const facts = computed(() => [
    { label: 'Cost per launch', value: formatLaunchCost(props.rocket.launchCost) },
    { label: 'Country', value: formatCountry(props.rocket.country) },
    { label: 'First flight', value: formatFirstFlight(props.rocket.firstFlight) },
  ])
</script>
