<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRocketStore } from '@/store/rocketStore'
import RequestStateHandler from '@/components/RequestStateHandler.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilterBar from '@/components/RocketFilterBar.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const router = useRouter()
const rocketStore = useRocketStore()
const { status, errorMessage, searchQuery, filteredRockets } = storeToRefs(rocketStore)

const isAddDialogOpen = ref(false)

onMounted(() => {
  if (rocketStore.rockets.length === 0) {
    rocketStore.fetchRockets()
  }
})

function goToDetail(rocket) {
  router.push({ name: 'rocket-detail', params: { id: rocket.id } })
}

function handleAddRocket(formValues) {
  rocketStore.addRocket(formValues)
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">SpaceX Rockets</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Browse SpaceX's rocket lineup, powered by the Launch Library API.
        </p>
      </div>
      <v-btn color="accent" prepend-icon="mdi-plus" @click="isAddDialogOpen = true">
        Add rocket
      </v-btn>
    </div>

    <div class="mb-6" style="max-width: 420px">
      <RocketFilterBar v-model="searchQuery" />
    </div>

    <RequestStateHandler
      :status="status"
      :error-message="errorMessage"
      loading-text="Fetching rockets..."
      @retry="rocketStore.fetchRockets"
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
          <RocketCard :rocket="rocket" @click="goToDetail" />
        </v-col>
      </v-row>

      <div v-else class="d-flex flex-column align-center justify-center py-16 text-medium-emphasis">
        <v-icon icon="mdi-rocket-outline" size="40" class="mb-2" />
        <p>No rockets match "{{ searchQuery }}".</p>
      </div>
    </RequestStateHandler>

    <AddRocketDialog v-model="isAddDialogOpen" @submit="handleAddRocket" />
  </div>
</template>
