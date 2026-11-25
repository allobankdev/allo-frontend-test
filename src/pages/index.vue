
<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">SpaceX Rockets</h1>
        <p class="text-body-1 text-medium-emphasis mt-2">
          Explore the launch vehicles developed by SpaceX.
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        @click="showAddDialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <!-- Search -->
    <v-text-field
      v-model="search"
      label="Search rockets"
      placeholder="Enter rocket name..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      rounded="lg"
      class="mb-6"
      hide-details
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />

      <p class="mt-4 text-medium-emphasis">
        Loading SpaceX rockets...
      </p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="errorMessage"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mb-6"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <span>{{ errorMessage }}</span>

        <v-btn
          color="error"
          variant="text"
          @click="fetchRockets"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Empty State -->
    <div
      v-else-if="filteredRockets.length === 0"
      class="text-center py-12"
    >
      <v-icon size="56" color="grey">
        mdi-rocket-launch-outline
      </v-icon>

      <h2 class="text-h6 mt-4">
        No rockets found
      </h2>

      <p class="text-body-2 text-medium-emphasis mt-2">
        Try searching with another keyword.
      </p>
    </div>

    <!-- Rocket List -->
    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          height="100%"
          rounded="lg"
          elevation="2"
          class="rocket-card"
        >
          <!-- Rocket Image -->
          <v-img
            v-if="rocket.image_url"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            height="210"
            cover
            class="bg-grey-lighten-3"
          >
            <template #error>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="56" color="grey">
                  mdi-rocket-launch
                </v-icon>
              </div>
            </template>
          </v-img>

          <div
            v-else
            class="d-flex align-center justify-center bg-grey-lighten-3"
            style="height: 210px"
          >
            <v-icon size="56" color="grey">
              mdi-rocket-launch
            </v-icon>
          </div>

          <!-- Rocket Information -->
          <v-card-title class="text-h6 font-weight-bold">
            {{ rocket.full_name }}
          </v-card-title>

          <v-card-text>
            <p class="text-body-2 text-medium-emphasis rocket-description">
              {{ rocket.description || 'No description available.' }}
            </p>
          </v-card-text>

          <!-- Actions -->
          <v-card-actions class="px-4 pb-4">
            <v-btn
              color="primary"
              variant="tonal"
              block
              rounded="lg"
              @click="viewRocket(rocket)"
            >
              View Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <v-dialog
      v-model="showAddDialog"
      max-width="550"
      persistent
    >
      <v-card rounded="lg">
        <v-card-title class="pa-5">
          Add New Rocket
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <v-form ref="addRocketForm" @submit.prevent="addRocket">
            <v-text-field
              v-model="newRocket.full_name"
              label="Rocket Name"
              variant="outlined"
              :rules="[requiredRule]"
            />

            <v-text-field
              v-model="newRocket.image_url"
              label="Image URL"
              variant="outlined"
              :rules="[requiredRule]"
            />

            <v-textarea
              v-model="newRocket.description"
              label="Description"
              variant="outlined"
              rows="3"
              :rules="[requiredRule]"
            />

            <v-text-field
              v-model="newRocket.launch_cost"
              label="Launch Cost"
              variant="outlined"
            />

            <v-text-field
              v-model="newRocket.country_code"
              label="Country Code"
              placeholder="Example: USA"
              variant="outlined"
            />

            <v-text-field
              v-model="newRocket.maiden_flight"
              label="Maiden Flight"
              type="date"
              variant="outlined"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-5 pt-0">
          <v-spacer />

          <v-btn
            variant="text"
            @click="closeAddDialog"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            @click="addRocket"
          >
            Save Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Local Rocket Detail Dialog -->
    <v-dialog
      v-model="showDetailDialog"
      max-width="600"
    >
      <v-card v-if="selectedRocket" rounded="lg">
        <v-img
          v-if="selectedRocket.image_url"
          :src="selectedRocket.image_url"
          :alt="selectedRocket.full_name"
          height="250"
          cover
        >
          <template #error>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon size="64" color="grey">
                mdi-rocket-launch
              </v-icon>
            </div>
          </template>
        </v-img>

        <div
          v-else
          class="d-flex align-center justify-center bg-grey-lighten-3"
          style="height: 200px"
        >
          <v-icon size="64">
            mdi-rocket-launch
          </v-icon>
        </div>

        <v-card-title class="text-h5 font-weight-bold pa-5 pb-2">
          {{ selectedRocket.full_name }}
        </v-card-title>

        <v-card-text class="px-5">
          <p class="mb-5">
            {{ selectedRocket.description || 'No description available.' }}
          </p>

          <v-list density="comfortable">
            <v-list-item title="Launch Cost">
              <template #subtitle>
                {{ formatLaunchCost(selectedRocket.launch_cost) }}
              </template>
            </v-list-item>

            <v-list-item title="Country">
              <template #subtitle>
                {{ selectedRocket.manufacturer?.country_code || 'Not available' }}
              </template>
            </v-list-item>

            <v-list-item title="Maiden Flight">
              <template #subtitle>
                {{ selectedRocket.maiden_flight || 'Not available' }}
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-5 pt-0">
          <v-spacer />

          <v-btn
            color="primary"
            variant="flat"
            @click="showDetailDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Notification -->
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      timeout="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getRockets } from '@/services/rocketService'
import type { Rocket, NewRocketInput } from '@/types/rocket'

