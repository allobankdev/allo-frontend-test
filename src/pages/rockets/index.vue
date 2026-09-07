<template>
  <div class="rockets-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container class="hero-container">
        <v-row align="center" justify="center">
          <v-col cols="12" lg="10" xl="8">
            <div class="hero-content">
              <div class="hero-badge mb-6">
                <v-chip color="primary" variant="flat" size="small">
                  13 Active Rockets
                </v-chip>
              </div>
              
              <h1 class="hero-title mb-6">
                SpaceX Rocket Fleet
              </h1>
              
              <p class="hero-description mb-10">
                Comprehensive technical specifications and mission history for every operational 
                SpaceX rocket, from the pioneering Falcon 1 through today's Falcon Heavy and Starship.
              </p>
              
              <div class="hero-stats mb-10">
                <div class="stat-item">
                  <div class="stat-value">13</div>
                  <div class="stat-label">Rocket Configs</div>
                </div>
                <div class="stat-divider" />
                <div class="stat-item">
                  <div class="stat-value">100+</div>
                  <div class="stat-label">Successful Launches</div>
                </div>
                <div class="stat-divider" />
                <div class="stat-item">
                  <div class="stat-value">95%</div>
                  <div class="stat-label">Success Rate</div>
                </div>
              </div>

              <div class="hero-actions">
                <v-btn
                  size="x-large"
                  color="primary"
                  variant="flat"
                  class="px-8"
                  @click="scrollToRockets"
                >
                  Browse Fleet
                  <v-icon end>mdi-arrow-down</v-icon>
                </v-btn>
                <v-btn
                  size="x-large"
                  variant="outlined"
                  class="px-8 ml-4"
                  @click="openAddDialog"
                >
                  Add Custom Entry
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      
      <div class="hero-decoration">
        <div class="decoration-circle decoration-1" />
        <div class="decoration-circle decoration-2" />
        <div class="decoration-circle decoration-3" />
      </div>
    </section>

    <v-container id="rockets-list" class="rockets-container">
      <!-- Toolbar -->
      <v-row class="toolbar-row mb-8" justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-text-field
            v-model="store.filterQuery"
            label="Search by name or description"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            hide-details
            density="comfortable"
            bg-color="surface"
            @update:model-value="handleFilterChange"
          />
          <div class="text-center mt-4">
            <span class="text-body-2 text-medium-emphasis">
              {{ store.filteredRockets.length }} rocket{{ store.filteredRockets.length !== 1 ? 's' : '' }} found
            </span>
          </div>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row v-if="store.loading && store.filteredRockets.length === 0" class="mt-8">
        <v-col cols="12" class="text-center py-16">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            width="6"
          />
          <p class="mt-6 text-h6">Loading fleet data...</p>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="store.error && store.filteredRockets.length === 0" class="mt-8">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="80" color="error">mdi-alert-circle-outline</v-icon>
          <p class="mt-6 text-h6">{{ store.error }}</p>
          <v-btn
            color="primary"
            size="large"
            class="mt-6"
            @click="handleRetry"
          >
            Retry Connection
          </v-btn>
        </v-col>
      </v-row>

      <!-- Success State - Rocket Grid -->
      <v-row v-else class="rocket-grid">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="3"
        >
          <v-card
            hover
            class="rocket-card"
            tabindex="0"
            role="button"
            :aria-label="`View details for ${rocket.full_name || rocket.name}`"
            @click="goToDetail(rocket.id)"
            @keydown.enter="goToDetail(rocket.id)"
            @keydown.space.prevent="goToDetail(rocket.id)"
          >
            <div class="rocket-card-image-wrapper">
              <v-img
                :src="rocket.image_url || '/placeholder-rocket.png'"
                height="300"
                cover
                class="rocket-image"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-2"
                    />
                  </v-row>
                </template>
                <template #error>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                    style="background: #2a2a2a"
                  >
                    <v-icon size="80" color="grey-darken-1">mdi-rocket-outline</v-icon>
                  </v-row>
                </template>
              </v-img>
            </div>
            
            <v-card-title class="text-h6 py-4 px-5">
              {{ rocket.full_name || rocket.name }}
            </v-card-title>
            
            <v-card-text class="pb-5 px-5">
              <p class="rocket-description text-body-2">
                {{ rocket.description || 'Technical specifications available in detail view' }}
              </p>
            </v-card-text>

            <v-card-actions class="px-5 pb-5 pt-0">
              <v-chip size="small" variant="tonal" color="primary">
                {{ rocket.manufacturer?.country_code || 'N/A' }}
              </v-chip>
              <v-spacer />
              <v-btn
                size="small"
                variant="text"
                append-icon="mdi-arrow-right"
              >
                Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Empty State -->
        <v-col v-if="store.filteredRockets.length === 0" cols="12" class="text-center py-16">
          <v-icon size="80" color="grey">mdi-rocket-launch-outline</v-icon>
          <p class="mt-6 text-h6">No rockets match your search</p>
          <p class="text-body-2 text-medium-emphasis mt-2">Try adjusting your filters</p>
          <v-btn
            variant="text"
            class="mt-4"
            @click="store.setFilterQuery('')"
          >
            Clear Search
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Add Rocket Dialog -->
    <v-dialog v-model="addDialog" max-width="700">
      <v-card>
        <v-card-title class="text-h5 pa-6 bg-surface-variant">
          Add Custom Rocket
        </v-card-title>
        
        <v-card-text class="px-6 py-6">
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-6"
          >
            Custom entries are stored locally and will not persist after refresh
          </v-alert>

          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.name"
                  label="Rocket Name *"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.full_name"
                  label="Full Designation *"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="newRocket.description"
                  label="Technical Description *"
                  variant="outlined"
                  :rules="[rules.required]"
                  rows="4"
                />
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model="newRocket.image_url"
                  label="Image URL *"
                  variant="outlined"
                  :rules="[rules.required]"
                  hint="Direct link to rocket image"
                  persistent-hint
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.launch_cost"
                  label="Launch Cost"
                  variant="outlined"
                  placeholder="e.g., $62 million"
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.manufacturer_country"
                  label="Country Code *"
                  variant="outlined"
                  :rules="[rules.required]"
                  placeholder="e.g., USA"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRocket.maiden_flight"
                  label="First Flight Date"
                  variant="outlined"
                  type="date"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            variant="text"
            size="large"
            @click="closeAddDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            size="large"
            @click="handleSubmit"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import type { NewRocket } from '@/types/rocket'

