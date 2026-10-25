<template>
  <v-container class="py-6">
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Browse and explore SpaceX launch vehicles
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddDialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <RocketFilter
      class="mb-6"
      :model-value="state.filter"
      @update:model-value="setFilter"
    />

    <LoadingState v-if="state.loading" />

    <ErrorState
      v-else-if="state.error"
      :message="state.error"
      @retry="loadRockets"
    />

    <template v-else>
      <v-alert
        v-if="filteredRockets.length === 0"
        class="mb-4"
        text="No rockets match your filter."
        type="info"
        variant="tonal"
      />

      <v-row>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          md="6"
          lg="4"
        >
          <RocketCard
            :rocket="rocket"
            :selected="rocket.id === selectedRocketId"
          />
        </v-col>
      </v-row>
    </template>

    <AddRocketDialog
      v-model="showAddDialog"
      @submit="addLocalRocket"
    />

    <RocketDetailSidebar
      :open="selectedRocketId !== null"
      :rocket-id="selectedRocketId"
      @close="closeDetail"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AddRocketDialog from '@/components/rocket/AddRocketDialog.vue'
  import ErrorState from '@/components/common/ErrorState.vue'
  import LoadingState from '@/components/common/LoadingState.vue'
  import RocketCard from '@/components/rocket/RocketCard.vue'
  import RocketDetailSidebar from '@/components/rocket/RocketDetailSidebar.vue'
  import RocketFilter from '@/components/rocket/RocketFilter.vue'
  import { useRocketsStore } from '@/stores/rockets'

  const route = useRoute()
  const router = useRouter()
  const { state, filteredRockets, loadRockets, setFilter, addLocalRocket } = useRocketsStore()

  const showAddDialog = ref(false)

  const selectedRocketId = computed<number | null>(() => {
    const id = Number(route.params.id)
    return Number.isNaN(id) ? null : id
  })

  function closeDetail (): void {
    router.push('/')
  }
  
  // jika data === 0 loading false dan error false maka loadRockets
  onMounted(() => {
    if (state.rockets.length === 0 && !state.loading && !state.error) {
      loadRockets()
    }
  })
</script>
