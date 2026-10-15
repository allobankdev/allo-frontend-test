<template>
  <v-container class="py-6">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rocket Explorer
        </h1>
        <p class="text-subtitle-1 text-grey">
          Explore launchers and configurations from Launch Library 2.
        </p>
      </v-col>
    </v-row>

    <!-- Toolbar: Search Filter & Add Button -->
    <v-row class="mb-4 align-center">
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <v-text-field
          v-model="searchQuery"
          label="Search rockets..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          @update:model-value="handleSearchChange"
        />
      </v-col>

      <v-col
        cols="12"
        sm="4"
        md="6"
        class="d-flex justify-sm-end mt-2 mt-sm-0"
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="isAddModalOpen = true"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Feature Component Wrapper -->
    <RocketList
      :rockets="rockets"
      :loading="rocketStore.loading"
      :error="rocketStore.error"
      @retry="() => rocketStore.fetchAllRockets()"
    />

    <!-- Pagination -->
    <v-row
      v-if="totalPages > 1"
      class="mt-6"
    >
      <v-col
        cols="12"
        class="d-flex justify-center"
      >
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          rounded="circle"
          active-color="primary"
          @update:model-value="handlePageChange"
        />
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <RocketAddModal v-model="isAddModalOpen" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRocketStore } from '@/features/rockets/store/rocket.store';
import RocketList from '@/features/rockets/components/RocketList.vue';
import RocketAddModal from '@/features/rockets/components/RocketAddModal.vue';

const route = useRoute();
const router = useRouter();

// Rocket Store
const rocketStore = useRocketStore();

// Local state synced with URL query parameters
const currentPage = ref<number>(Number(route.query.page) || 1);
const pageSize = ref<number>(Number(route.query.pageSize) || 10);
const searchQuery = ref<string>((route.query.search as string) || '');
const isAddModalOpen = ref<boolean>(false);

// Sync local search query to the store's filterQuery
watch(searchQuery, (newVal) => {
  rocketStore.filter.search = newVal;
});

// Computed total pages from store based on filtered data
const totalPages = computed(() => rocketStore.getTotalPages(pageSize.value));

// Computed sliced data for the active pagination page from store
const rockets = computed(() =>
  rocketStore.getPaginatedRockets(currentPage.value, pageSize.value)
);

/**
 * Handle page change event from pagination component
 */
const handlePageChange = (newPage: number) => {
  router.push({
    query: {
      ...route.query,
      page: newPage.toString(),
    },
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Handle search query change with debounce
 */
let searchTimeout: number;
const handleSearchChange = (newSearch: string) => {
  searchQuery.value = newSearch;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    router.push({
      query: {
        ...route.query,
        search: newSearch || undefined,
        page: '1', // Reset to page 1 on filter change
      },
    });
  }, 300);
};

// Sync changes when browser back/forward or URL query changes externally
watch(
  () => route.query,
  (newQuery) => {
    currentPage.value = Number(newQuery.page) || 1;
    pageSize.value = Number(newQuery.pageSize) || 10;
    searchQuery.value = (newQuery.search as string) || '';
  }
);

// Fetch all data once on mount
onMounted(() => {
  rocketStore.filter.search = searchQuery.value;
  rocketStore.fetchAllRockets();
});

// Cancel pending search timeout to prevent memory leaks on unmount
onUnmounted(() => {
  clearTimeout(searchTimeout);
})
</script>
