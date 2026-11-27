<template>
  <v-container class="py-6 py-md-8">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-1">
        SpaceX Rocket Fleet
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Explore SpaceX launch vehicles, filter by specifications, or add a new rocket to the list.
      </p>
    </div>

    <StateLoading
      v-if="rocketStore.listLoading"
      message="Fetching SpaceX rockets..."
    />

    <StateError
      v-else-if="rocketStore.listError"
      :message="rocketStore.listError"
      title="Failed to load rockets"
      @retry="handleRetry"
    />

    <template v-else>
      <RocketFilterBar
        v-model:availability="rocketStore.availabilityFilter"
        v-model:search="rocketStore.searchQuery"
        :filtered-count="rocketStore.filteredRockets.length"
        :total-count="rocketStore.rockets.length"
        @add="isAddDialogOpen = true"
        @reset="rocketStore.resetFilters"
      />

      <v-row v-if="rocketStore.filteredRockets.length > 0">
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          lg="4"
          sm="6"
        >
          <RocketCard
            :rocket="rocket"
            @select="handleSelectRocket"
          />
        </v-col>
      </v-row>

      <v-card
        v-else
        class="pa-8 text-center mt-4"
        rounded="lg"
        variant="outlined"
      >
        <v-icon
          class="mb-3"
          color="medium-emphasis"
          icon="mdi-rocket-outline"
          size="48"
        />
        <h3 class="text-h6 font-weight-bold mb-1">
          No rockets found
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Try adjusting your search keywords or active filters.
        </p>
        <v-btn
          color="primary"
          variant="tonal"
          @click="rocketStore.resetFilters"
        >
          Clear Filters
        </v-btn>
      </v-card>
    </template>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbar.show"
      color="success"
      location="bottom right"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AddRocketDialog from '@/components/AddRocketDialog.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import RocketFilterBar from '@/components/RocketFilterBar.vue'
  import StateError from '@/components/StateError.vue'
  import StateLoading from '@/components/StateLoading.vue'
  import { useRocketStore } from '@/stores/rockets'
  import type { NewRocketPayload } from '@/types/rocket'

  const router = useRouter()
  const rocketStore = useRocketStore()

  const isAddDialogOpen = ref(false)
  const snackbar = reactive({
    show: false,
    text: '',
  })

  onMounted(() => {
    rocketStore.loadRockets()
  })

  function handleRetry () {
    rocketStore.loadRockets(true)
  }

  function handleSelectRocket (id: number) {
    router.push(`/rockets/${id}`)
  }

  function handleAddRocket (payload: NewRocketPayload) {
    const created = rocketStore.addRocket(payload)
    snackbar.text = `"${created.name}" has been added to the rocket list.`
    snackbar.show = true
  }
</script>