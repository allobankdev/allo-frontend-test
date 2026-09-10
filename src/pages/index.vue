<script setup lang="ts">

import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import AddModal from '@/components/AddModal.vue'
import { debounce } from 'lodash-es'
import ErrorStatus from '@/components/ErrorStatus.vue'
import LoadingStatus from '@/components/LoadingStatus.vue'
import RocketListCard from '@/components/RocketListCard.vue'

const store = useRocketStore()
const router = useRouter()

const localSearch = ref(store.searchQuery)

const updateSearchQuery = debounce((val: string | null) => {
  store.searchQuery = val || ''
}, 300)

watch(localSearch, (newVal) => {
  updateSearchQuery(newVal)
})

onMounted(() => {
  const apiData = store.rockets.some((r) => !r.isCustom)
  if (!apiData) {
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
          v-model="localSearch"
          label="Search by name"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="6" class="text-sm-right">
        <AddModal />
      </v-col>
    </v-row>

    <LoadingStatus
      v-if="store.loading"
      message="Loading rockets..."
    />

    <ErrorStatus
      v-else-if="store.error"
      title="Failed to Load Rockets"
      :message="store.error"
      @retry="store.fetchRockets"
    />

    <template v-else>
      <v-row v-if="store.filteredRockets.length > 0">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketListCard
            :rocket="rocket"
            @click="goToDetail"
          />
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal" class="my-4">
        No rockets found
      </v-alert>
    </template>
  </v-container>
</template>
