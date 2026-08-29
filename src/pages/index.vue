<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRockets } from '@/composables'
import type { RocketFormData } from '@/types'
import RocketCard from '@/components/RocketCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const router = useRouter()
const rockets = useRockets()

const showAddDialog = ref(false)
const searchInput = ref('')
const addRocketDialogRef = ref<InstanceType<typeof AddRocketDialog> | null>(null)
const showFilters = ref(false)

// Filter refs (local UI state)
const companyFilterValue = ref<string | null>(null)
const countryFilterValue = ref<string | null>(null)
const activeFilterValue = ref('all')

// Filter options
const companyOptions = computed(() => rockets.availableCompanies.value)
const countryOptions = computed(() => rockets.availableCountries.value)
const activeOptions = [
  { title: 'All', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
]

// Active filter count for badge
const activeFilterCount = computed(() => {
  let count = 0
  if (companyFilterValue.value) count++
  if (countryFilterValue.value) count++
  if (activeFilterValue.value !== 'all') count++
  return count
})

const hasActiveFilters = computed(() =>
  activeFilterCount.value > 0 || searchInput.value.trim() !== ''
)

// Snackbar state
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

onMounted(() => {
  rockets.fetchRockets()
})

function handleSearch() {
  rockets.setSearchQuery(searchInput.value)
}

function handleCompanyFilter(value: string | null) {
  rockets.setCompanyFilter(value || '')
}

function handleCountryFilter(value: string | null) {
  rockets.setCountryFilter(value || '')
}

function handleActiveFilter(value: string) {
  rockets.setActiveFilter(value)
}

function handleClearFilters() {
  searchInput.value = ''
  companyFilterValue.value = null
  countryFilterValue.value = null
  activeFilterValue.value = 'all'
  rockets.clearFilters()
}

function handleRocketClick(id: string) {
  router.push(`/rockets/${id}`)
}

function handleRetry() {
  rockets.fetchRockets()
}

function handleAddRocket(formData: RocketFormData) {
  try {
    // Validate required fields
    if (!formData.name?.trim()) {
      throw new Error('Rocket name is required')
    }
    if (!formData.description?.trim()) {
      throw new Error('Description is required')
    }
    if (!formData.country?.trim()) {
      throw new Error('Country is required')
    }
    if (!formData.first_flight) {
      throw new Error('First flight date is required')
    }

    // Check for duplicate rocket name (case-insensitive)
    const allRockets = [...rockets.rockets.value, ...rockets.customRockets.value]
    const isDuplicate = allRockets.some(
      rocket => rocket.name.toLowerCase() === formData.name.trim().toLowerCase()
    )
    if (isDuplicate) {
      throw new Error(`Rocket with name "${formData.name}" already exists`)
    }

    rockets.addCustomRocket(formData)

    snackbarMessage.value = `Rocket "${formData.name}" has been added successfully!`
    snackbarColor.value = 'success'
    snackbar.value = true

    // Close dialog only on success
    addRocketDialogRef.value?.closeAndReset()
  } catch (error) {
    snackbarMessage.value = error instanceof Error ? error.message : 'Failed to add rocket'
    snackbarColor.value = 'error'
    snackbar.value = true
    // Dialog stays open, form data preserved
  }
}
</script>

<template>
  <v-container
    fluid
    class="pa-4 pa-md-6"
  >
    <!-- Header Section -->
    <v-row
      align="center"
      class="mb-6"
    >
      <v-col
        cols="12"
        sm="8"
      >
        <h1 class="text-h4 text-md-h3 font-weight-bold mb-1">
          <v-icon
            icon="mdi-rocket"
            class="mr-2"
          />
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis ma-0">
          Explore the amazing rockets built by SpaceX
        </p>
      </v-col>
      <v-col
        cols="12"
        sm="4"
        class="d-flex justify-sm-end"
      >
        <v-btn
          color="primary"
          size="large"
          @click="showAddDialog = true"
        >
          <v-icon
            icon="mdi-plus"
            start
          />
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search & Filter Card -->
    <v-card
      variant="outlined"
      class="mb-6"
    >
      <v-card-text class="pa-4">
        <!-- Search Row -->
        <v-row
          align="center"
          dense
        >
          <v-col
            cols="12"
            md="6"
            lg="5"
          >
            <v-text-field
              v-model="searchInput"
              placeholder="Search rockets by name, description, or country..."
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              density="comfortable"
              hide-details
              flat
              clearable
              single-line
              @input="handleSearch"
              @click:clear="searchInput = ''; handleSearch()"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            lg="7"
            class="d-flex align-center justify-md-end gap-2 mt-3 mt-md-0"
          >
            <v-btn
              :variant="showFilters ? 'flat' : 'tonal'"
              :color="activeFilterCount > 0 ? 'primary' : undefined"
              @click="showFilters = !showFilters"
            >
              <v-icon
                icon="mdi-filter-variant"
                start
              />
              Filters
              <v-badge
                v-if="activeFilterCount > 0"
                :content="activeFilterCount"
                color="error"
                inline
                class="ml-2"
              />
            </v-btn>
            <v-btn
              v-if="hasActiveFilters"
              variant="text"
              color="error"
              size="small"
              @click="handleClearFilters"
            >
              <v-icon
                icon="mdi-close"
                start
                size="small"
              />
              Clear All
            </v-btn>
          </v-col>
        </v-row>

        <!-- Expandable Filters -->
        <v-expand-transition>
          <div v-show="showFilters">
            <v-divider class="my-4" />
            <v-row dense>
              <v-col
                cols="12"
                sm="4"
              >
                <v-select
                  v-model="companyFilterValue"
                  :items="companyOptions"
                  label="Company"
                  prepend-inner-icon="mdi-domain"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="handleCompanyFilter"
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
              >
                <v-select
                  v-model="countryFilterValue"
                  :items="countryOptions"
                  label="Nationality"
                  prepend-inner-icon="mdi-flag"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="handleCountryFilter"
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
              >
                <v-select
                  v-model="activeFilterValue"
                  :items="activeOptions"
                  label="Status"
                  prepend-inner-icon="mdi-checkbox-marked-circle-outline"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="handleActiveFilter"
                />
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- Results Count -->
    <div
      v-if="rockets.isSuccess.value"
      class="d-flex align-center justify-space-between mb-4"
    >
      <span class="text-body-2 text-medium-emphasis">
        Showing {{ rockets.filteredRockets.value.length }} rocket{{ rockets.filteredRockets.value.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <LoadingState
      v-if="rockets.isLoading.value"
      message="Loading rockets..."
    />

    <ErrorState
      v-else-if="rockets.hasError.value"
      :type="rockets.errorType.value"
      :message="rockets.error.value || undefined"
      @retry="handleRetry"
    />

    <template v-else-if="rockets.isSuccess.value">
      <v-row v-if="rockets.filteredRockets.value.length > 0">
        <v-col
          v-for="rocket in rockets.filteredRockets.value"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
        >
          <RocketCard
            :rocket="rocket"
            @click="handleRocketClick"
          />
        </v-col>
      </v-row>

      <v-row
        v-else
        justify="center"
      >
        <v-col
          cols="12"
          md="6"
          class="text-center py-12"
        >
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="64"
            color="grey"
          />
          <h3 class="text-h6 mt-4 mb-2">
            No rockets found
          </h3>
          <p class="text-body-2 text-medium-emphasis">
            Try adjusting your search or filters, or add a new rocket
          </p>
        </v-col>
      </v-row>
    </template>

    <AddRocketDialog
      ref="addRocketDialogRef"
      v-model="showAddDialog"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="4000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"
          class="mr-2"
        />
        {{ snackbarMessage }}
      </div>
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