const router = useRouter()

const search = ref('')
const rockets = ref<Rocket[]>([])

const isLoading = ref(false)
const errorMessage = ref('')

const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const showSnackbar = ref(false)

const snackbarMessage = ref('')
const selectedRocket = ref<Rocket | null>(null)

const addRocketForm = ref()

const newRocket = ref<NewRocketInput>({
  image_url: '',
  full_name: '',
  description: '',
  launch_cost: null,
  country_code: '',
  maiden_flight: null,
})

const requiredRule = (value: string) =>
  !!value || 'This field is required.'

const filteredRockets = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return rockets.value.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(keyword),
  )
})

async function fetchRockets() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    rockets.value = await getRockets()
  } catch (error) {
    console.error('Failed to fetch rockets:', error)
    errorMessage.value = 'Failed to load rockets. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function addRocket() {
  const { valid } = await addRocketForm.value.validate()

  if (!valid) return

  const rocket: Rocket = {
    id: `local-${Date.now()}`,
    image_url: newRocket.value.image_url,
    full_name: newRocket.value.full_name,
    description: newRocket.value.description,
    launch_cost: newRocket.value.launch_cost,
    manufacturer: {
      name: null,
      country_code: newRocket.value.country_code || null,
    },
    maiden_flight: newRocket.value.maiden_flight || null,
  }

  rockets.value.unshift(rocket)

  closeAddDialog()

  snackbarMessage.value = 'Rocket added successfully!'
  showSnackbar.value = true
}

function closeAddDialog() {
  showAddDialog.value = false

  newRocket.value = {
    image_url: '',
    full_name: '',
    description: '',
    launch_cost: null,
    country_code: '',
    maiden_flight: null,
  }
}

async function viewRocket(rocket: Rocket) {
  // Convert API ID to string because the API may return a number.
  const rocketId = String(rocket.id)

  // Locally added rockets use the local detail dialog.
  if (rocketId.startsWith('local-')) {
    selectedRocket.value = rocket
    showDetailDialog.value = true
    return
  }

  // API rockets navigate to the Rocket Detail page.
  const targetPath = `/rockets/${encodeURIComponent(rocketId)}`

  console.log('Opening rocket detail:', targetPath)

  try {
    await router.push(targetPath)
  } catch (error) {
    console.error('Navigation failed:', error)
  }
}

function formatLaunchCost(cost: string | number | null) {
  if (cost === null || cost === '') {
    return 'Not available'
  }

  if (typeof cost === 'number') {
    return `$${cost.toLocaleString('en-US')}`
  }

  return cost
}

onMounted(() => {
  fetchRockets()
})
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 60px;
}
</style>
