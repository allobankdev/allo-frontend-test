<template>
  <v-row
    align="center"
    class="mb-4"
  >
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        clearable
        density="comfortable"
        hide-details
        label="Search rockets by name or description"
        :model-value="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @update:model-value="$emit('update:search', $event ?? '')"
      />
    </v-col>

    <v-col
      cols="12"
      md="3"
      sm="6"
    >
      <v-select
        clearable
        density="comfortable"
        hide-details
        :items="families"
        label="Family"
        :model-value="selectedFamily"
        variant="outlined"
        @update:model-value="$emit('update:selectedFamily', $event ?? null)"
      />
    </v-col>

    <v-col
      cols="12"
      md="3"
      sm="6"
    >
      <v-select
        density="comfortable"
        hide-details
        :items="statusOptions"
        label="Status"
        :model-value="statusFilter"
        variant="outlined"
        @update:model-value="$emit('update:statusFilter', $event)"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  export type RocketStatusFilter = 'all' | 'active' | 'inactive'

  defineProps<{
    search: string
    selectedFamily: string | null
    statusFilter: RocketStatusFilter
    families: string[]
  }>()

  defineEmits<{
    'update:search': [value: string]
    'update:selectedFamily': [value: string | null]
    'update:statusFilter': [value: RocketStatusFilter]
  }>()

  const statusOptions: { title: string, value: RocketStatusFilter }[] = [
    { title: 'All Status', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' },
  ]
</script>