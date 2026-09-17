<template>
  <v-row dense>
    <v-col
      cols="12"
      sm="8"
    >
      <v-text-field
        v-model="search"
        clearable
        label="Search by name or description"
        prepend-inner-icon="mdi-magnify"
      />
    </v-col>
    <v-col
      cols="12"
      sm="4"
    >
      <v-select
        v-model="active"
        item-title="label"
        item-value="value"
        :items="activeOptions"
        label="Status"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { ActiveFilter } from '@/types/rocket'

  const search = defineModel<string | null>('search', { required: true })
  const active = defineModel<ActiveFilter>('active', { required: true })

  const activeOptions: { label: string, value: ActiveFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Retired', value: 'retired' },
  ]
</script>
