<script setup lang="ts">
/**
 * Key facts required by the README (cost, country, first flight) — always shown,
 * with "Not available" when missing — plus optional technical specs that are
 * only listed when the API provides them.
 */
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatCountries, formatCurrency, formatDate, formatQuantity, NOT_AVAILABLE } from '@/utils/format'

const props = defineProps<{
  rocket: Rocket
}>()

const keyFacts = computed(() => [
  { label: 'Cost per launch', icon: 'mdi-cash-multiple', value: formatCurrency(props.rocket.launchCost) },
  { label: 'Country', icon: 'mdi-earth', value: formatCountries(props.rocket.countryCodes) },
  { label: 'First flight', icon: 'mdi-calendar-star', value: formatDate(props.rocket.firstFlight) },
])

const technicalSpecs = computed(() => {
  const { specs, launches } = props.rocket
  return [
    { label: 'Height', value: formatQuantity(specs.heightMeters, 'm') },
    { label: 'Diameter', value: formatQuantity(specs.diameterMeters, 'm') },
    { label: 'Launch mass', value: formatQuantity(specs.massTonnes, 't') },
    { label: 'Payload to LEO', value: formatQuantity(specs.leoCapacityKg, 'kg') },
    { label: 'Payload to GTO', value: formatQuantity(specs.gtoCapacityKg, 'kg') },
    { label: 'Liftoff thrust', value: formatQuantity(specs.thrustKilonewtons, 'kN') },
    { label: 'Total launches', value: launches.total?.toString() ?? null },
    { label: 'Successful launches', value: launches.successful?.toString() ?? null },
    { label: 'Failed launches', value: launches.failed?.toString() ?? null },
  ].filter((spec): spec is { label: string, value: string } => spec.value !== null)
})
</script>

<template>
  <div>
    <dl class="key-facts">
      <div
        v-for="fact in keyFacts"
        :key="fact.label"
        class="key-fact pa-4 rounded-lg"
      >
        <dt class="d-flex align-center ga-2 text-body-2 text-medium-emphasis">
          <v-icon
            :icon="fact.icon"
            size="18"
            aria-hidden="true"
          />
          {{ fact.label }}
        </dt>
        <dd
          class="text-subtitle-1 font-weight-bold mt-1"
          :class="{ 'text-disabled font-weight-regular font-italic': !fact.value }"
        >
          {{ fact.value ?? NOT_AVAILABLE }}
        </dd>
      </div>
    </dl>

    <section
      v-if="technicalSpecs.length"
      class="mt-8"
      aria-labelledby="tech-specs-title"
    >
      <h2
        id="tech-specs-title"
        class="text-h6 mb-3"
      >
        Technical specifications
      </h2>
      <v-table
        class="rounded-lg border"
        density="comfortable"
      >
        <tbody>
          <tr
            v-for="spec in technicalSpecs"
            :key="spec.label"
          >
            <th
              scope="row"
              class="text-medium-emphasis font-weight-regular"
            >
              {{ spec.label }}
            </th>
            <td class="text-right font-weight-medium">
              {{ spec.value }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </section>
  </div>
</template>

<style scoped>
.key-facts {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.key-fact {
  background-color: rgb(var(--v-theme-surface-bright));
}

.key-fact dd {
  margin: 0;
}
</style>
