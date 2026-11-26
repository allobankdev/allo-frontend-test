<template>
  <v-row
    align="center"
    dense
  >
    <v-col
      cols="12"
      md="7"
    >
      <v-text-field
        clearable
        density="comfortable"
        hide-details
        label="Search rockets"
        :model-value="filters.search"
        placeholder="Name or description"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @update:model-value="update({ search: $event ?? '' })"
      />
    </v-col>

    <v-col
      cols="12"
      md="5"
    >
      <v-btn-toggle
        class="w-100"
        color="primary"
        density="comfortable"
        divided
        mandatory
        :model-value="filters.active"
        variant="outlined"
        @update:model-value="update({ active: $event })"
      >
        <v-btn
          v-for="option in ACTIVE_OPTIONS"
          :key="option.value"
          class="flex-grow-1"
          :value="option.value"
        >
          {{ option.label }}
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { ActiveFilter, RocketFilters } from '@/types/rocket'

  const ACTIVE_OPTIONS: { label: string, value: ActiveFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Retired', value: 'inactive' },
  ]

  const filters = defineModel<RocketFilters>({ required: true })

  function update (patch: Partial<RocketFilters>) {
    filters.value = { ...filters.value, ...patch }
  }
</script>
