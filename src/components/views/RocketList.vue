<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRocketStore } from '../../stores/userRocketStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const rocketStore = useRocketStore()

onMounted(() => {
  rocketStore.fetchRockets()
})
const loading = rocketStore.loading
const error = rocketStore.error
const showModal = ref(false)
const showAdd = ref(false)
const search = ref('')
const filters = ref<{ from?: Date; to?: Date; status: string }>({ status: '' })

const searchLaunches = computed(() =>
  rocketStore.rockets.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const filteredLaunches = computed(() => {
  return rocketStore.rockets.filter(l => {
    const launchDate = new Date(l.date_utc)

    const fromDateMatch = !filters.value.from || launchDate >= filters.value.from
    const toDateMatch = !filters.value.to || launchDate <= filters.value.to

    const statusMatch =
      !filters.value.status
        ? true
        : filters.value.status === 'successful'
        ? l.success === true
        : l.success === false

    const searchMatch = l.name.toLowerCase().includes(search.value.toLowerCase())

    return fromDateMatch && toDateMatch && statusMatch && searchMatch
  })
})

const applyFilters = (f: { from?: Date; to?: Date; status: string }) => {
  filters.value = f
}

const addNewPopup = () => {
  showAdd.value = true
  router.push({
    name: 'RocketAdd'
  })
}
const closeNewPopup = () => {
  showAdd.value = false
}

const openModal = (launch : typeof rocketStore.rockets[number]) => {
  rocketStore.selectedRocket = launch
  showModal.value = true
  router.push({
    name: 'RocketDetail',
    params: { id: rocketStore.selectedRocket.id }
  })
}

const closeModal = () => {
  showModal.value = false
  rocketStore.selectedRocket = null
}

const refreshPage = () => {
  window.location.reload();
};
</script>

<template>
  <div class="rocket-list">
    <h1>SpaceX Rocket Launches</h1>
    <LaunchFilter v-model="search" class="search-box" @apply="applyFilters"/>

    <div>
      <button class="button-add" @click="addNewPopup">+</button>
      <LaunchAdd 
        :show="showAdd"
        @close="closeNewPopup"
      />
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">
      <p class="no-results">Error Occurred, Please Retry</p>
      <div class="retry-box">
        <button class="retry-btn" @click="refreshPage">Retry</button>
      </div>
    </div>

    <div v-else-if="!loading && rocketStore.rockets.length === 0">
      <p class="no-results">No Data</p>
      <div class="retry-box">
        <button class="retry-btn" @click="refreshPage">Refresh</button>
      </div>
    </div>

    <div v-else>
      <div v-if="search && searchLaunches.length === 0">
        <p class="no-results">Nothing is found</p>
      </div>

      <div v-else>
        <h2 class="header-title">{{ search ? 'Search Results' : 'All Rocket Launches' }}</h2>

        <div class="launch-grid" v-if="rocketStore.rockets">
          <LaunchCard
            v-for="launch in search ? searchLaunches : filteredLaunches.length ? filteredLaunches : rocketStore.rockets"
            :key="launch.id"
            :launch="launch"
            @open="openModal"
          />
        </div>
      </div>
    </div>

    <LaunchModal
      :show="showModal"
      :launch="rocketStore.selectedRocket"
      @close="closeModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.rocket-list {
  width: 100%;
  border-radius: 16px;
  padding: 20px;

  .header-title {
    margin-top: 20px;
  }

  .launch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  button {
    margin-top: 10px;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
  }

  button.active {
    background: lightslategray;
  }
  
  .button-add {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: dimgray;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    color: white;
    font-size: 28px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: 0.2s ease;
    z-index: 9999;
  }

  .button-add:hover {
    transform: scale(1.1);
    background:gray;
  }

  .search-box {
    margin-top: 20px;
  }

  .no-results {
    margin-top: 20px;
    text-align: center;
  }

 .retry-box {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }

  .retry-btn {
    background: dimgray;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: 0.2s ease;
  }

  .retry-btn:hover {
    background: gray;
    transform: scale(1.05);
  }
}
</style>
