<template>
  <v-container class="py-8">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1 mb-0">
          Browse Launch Library rocket configurations
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="dialogOpen = true"
      >
        Add rocket
      </v-btn>
    </div>

    <RocketFilter
      class="mb-6"
      :model-value="store.filterQuery"
      @update:model-value="store.setFilterQuery"
    />

    <AsyncState
      :error-message="store.listError"
      loading-message="Loading rockets..."
      :status="store.listStatus"
      @retry="store.loadRockets"
    >
      <v-alert
        v-if="store.filteredRockets.length === 0"
        class="mb-4"
        type="info"
        variant="tonal"
      >
        No rockets match your filter.
      </v-alert>

      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
          sm="6"
        >
          <RocketCard
            :rocket="rocket"
            @select="goToDetail"
          />
        </v-col>
      </v-row>
    </AsyncState>

    <AddRocketDialog
      v-model="dialogOpen"
      @submit="onAddRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AddRocketDialog from '@/components/rockets/AddRocketDialog.vue'
  import RocketCard from '@/components/rockets/RocketCard.vue'
  import RocketFilter from '@/components/rockets/RocketFilter.vue'
  import AsyncState from '@/components/ui/AsyncState.vue'
  import { useRocketsStore } from '@/stores/rockets'
  import type { NewRocketInput } from '@/types/rocket'

  const store = useRocketsStore()
  const router = useRouter()
  const dialogOpen = ref(false)

  onMounted(() => {
    if (store.listStatus !== 'success') {
      store.loadRockets()
    }
  })

  function goToDetail (id: number) {
    router.push(`/rockets/${id}`)
  }

  function onAddRocket (payload: NewRocketInput) {
    store.addRocket(payload)
  }
</script>
