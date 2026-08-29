<template>
  <div class="rocket-filter-section mb-6">
   <v-card variant="flat" class="transparent-card">
    <v-row align="center">
      <v-col  
        cols="12" 
        md="4"
      >
        <v-text-field 
          v-model="rocketStore.filterQuery.name"
          placeholder="Name rocket"
          variant="outlined"
          hide-details
          clearable
          density="comfortable"
        />
      </v-col>

      <v-col 
        cols="12" 
        md="4"
      >
        <v-select
          v-model="rocketStore.filterQuery.active"
          placeholder="Status"
          :items="statusOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          hide-details
          clearable
          density="comfortable"
        />
      </v-col>
    </v-row>
   </v-card>

  </div>
</template>

<script lang="ts" setup>
  import { useRocketsStore } from '@/stores/rocket';

  const rocketStore = useRocketsStore()
  const statusOptions = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ]
</script>

<style scoped>
.transparent-card {
  background-color: transparent !important;
}
</style>