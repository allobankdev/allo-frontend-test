<script setup lang="ts">


import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import AddModal from '@/components/AddModal.vue'

const store = useRocketStore()
const router = useRouter()

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})

const goToDetail = (id: string | number) => {
  router.push(`/${id}`)
}
</script>

<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-6">SpaceX Rockets</h1>

    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="store.searchQuery"
          label="Filter rockets by name..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="6" class="text-sm-right">
        <AddModal />
      </v-col>
    </v-row>

    <div v-if="store.loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-grey-darken-1">Fetching rocket configurations...</p>
    </div>

    <v-alert
      v-else-if="store.error"
      type="error"
      variant="tonal"
      class="my-4"
    >
      <template #title>Failed to Load Data</template>
      {{ store.error }}
      <div class="mt-3">
        <v-btn color="error" variant="flat" @click="store.fetchRockets">
          Retry
        </v-btn>
      </div>
    </v-alert>

    <template v-else>
      <v-row v-if="store.filteredRockets.length > 0">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="mx-auto h-100 d-flex flex-column"
            hover
            @click="goToDetail(rocket.id)"
          >

            <v-img
              :src="rocket.image_url || 'https://via.placeholder.com/400x250?text=No+Rocket+Image'"
              height="200"
              cover
              class="bg-grey-lighten-2"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey-lighten-4" />
                </div>
              </template>
            </v-img>

            <v-card-item>
              <v-card-title class="font-weight-bold">
                {{ rocket.full_name || 'Unnamed Rocket' }}
              </v-card-title>
            </v-card-item>

            <v-card-text class="flex-grow-1">
              <p class="text-body-2 text-truncate-2">
                {{ rocket.description || 'No description available for this rocket.' }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal" class="my-4">
        No rockets found
      </v-alert>
    </template>
  </v-container>
</template>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
