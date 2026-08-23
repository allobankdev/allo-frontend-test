<template>
  <v-container class="py-8" max-width="1280">
    <header class="d-flex flex-wrap justify-space-between align-center mb-6 ga-4">
      <div>
        <h1 class="text-h4 font-weight-bold tracking-tight">SpaceX Rocket Explorer</h1>
        <p class="text-body-2 text-medium-emphasis">
          Browse SpaceX launcher configurations and operational specifications.
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        variant="flat"
        elevation="2"
        @click="isAddModalOpen = true"
      >
        Add Rocket
      </v-btn>
    </header>

    <RocketFilter v-if="!loading && !error" />

    <LoadingState v-if="loading" />

    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="handleRetry"
    />

    <EmptyState
      v-else-if="filteredRockets.length === 0"
      @clear="resetFilters"
    />

    <div v-else>
      <div class="d-flex justify-space-between align-center mb-4">
        <span class="text-caption text-medium-emphasis">
          Showing {{ filteredRockets.length }} of {{ allRockets.length }} rockets
        </span>
      </div>

      <v-row>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </div>

    <AddRocketDialog
      v-model="isAddModalOpen"
      @created="handleRocketAdded"
    />

    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
      location="bottom right"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRockets } from '@/composables/useRockets';
import RocketCard from '@/components/RocketCard.vue';
import RocketFilter from '@/components/RocketFilter.vue';
import AddRocketDialog from '@/components/AddRocketDialog.vue';
import LoadingState from '@/components/LoadingState.vue';
import ErrorState from '@/components/ErrorState.vue';
import EmptyState from '@/components/EmptyState.vue';

const {
  allRockets,
  filteredRockets,
  loading,
  error,
  loadRockets,
  resetFilters,
} = useRockets();

const isAddModalOpen = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');

onMounted(() => {
  loadRockets();
});

function handleRetry() {
  loadRockets(true);
}

function handleRocketAdded() {
  snackbarText.value = 'New rocket successfully added to running app.';
  showSnackbar.value = true;
}
</script>
