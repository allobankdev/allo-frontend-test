<template>
  <v-card rounded="lg" variant="outlined" class="mb-6">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="5">
          <v-text-field
            :model-value="query"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            placeholder="name / description / country"
            clearable
            @update:model-value="$emit('update:query', String($event ?? ''))"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            :model-value="country"
            :items="countryItems"
            label="Country"
            clearable
            @update:model-value="$emit('update:country', String($event ?? 'ALL'))"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-select
            :model-value="active"
            :items="activeItems"
            label="Status"
            @update:model-value="$emit('update:active', ($event as any) ?? 'ALL')"
          />
        </v-col>

        <v-col cols="12" md="2" class="d-flex align-center justify-end">
          <v-btn color="primary" prepend-icon="mdi-plus" @click="$emit('add')">
            Add
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { RocketFilters } from '@/stores/rockets'
import { computed } from 'vue'

const props = defineProps<{
  query: string
  country: RocketFilters['country']
  active: RocketFilters['active']
  countries: string[]
}>()

defineEmits<{
  'update:query': [value: string]
  'update:country': [value: RocketFilters['country']]
  'update:active': [value: RocketFilters['active']]
  add: []
}>()

const countryItems = computed(() => ([
  { title: 'All', value: 'ALL' },
  ...props.countries.map(c => ({ title: c, value: c })),
]))

const activeItems = [
  { title: 'All', value: 'ALL' },
  { title: 'Active', value: 'ACTIVE' },
  { title: 'Inactive', value: 'INACTIVE' },
]
</script>
