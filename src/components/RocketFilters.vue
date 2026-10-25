<script setup lang="ts">
const searchQuery = defineModel<string>('searchQuery', { required: true })
const countryFilter = defineModel<string>('countryFilter', { required: true })
const sortBy = defineModel<string>('sortBy', { required: true })

defineProps<{
  countries: string[]
}>()

defineEmits<{
  reset: []
}>()

const sortOptions = [
  { title: 'Name A-Z', value: 'name-asc' },
  { title: 'Name Z-A', value: 'name-desc' },
  { title: 'Launch Cost High-Low', value: 'cost-high' },
  { title: 'Launch Cost Low-High', value: 'cost-low' },
]
</script>

<template>
  <v-sheet
    border
    rounded="lg"
    class="pa-4 mb-6"
  >
    <v-row align="center">
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          v-model="searchQuery"
          label="Search rockets"
          placeholder="Search by name or description"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          v-model="countryFilter"
          :items="[
            { title: 'All countries', value: 'all' },
            ...countries.map((country) => ({
              title: country,
              value: country,
            })),
          ]"
          label="Country"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col
        cols="12"
        md="1"
        class="d-flex justify-end"
      >
        <v-btn
          variant="text"
          @click="$emit('reset')"
        >
          Reset
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>