const router = useRouter()
const store = useRocketStore()

const addDialog = ref(false)
const form = ref<any>(null)

const newRocket = ref({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  manufacturer_country: '',
  maiden_flight: '',
})

const rules = {
  required: (v: string) => !!v || 'This field is required',
}

onMounted(() => {
  if (store.allRockets.length === 0) {
    store.fetchRockets()
  }
})

function scrollToRockets() {
  const element = document.getElementById('rockets-list')
  element?.scrollIntoView({ behavior: 'smooth' })
}

function handleFilterChange(value: string) {
  store.setFilterQuery(value || '')
}

function handleRetry() {
  store.clearError()
  store.fetchRockets()
}

function goToDetail(id: number) {
  router.push(`/rockets/${id}`)
}

function openAddDialog() {
  addDialog.value = true
}

function closeAddDialog() {
  addDialog.value = false
  resetForm()
}

function resetForm() {
  newRocket.value = {
    name: '',
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    manufacturer_country: '',
    maiden_flight: '',
  }
  if (form.value) {
    form.value.reset()
  }
}

async function handleSubmit() {
  if (!form.value) return
  
  const { valid } = await form.value.validate()
  
  if (valid) {
    const customRocket: NewRocket = {
      id: Date.now(),
      name: newRocket.value.name,
      full_name: newRocket.value.full_name,
      description: newRocket.value.description,
      image_url: newRocket.value.image_url,
      launch_cost: newRocket.value.launch_cost,
      maiden_flight: newRocket.value.maiden_flight,
      manufacturer: {
        id: Date.now(),
        name: 'Custom',
        country_code: newRocket.value.manufacturer_country,
      },
    }
    
    store.addCustomRocket(customRocket)
    closeAddDialog()
  }
}
</script>

<style scoped>
.rockets-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #1a237e 0%, #4527a0 50%, #6a1b9a 100%);
  padding: 120px 0 140px;
  overflow: hidden;
}

.hero-container {
  position: relative;
  z-index: 2;
}

.hero-content {
  text-align: center;
}

.hero-badge {
  display: inline-block;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 700;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-description {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  color: rgba(255, 255, 255, 0.85);
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
}

.decoration-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -200px;
}

.decoration-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -100px;
}

.decoration-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
}

/* Rockets Container */
.rockets-container {
  margin-top: -100px;
  position: relative;
  z-index: 3;
  padding-bottom: 80px;
}

.toolbar-row {
  margin-bottom: 2rem;
}

/* Rocket Cards */
.rocket-grid {
  margin-top: 2rem;
}

.rocket-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}

.rocket-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.rocket-card:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.rocket-card-image-wrapper {
  position: relative;
  overflow: hidden;
}

.rocket-image {
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
  transition: transform 0.3s ease;
}

.rocket-card:hover .rocket-image {
  transform: scale(1.05);
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
  min-height: 4.8em;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

/* Responsive */
@media (max-width: 960px) {
  .hero-section {
    padding: 80px 0 100px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.125rem;
  }

  .stat-divider {
    display: none;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .hero-actions .v-btn {
    width: 100%;
    max-width: 400px;
    margin-left: 0 !important;
  }

  .rockets-container {
    margin-top: -80px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 60px 0 80px;
  }
  
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .rockets-container {
    margin-top: -60px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
