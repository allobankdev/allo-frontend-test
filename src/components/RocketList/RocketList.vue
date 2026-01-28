<template>
  <div class="rocket-list">
    <div class="header-section">
      <h1 class="header">
        Rocket List
      </h1>
      <v-btn
        color="primary"
        class="add-btn"
        @click="openAddModal"
      >
        Add New Rocket
      </v-btn>
    </div>

    <div class="filter-section">
      <v-text-field
        v-model="searchQuery"
        label="Search rockets..."
        placeholder="Filter by name or description"
        clearable
        density="compact"
      />
    </div>

    <div
      v-if="rocketStore.loading"
      class="loading-container"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
      <p class="loading-text">
        Loading rockets...
      </p>
    </div>

    <div
      v-else-if="rocketStore.error"
      class="error-container"
    >
      <v-alert
        type="error"
        :text="rocketStore.error"
        class="error-alert"
      >
        <template #append>
          <v-btn @click="rocketStore.retry">
            Retry
          </v-btn>
        </template>
      </v-alert>
    </div>

    <div
      v-else
      class="rockets-grid"
    >
      <div
        v-if="rocketStore.allRockets.length === 0"
        class="empty-state"
      >
        <p>No rockets found. Try adjusting your search or add a new rocket!</p>
      </div>
      <div
        v-for="rocket in rocketStore.allRockets"
        :key="rocket.id"
        class="rocket-card"
        @click="goToDetail(rocket.id)"
      >
        <div class="rocket-image">
          <img
            v-if="rocket.flickr_images && rocket.flickr_images.length > 0"
            :src="rocket.flickr_images[0]"
            :alt="rocket.name"
            class="image"
          >
          <div
            v-else
            class="placeholder"
          >
            <v-icon size="48">
              mdi-rocket
            </v-icon>
          </div>
        </div>
        <div class="rocket-info">
          <h2 class="rocket-name">
            {{ rocket.name }}
          </h2>
          <p class="rocket-description">
            {{ rocket.description }}
          </p>
          <div class="rocket-meta">
            <span class="badge">{{ rocket.type }}</span>
            <span class="badge">{{ rocket.country }}</span>
          </div>
        </div>
      </div>
    </div>

    <AddRocketModal
      v-model="showAddModal"
      @submit="handleAddRocket"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRocketStore, type Rocket } from '@/stores/rocketStore'
import AddRocketModal from './AddRocketModal.vue'
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const rocketStore = useRocketStore()
const router = useRouter()

const searchQuery = ref('')
const showAddModal = ref(false)

onMounted(() => {
  rocketStore.loadRockets()
})

watch(searchQuery, (newValue) => {
  rocketStore.setFilterQuery(newValue)
})

const openAddModal = () => {
  showAddModal.value = true
}

const handleAddRocket = (rocket: Rocket) => {
  rocketStore.addRocket(rocket)
}

const goToDetail = (rocketId: string) => {
  router.push(`/rocket/${rocketId}`)
}
</script>

<style scoped>
.rocket-list {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.add-btn {
  padding: 8px 16px;
}

.filter-section {
  margin-bottom: 24px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 16px;
}

.loading-text {
  font-size: 16px;
  color: #666;
}

.error-container {
  padding: 24px;
}

.error-alert {
  margin-bottom: 0;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #666;
  font-size: 16px;
}

.rockets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.rocket-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.rocket-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.rocket-image {
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.rocket-info {
  padding: 16px;
}

.rocket-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.rocket-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rocket-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  background: #f0f0f0;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .add-btn {
    width: 100%;
  }

  .rockets-grid {
    grid-template-columns: 1fr;
  }

  .header {
    font-size: 24px;
  }
}
</style>
