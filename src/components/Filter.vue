<script setup lang="ts">
import { computed } from 'vue'
import { useRocketStore } from '@/stores/Rockets'

const rocketStore = useRocketStore()

const countryOptions = computed(() => {
  const countries = rocketStore.rocketData.map(r => r.country)
  return ['All Country', ...new Set(countries)]
})

const companyOptions = computed(() => {
  const companies = rocketStore.rocketData.map(r => r.company)
  return ['All Company', ...new Set(companies)]
})

</script>

<template>
  <div class="max-w-sm">
    <!-- Card Filter -->
    <v-card class="py-4 px-4 border border-blue-600 rounded-md">
      <v-col>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Countries</label>
          <v-select
            v-model="rocketStore.country"
            :items="countryOptions"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Company</label>
          <v-select
            v-model="rocketStore.company"
            :items="companyOptions"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>

        <v-btn
          block
          class="mt-4 rounded-md"
          color="primary"
          @click="rocketStore.clearFilters()"
        >
          Hapus Filter
        </v-btn>
      </v-col>
    </v-card>
  </div>
</template>


<style>

</style>