<template>
  <div class="rocket-list-page">
    <v-container class="py-6">
      <v-row class="mb-5">
        <v-col cols="12">
         <div class="d-flex flex-row justify-space-between align-center">
            <div>
              <h1 class="text-h4 font-weight-bold">🚀 SpaceX Rocket</h1>
              <p class="text-subtitle-1 text-grey">Manage your rockets here</p>
            </div>
            <div>
              <v-btn  
                prepend-icon="mdi-plus"
                variant="outlined"
                size="large"
                class="add-rocket-btn"
                @click="showModalAdd = true">
                Add Rocket
              </v-btn>
            </div>
         </div>
        </v-col>
      </v-row>

      <div class="filter-rocket-section">
        <RocketFilter />
      </div>

      <div v-if="rocketStore.isError" class="error-state-section">
        <ErrorState
          :message="rocketStore?.error || ''"
          @retry="handleRetry"
        />
      </div>

      <div v-else class="rocket-card-list-section">
        <div class="rockets-status mb-3">
        <v-row>
          <v-col 
            cols="12" 
            md="4"
          >
            <v-card class="pa-3">
              <div class="d-flex align-center">
                <div>
                  <v-icon
                  size="small"
                  icon="mdi-rocket"
                  class="mr-3"
                  />
                </div>

                <div>
                  <div class="text-subtitle-2 text-medium-emphasis">Total Rocket</div>
                  <div class="text-h5 font-weight-bold">{{ rocketStore.rockets.length || 0 }}</div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col 
            cols="12" 
            md="4"
          >
            <v-card class="pa-3">
              <div class="d-flex align-center">
                <div>
                  <v-icon
                  size="small"
                  icon="mdi-airplane-remove"
                  class="mr-3"
                  />
                </div>

                <div>
                  <div class="text-subtitle-2 text-medium-emphasis">Total Inactive Rocket</div>
                  <div class="text-h5 font-weight-bold">{{ rocketStore.getTotalInactiveRocket || 0 }}</div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col 
            cols="12" 
            md="4"
          >
            <v-card class="pa-3">
              <div class="d-flex align-center">
                <div>
                  <v-icon
                  size="small"
                  icon="mdi-trending-up"
                  class="mr-3"
                  />
                </div>

                <div>
                  <div class="text-subtitle-2 text-medium-emphasis">Average Success Rate</div>
                  <div class="text-h5 font-weight-bold">{{ rocketStore.getTotalSuccessRate || 0 }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

        <div v-if="rocketStore.isLoading" class="loading-section">
          <v-row>
            <v-col
              v-for="n in 8"
              :key="n"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <SkeleteonCard />
            </v-col>
          </v-row>
        </div>

        <div v-else-if="rocketStore.filteredRockets.length === 0" class="empty-state-section">
          <EmptyState
            title="No rockets found"
            message=""
          />
        </div>

        <v-row v-else>
          <v-col
            v-for="rocket in rocketStore.filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </div>

      <AddRocketDialog
        v-model=showModalAdd
      />
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRocketsStore } from '@/stores/rocket'
  import ErrorState from '@/components/ErrorState.vue';
  import EmptyState from '@/components/EmptyState.vue';
  import RocketFilter from '@/components/RocketFilter.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import AddRocketDialog from '@/components/RocketAddDialog.vue';
  
  const rocketStore = useRocketsStore()
  const showModalAdd = ref(false);

  const hasActiveFilters = computed(() => {
    return !!(rocketStore.filterQuery.name?.trim() || rocketStore.filterQuery.active !== null)
  })

  onMounted(async () => {
    if (rocketStore?.rockets?.length === 0) {
      await rocketStore.fetchRockets()
    }
  })
  
  const handleRetry = () => {
    rocketStore.fetchRockets()
    rocketStore.clearErrorState()
  }

  const handleClearFilters = () => {
    rocketStore.filterQuery.name = null
    rocketStore.filterQuery.active = null
  }
</script>

<style scoped>
  .rocket-list-page {
    min-height: 100vh;
  }
</style>
