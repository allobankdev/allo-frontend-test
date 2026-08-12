<template>
  <v-list lines="two">
    <v-list-item>
      <template #prepend>
        <v-icon color="primary">
          mdi-information-outline
        </v-icon>
      </template>
      <template #title>
        Status
      </template>
      <template #subtitle>
        <v-chip
          v-if="rocket.isLocal"
          size="small"
          color="success"
          variant="tonal"
        >
          Local Add
        </v-chip>
        <span
          v-else
          class="text-medium-emphasis"
        >SpaceX — via API</span>
      </template>
    </v-list-item>
    <v-divider />
    <v-list-item>
      <template #prepend>
        <v-icon color="primary">
          mdi-currency-usd
        </v-icon>
      </template>
      <template #title>
        Launch Cost
      </template>
      <template #subtitle>
        <span :class="{ 'text-disabled opacity-60': !rocket.launch_cost }">
          {{ rocket.launch_cost ? formatCurrency(rocket.launch_cost) : 'No data available' }}
        </span>
      </template>
    </v-list-item>
    <v-divider />
    <v-list-item>
      <template #prepend>
        <v-icon color="primary">
          mdi-earth
        </v-icon>
      </template>
      <template #title>
        Country of Origin
      </template>
      <template #subtitle>
        <span :class="{ 'text-disabled opacity-60': !rocket.manufacturer?.country_code }">
          {{ rocket.manufacturer?.country_code ? formatCountry(rocket.manufacturer.country_code) + ' ' + countryFlag(rocket.manufacturer.country_code) : 'No data available' }}
        </span>
      </template>
    </v-list-item>
    <v-divider />
    <v-list-item>
      <template #prepend>
        <v-icon color="primary">
          mdi-calendar
        </v-icon>
      </template>
      <template #title>
        First Flight
      </template>
      <template #subtitle>
        <span :class="{ 'text-disabled opacity-60': !rocket.maiden_flight }">
          {{ rocket.maiden_flight ? formatDate(rocket.maiden_flight) : 'No data available' }}
        </span>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, formatCountry, countryFlag } from '@/utils/formatters'

defineProps<{ rocket: Rocket }>()
</script>
