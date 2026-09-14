<template>
  <v-container
    fluid
    class="py-6 px-4 px-sm-6"
    style="max-width: 800px"
  >
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      to="/"
    >
      Back to rockets
    </v-btn>

    <div
      v-if="rocketsStore.loading"
      class="d-flex justify-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
    </div>

    <v-alert
      v-else-if="rocketsStore.error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      Failed to load rockets.
      <template #append>
        <v-btn
          variant="text"
          color="error"
          @click="rocketsStore.fetchRockets"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <v-empty-state
      v-else-if="!rocket"
      icon="mdi-rocket-launch-outline"
      title="Rocket not found"
      text="It may have been removed, or the link is incorrect."
    />

    <v-card v-else>
      <v-img
        v-if="rocket.image_url && !imgError"
        :src="rocket.image_url"
        height="320"
        cover
        @error="imgError = true"
      />
      <div
        v-else
        class="d-flex align-center justify-center bg-surface-variant"
        style="height: 320px"
      >
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="64"
        />
      </div>

      <v-card-title class="text-h5">
        {{ rocket.full_name }}
      </v-card-title>

      <v-card-text>
        <p class="mb-4">
          {{ rocket.description || "No description available." }}
        </p>

        <v-table density="compact">
          <tbody>
            <tr
              v-for="row in detailRows"
              :key="row.label"
            >
              <td
                class="text-medium-emphasis"
                style="width: 35%; padding-left: 0"
              >
                {{ row.label }}
              </td>
              <td>{{ row.value }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/helper'
  import { useRocketsStore } from '@/stores/rockets'

  const route = useRoute()
  const rocketsStore = useRocketsStore()

  const imgError = ref(false)

  const rocket = computed(() =>
    rocketsStore.rockets.find(item => item.id === Number(route.params.id)),
  )

  const detailRows = computed(() => {
    const r = rocket.value
    if (!r) return []

    const stages = r.min_stage != null && r.max_stage != null
      ? (r.min_stage === r.max_stage ? `${r.min_stage}` : `${r.min_stage}-${r.max_stage}`)
      : null

    const rows = [
      { label: 'Status', value: r.active ? 'Active' : 'Retired' },
      { label: 'Family', value: r.family },
      { label: 'Variant', value: r.variant },
      { label: 'Manufacturer', value: r.manufacturer?.name },
      { label: 'Country', value: r.manufacturer?.country_code },
      { label: 'Reusable', value: r.reusable == null ? null : (r.reusable ? 'Yes' : 'No') },
      { label: 'Stages', value: stages },
      { label: 'Length', value: formatNumber(r.length, 'm') },
      { label: 'Diameter', value: formatNumber(r.diameter, 'm') },
      { label: 'Launch mass', value: formatNumber(r.launch_mass, 't') },
      { label: 'LEO capacity', value: formatNumber(r.leo_capacity, 'kg') },
      { label: 'GTO capacity', value: formatNumber(r.gto_capacity, 'kg') },
      { label: 'Cost per launch', value: formatCurrency(r.launch_cost, false) },
      { label: 'Maiden flight', value: formatDate(r.maiden_flight) },
      { label: 'Total launches', value: formatNumber(r.total_launch_count) },
      { label: 'Successful launches', value: formatNumber(r.successful_launches) },
      { label: 'Failed launches', value: formatNumber(r.failed_launches) },
      { label: 'Successful landings', value: formatNumber(r.successful_landings) },
      { label: 'Failed landings', value: formatNumber(r.failed_landings) },
    ]

    return rows.filter((row): row is { label: string, value: string } => !!row.value)
  })

  onMounted(() => {
    if (rocketsStore.rockets.length === 0) rocketsStore.fetchRockets()
  })
</script>
