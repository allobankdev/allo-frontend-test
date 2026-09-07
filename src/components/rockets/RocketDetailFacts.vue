<template>
  <v-list density="comfortable">
    <v-list-item
      v-for="fact in facts"
      :key="fact.label"
      :prepend-icon="fact.icon"
    >
      <v-list-item-title class="text-body-2 text-medium-emphasis">
        {{ fact.label }}
      </v-list-item-title>
      <v-list-item-subtitle class="text-body-1 text-high-emphasis">
        {{ fact.value }}
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatCountry, formatDate, formatLaunchCost } from '@/utils/format'

const props = defineProps<{
  rocket: Rocket
}>()

const facts = computed(() => [
  { label: 'Biaya per peluncuran', value: formatLaunchCost(props.rocket.launch_cost), icon: 'mdi-currency-usd' },
  { label: 'Negara', value: formatCountry(props.rocket.manufacturer?.country_code), icon: 'mdi-earth' },
  { label: 'Penerbangan pertama', value: formatDate(props.rocket.maiden_flight), icon: 'mdi-calendar-outline' },
])
</script>
