<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import SkeletonCard from '@/components/SkeletonCard.vue'
import ErrorState from '@/components/ErrorState.vue'
import RocketCard from '@/components/RocketCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import AddRocketModal from '@/components/AddRocketModal.vue'

const store = useRocketStore()

const currentPage = ref(1)
const itemsPerPage = 6

const totalPages = computed(() =>
  Math.ceil(store.filteredRockets.length / itemsPerPage)
)

const paginatedRockets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return store.filteredRockets.slice(start, start + itemsPerPage)
})

// Reset ke halaman 1 saat search query berubah
watch(() => store.searchQuery, () => {
  currentPage.value = 1
})

// Reset ke halaman 1 saat rocket baru ditambah (agar langsung terlihat di halaman 1)
watch(() => store.localRockets.length, () => {
  currentPage.value = 1
})

onMounted(() => {
  store.fetchRockets()
})
</script>

<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Daftar Roket</h1>
        <p class="text-medium-emphasis mt-1">
          {{ store.filteredRockets.length }} roket ditemukan
        </p>
      </div>
      <AddRocketModal />
    </div>

    <!-- State 1: Loading -->
    <template v-if="store.isLoading">
      <v-row>
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
          <SkeletonCard />
        </v-col>
      </v-row>
    </template>

    <!-- State 2: Error -->
    <ErrorState
      v-else-if="store.errorMsg"
      :message="store.errorMsg"
      @retry="store.fetchRockets"
    />

    <!-- State 3: Success -->
    <template v-else>
      <FilterBar class="mb-6" />

      <!-- Empty search result -->
      <div
        v-if="store.filteredRockets.length === 0"
        class="d-flex flex-column align-center justify-center py-16 ga-3"
      >
        <v-icon icon="mdi-magnify-close" size="56" color="grey" />
        <p class="text-h6 text-medium-emphasis">Tidak ada roket yang cocok</p>
        <p class="text-body-2 text-disabled">Coba kata kunci yang berbeda</p>
      </div>

      <template v-else>
        <TransitionGroup
          name="rocket-list"
          tag="div"
          class="rocket-grid"
        >
          <div
            v-for="rocket in paginatedRockets"
            :key="rocket.id"
            class="rocket-grid-item"
          >
            <RocketCard :rocket="rocket" />
          </div>
        </TransitionGroup>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            rounded="circle"
          />
        </div>
      </template>
    </template>
  </v-container>
</template>

<style scoped>
.rocket-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 600px) {
  .rocket-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 960px) {
  .rocket-grid { grid-template-columns: repeat(3, 1fr); }
}

.rocket-list-enter-active,
.rocket-list-leave-active {
  transition: all 0.3s ease;
}
.rocket-list-enter-from,
.rocket-list-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.rocket-list-move {
  transition: transform 0.3s ease;
}
</style>
