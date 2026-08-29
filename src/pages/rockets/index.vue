<template>
  <v-container fluid class="rockets-page">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <h1 class="page-title">SpaceX Rockets</h1>
        <p class="page-subtitle">Explore SpaceX rocket fleet and specifications</p>
      </v-col>
    </v-row>

    <!-- Filters and Add Button -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="rocketStore.filters.search"
          label="Search rockets"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="rocketStore.filters.active"
          :items="activeOptions"
          label="Rocket Status"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="rocketStore.filters.country"
          :items="countryOptions"
          label="Country"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        ></v-select>
      </v-col>

      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          color="primary"
          block
          size="large"
          @click="openAddDialog"
        >
          <v-icon start>mdi-plus</v-icon>
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Results count -->
    <v-row v-if="!rocketStore.loading && !rocketStore.error">
      <v-col cols="12">
        <p class="results-count">
          Showing {{ rocketStore.filteredRockets.length }} of {{ rocketStore.rockets.length }} rockets
        </p>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <LoadingState v-if="rocketStore.loading" message="Loading rockets..." />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="loadRockets"
    />

    <!-- Rockets Grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard
          :rocket="rocket"
          @click="navigateToDetail(rocket.id)"
        />
      </v-col>

      <!-- Empty State -->
      <v-col v-if="rocketStore.filteredRockets.length === 0" cols="12">
        <div class="empty-state">
          <v-icon size="100" color="grey-lighten-1">mdi-rocket-outline</v-icon>
          <h3 class="mt-4">No rockets found</h3>
          <p class="mt-2">Try adjusting your filters</p>
        </div>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Add New Rocket
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="formRef" v-model="formValid">
            <v-text-field
              v-model="newRocket.name"
              label="Rocket Name"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="newRocket.description"
              label="Description"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rows="3"
              class="mb-3"
            ></v-textarea>

            <!-- Image URLs Section -->
            <div class="mb-3">
              <label class="text-subtitle-2 mb-2 d-block">Rocket Images (Flickr URLs)</label>
              <div
                v-for="(imageUrl, index) in newRocket.imageUrls"
                :key="index"
                class="d-flex gap-2 mb-2"
              >
                <v-text-field
                  v-model="newRocket.imageUrls[index]"
                  :label="`Image URL ${index + 1}`"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  :rules="index === 0 ? [rules.required] : []"
                >
                  <template v-slot:append>
                    <v-btn
                      v-if="newRocket.imageUrls.length > 1"
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click="removeImageUrl(index)"
                    ></v-btn>
                  </template>
                </v-text-field>
              </div>
              <v-btn
                variant="outlined"
                color="primary"
                size="small"
                @click="addImageUrl"
                prepend-icon="mdi-plus"
              >
                Add Another Image
              </v-btn>
            </div>

            <v-text-field
              v-model.number="newRocket.cost_per_launch"
              label="Cost Per Launch (USD)"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              density="comfortable"
              type="number"
              prefix="$"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newRocket.country"
              label="Country"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newRocket.first_flight"
              label="First Flight Date"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              type="date"
              class="mb-3"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeAddDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!formValid"
            @click="addRocket"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import RocketCard from '@/components/RocketCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import type { Rocket } from '@/types/rocket.ts'

const router = useRouter()
const rocketStore = useRocketStore()

const showAddDialog = ref(false)
const formValid = ref(false)
const formRef = ref()

const activeOptions = [
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
]

const countryOptions = [
  { title: 'United States', value: 'United States' },
  { title: 'Republic of the Marshall Islands', value: 'Republic of the Marshall Islands' },
]

const newRocket = ref({
  name: '',
  description: '',
  imageUrls: [''],
  cost_per_launch: 0,
  country: '',
  first_flight: '',
})

const rules = {
  required: (value: string) => !!value || 'This field is required',
  number: (value: number) => value > 0 || 'Must be a positive number',
}

onMounted(() => {
  loadRockets()
})

async function loadRockets() {
  await rocketStore.fetchRockets()
}

function navigateToDetail(id: string) {
  router.push(`/rockets/${id}`)
}

function openAddDialog() {
  showAddDialog.value = true
}

function closeAddDialog() {
  showAddDialog.value = false
  resetForm()
}

function resetForm() {
  newRocket.value = {
    name: '',
    description: '',
    imageUrls: [''],
    cost_per_launch: 0,
    country: '',
    first_flight: '',
  }
  formRef.value?.reset()
}

function addImageUrl() {
  newRocket.value.imageUrls.push('')
}

function removeImageUrl(index: number) {
  newRocket.value.imageUrls.splice(index, 1)
}

function addRocket() {
  if (!formValid.value) return

  // Filter out empty URLs
  const validImageUrls = newRocket.value.imageUrls.filter(url => url.trim() !== '')

  const rocket: Rocket = {
    id: `custom-${Date.now()}`,
    name: newRocket.value.name,
    description: newRocket.value.description,
    flickr_images: validImageUrls,
    cost_per_launch: newRocket.value.cost_per_launch,
    country: newRocket.value.country,
    first_flight: newRocket.value.first_flight,
    active: true,
    stages: 2,
    boosters: 0,
    company: 'Custom',
    height: { meters: 0, feet: 0 },
    diameter: { meters: 0, feet: 0 },
    mass: { kg: 0, lb: 0 },
    success_rate_pct: 0,
    type: 'rocket',
    wikipedia: '',
  }

  rocketStore.addRocket(rocket)
  closeAddDialog()
}
</script>
