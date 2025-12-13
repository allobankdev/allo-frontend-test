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

        <RocketFilter
          v-model:search-name="searchName"
          v-model:filter-status="filterStatus"
          :status-options="statusOptions"
          @clear="clearFilters"
        />
      </v-col>
    </v-row>

    <LoadingState v-if="isLoading" message="Loading..." />

    <ErrorState v-else-if="isError" :message="errorMessage" />

    <v-row v-else-if="hasRockets">
      <v-col v-for="rocket in rockets" :key="rocket.id" cols="12" md="6" lg="4">
        <RocketCard :rocket="rocket" />
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
import RocketCard from './components/RocketCard.vue';
import RocketFilter from './components/RocketFilter.vue';
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
const hasRockets = computed(() => rockets.value.length > 0);

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
