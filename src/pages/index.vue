<template>
  <v-container class="py-8">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4 mb-0">
        Rockets
      </h1>
      <v-btn
        color="primary"
        @click="isDialogOpen = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <v-dialog
      v-model="isDialogOpen"
      max-width="800"
    >
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>
        <v-card-text>
          <RocketForm 
            @submit="onFormSubmit" 
            @cancel="isDialogOpen = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-text-field
      v-model="filterTextLocal"
      label="Filter rockets by name"
      variant="outlined"
      class="mb-4"
      clearable
    />

    <div
      v-if="status === 'loading'"
      class="d-flex justify-center py-8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <div
      v-else-if="status === 'error'"
      class="text-center py-8"
    >
      <p class="mb-4">
        Failed to load rockets.
      </p>
      <p
        v-if="errorMessage"
        class="mb-4 text-caption text-error"
      >
        {{ errorMessage }}
      </p>
      <v-btn
        color="primary"
        @click="onRetry"
      >
        Retry
      </v-btn>
    </div>

    <div
      v-else
      class="mb-2 text-body-2 text-medium-emphasis"
    >
      Showing {{ rockets.length }} rockets
    </div>

    <v-row v-if="status === 'success'">
      <v-col
        v-for="rocket in rockets"
        :key="rocket.id"
        cols="12"
        md="6"
        lg="4"
      >
        <RocketCard
          :rocket="rocket"
          @click="goToDetail(rocket.id)"
        />
      </v-col>

      <v-col
        v-if="!rockets.length && status === 'success'"
        cols="12"
      >
        <p class="text-center py-8">
          No rockets found.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  //
  import { ref, watch, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useRocketStore } from '@/stores/rocket'
  import type { Rocket } from '@/services/spacexService'

  const rocketStore = useRocketStore()
  const router = useRouter()
  const { filteredRockets, status, errorMessage, filterText } = storeToRefs(rocketStore)

  const filterTextLocal = ref(filterText.value || '')

  const rockets = filteredRockets

  type NewRocketPayload = {
    name: string
    description: string
    country: string
    firstFlight: string
    costPerLaunch: number
    imageUrl?: string
  }

  const onFormSubmit = (payload: NewRocketPayload) => {
    const rocket: Rocket = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: payload.name,
      description: payload.description,
      country: payload.country,
      first_flight: payload.firstFlight,
      cost_per_launch: payload.costPerLaunch,
      flickr_images: payload.imageUrl ? [payload.imageUrl] : [],
    }

    rocketStore.addRocket(rocket)
    isDialogOpen.value = false
  }

  const goToDetail = (id: string) => {
    router.push({ path: `/rockets/${id}` })
  }

  const onRetry = () => {
    rocketStore.fetchRockets(filterTextLocal.value)
  }

  const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
  const isDialogOpen = ref(false)

  watch(filterTextLocal, value => {
    rocketStore.setFilterText(value)

    if (debounceTimeout.value !== null) {
      clearTimeout(debounceTimeout.value)
    }

    debounceTimeout.value = setTimeout(() => {
      rocketStore.fetchRockets(value)
    }, 400)
  })

  onMounted(() => {
    rocketStore.fetchRockets(filterTextLocal.value)
  })
</script>
