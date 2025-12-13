<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4">SpaceX</h1>

        <div class="d-flex flex-wrap gap-2 mb-6">
          <v-btn color="success" prepend-icon="mdi-plus" @click="openAddDialog">
            Add New Rocket
          </v-btn>
        </div>

        <v-card class="mb-6">
          <v-card-title>Filters</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchName"
                  label="Search by name"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterStatus"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn block color="primary" @click="clearFilters">Clear Filters</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <LoadingState v-if="isLoading" message="Loading..." />

    <ErrorState v-else-if="isError" :message="errorMessage" />

    <v-row v-else-if="rockets.length > 0">
      <v-col v-for="rocket in rockets" :key="rocket.id" cols="12" md="6" lg="4">
        <v-card class="h-100">
          <v-img
            v-if="rocket.flickrImages.length > 0"
            :src="rocket.flickrImages[0]"
            height="200"
            cover
          >
            <v-chip :color="rocket.isActive ? 'success' : 'error'" class="ma-2" size="small">
              {{ rocket.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </v-img>

          <v-card-title>{{ rocket.name }}</v-card-title>

          <v-card-text>
            <p class="text-body-2">{{ rocket.description }}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn :to="`/rockets/${rocket.id}`" variant="text" color="primary">View Detail</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <EmptyState />
    </v-row>

    <RocketDialog v-model="dialogRef" @submit="handleAddRocket" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import LoadingState from '@/components/LoadingState.vue';
import ErrorState from '@/components/ErrorState.vue';
import type { QueryOptions } from '@/core/repositories/rocket.repository';
import { RocketRepositorySpaceX } from '@/data/rocket/rocket.repository.spacex';
import EmptyState from './components/EmptyState.vue';
import RocketDialog from './components/RocketFormDialog.vue';
import { DEBOUNCE_DELAY } from './constants/rocket.constant';

const repository = new RocketRepositorySpaceX();
const store = useStore();

const searchName = ref('');
const filterStatus = ref('all');
const statusOptions = [
  { title: 'All', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
];

const dialogRef = ref(false);

const rockets = computed(() => store.getters['rocketList/rockets']);
const isLoading = computed(() => store.getters['rocketList/isLoading']);
const isError = computed(() => store.getters['rocketList/isError']);
const errorMessage = computed(() => store.getters['rocketList/errorMessage']);

const buildQueryOptions = (): QueryOptions => {
  const query: Record<string, any> = {};

  if (searchName.value) {
    query.name = {
      $regex: searchName.value,
      $options: 'i',
    };
  }

  if (filterStatus.value === 'active') {
    query.active = true;
  } else if (filterStatus.value === 'inactive') {
    query.active = false;
  }

  return {
    query,
    options: {
      sort: { name: 1 },
    },
  };
};

const loadRockets = async () => {
  store.dispatch('rocketList/markAsLoading');

  try {
    const queryOptions = buildQueryOptions();
    const data = await repository.fetchAll(queryOptions);
    store.dispatch('rocketList/loadRockets', data.docs);
    store.dispatch('rocketList/markAsSuccess');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load rockets';
    store.dispatch('rocketList/markAsError', message);
  }
};

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchName, () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    loadRockets();
  }, DEBOUNCE_DELAY);
});

watch(filterStatus, () => {
  loadRockets();
});

const clearFilters = () => {
  searchName.value = '';
  filterStatus.value = 'all';
};

const openAddDialog = () => {
  dialogRef.value = true;
};

const handleAddRocket = () => {
  console.log('Added new rocket');
};

onMounted(() => {
  loadRockets();
});
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
