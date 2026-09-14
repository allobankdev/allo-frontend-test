<template>
  <v-row
    class="mb-4"
    dense
  >
    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <v-text-field
        v-model="search"
        label="Search rockets"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        clearable
      />
    </v-col>
    <v-col
      cols="6"
      sm="3"
      md="2"
    >
      <v-select
        v-model="status"
        :items="statusOptions"
        label="Status"
        density="compact"
        hide-details
      />
    </v-col>
    <v-col
      cols="6"
      sm="3"
      md="2"
    >
      <v-select
        v-model="family"
        :items="familyOptions"
        label="Family"
        density="compact"
        hide-details
      />
    </v-col>
    <v-col
      cols="6"
      sm="3"
      md="2"
    >
      <v-select
        v-model="country"
        :items="countryOptions"
        label="Country"
        density="compact"
        hide-details
      />
    </v-col>
    <v-col
      cols="12"
      sm="auto"
      md="auto"
      class="d-flex align-center ms-sm-auto"
    >
      <slot name="actions" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { useRocketFilters } from '@/composables/useRocketFilters'

  const { search, status, family, country, statusOptions, familyOptions, countryOptions } = useRocketFilters()
</script>
