<template>
  <v-container class="pb-8 mt-6" style="padding-top: 0">
    <v-row class="mb-4">
      <v-col cols="12" sm="8" md="6">
        <RocketFilter v-model="search" @update:model-value="onSearch" />
      </v-col>
      <v-col cols="12" sm="8" md="6">
        <AddDialog @add="onAddRocket" />
      </v-col>
    </v-row>

    <Skeleton
      :state="store.loadingState"
      :message="store.errorMessage"
      @retry="store.loadRockets()"
    >
      <v-row v-if="store.paginatedRockets.length">
        <v-col
          v-for="rocket in store.paginatedRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" @click="goToDetail(rocket.id)" />
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col class="text-center py-12">
          <v-icon size="64" color="grey" class="mb-4">error</v-icon>
          <p class="text-h6 text-medium-emphasis">No rockets found</p>
          <p class="text-body-2 text-medium-emphasis">Try a different search term</p>
        </v-col>
      </v-row>

      <!-- Pagination -->
      <v-row v-if="store.totalPages > 1" class="mt-6" justify="center">
        <v-col cols="auto">
          <v-pagination
            :model-value="store.currentPage"
            :length="store.totalPages"
            :total-visible="5"
            rounded="circle"
            @update:model-value="store.goToPage"
          />
        </v-col>
      </v-row>
    </Skeleton>

  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddDialog from '@/components/AddDialog.vue'
import Skeleton from '@/components/Skeleton.vue'

const store = useRocketStore()
const router = useRouter()
const search = ref(store.searchQuery)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (store.loadingState === 'idle' || store.loadingState === 'error') {
    store.loadRockets()
  }
})

function onSearch(value: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.applySearch(value)
  }, 400)
}

function goToDetail(id: string) {
  router.push(`/rockets/${id}`)
}

function onAddRocket(rocket: {
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}) {
  store.addRocket(rocket)
}
</script>