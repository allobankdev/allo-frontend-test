<template>
  <v-container class="py-8">
    <v-row class="mb-6 align-center">
      <v-col
        cols="12"
        md="6"
      >
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="d-flex justify-md-end align-center gap-4"
      >
        <v-text-field
          v-model="searchQuery"
          label="Filter Rockets"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="me-4"
          style="max-width: 300px;"
        />
        <AddRocketDialog />
      </v-col>
    </v-row>

    <StateRenderer 
      :is-loading="isLoading" 
      :is-error="isError" 
      :is-success="isSuccess"
      :has-data="allRockets.length > 0"
      :error-message="error?.message"
      @retry="refetch"
    >
      <v-row v-if="filteredRockets.length > 0">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      
      <v-row v-else>
        <v-col
          cols="12"
          class="text-center py-12"
        >
          <v-icon
            size="64"
            color="grey-lighten-1"
            class="mb-4"
          >
            mdi-rocket-outline
          </v-icon>
          <h3 class="text-h6 text-grey-darken-1">
            No rockets found
          </h3>
        </v-col>
      </v-row>
    </StateRenderer>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGetRockets } from '@/services/useRockets'
import { useRocketStore } from '@/stores/rocketStore'
import StateRenderer from '@/components/StateRenderer.vue'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const { data: apiRockets, isLoading, isError, isSuccess, error, refetch } = useGetRockets()
const store = useRocketStore()

const searchQuery = ref('')

const allRockets = computed(() => {
  const fetched = apiRockets.value || []
  const local = store.localRockets || []
  return [...fetched, ...local]
})

const filteredRockets = computed(() => {
  if (!searchQuery.value) return allRockets.value
  const query = searchQuery.value.toLowerCase()
  return allRockets.value.filter(rocket => 
    rocket.name?.toLowerCase().includes(query) || 
    rocket.description?.toLowerCase().includes(query)
  )
})
</script>
