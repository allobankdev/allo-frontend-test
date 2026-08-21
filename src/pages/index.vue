<template>
  <div class="rocket-list-page">
    <AppNavigationBar
      title="SpaceX Rockets"
      :large-title="true"
      :show-add="true"
      @add="showAddDialog = true"
    />

    <v-container class="hig-container pt-2">
      <RocketFilterBar class="mb-4" />

      <LoadingState v-if="store.status === 'loading'" :count="8" />

      <ErrorState
        v-else-if="store.status === 'error'"
        :message="store.errorMessage"
        @retry="store.fetchRockets()"
      />

      <EmptyState
        v-else-if="store.status === 'success' && store.filteredRockets.length === 0"
        icon="mdi-magnify"
        title="No rockets found"
        subtitle="Try a different search term"
        :show-clear-action="!!store.filterQuery"
        @clear="store.filterQuery = ''"
      />

      <v-row v-else-if="store.status === 'success'" class="hig-grid" align="stretch">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex"
        >
          <RocketCard :rocket="rocket" class="w-100" />
        </v-col>
      </v-row>
    </v-container>

    <AddRocketDialog v-model="showAddDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import AppNavigationBar from '@/components/common/AppNavigationBar.vue'
import RocketFilterBar from '@/components/rocket/RocketFilterBar.vue'
import RocketCard from '@/components/rocket/RocketCard.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AddRocketDialog from '@/components/rocket/AddRocketDialog.vue'

const store = useRocketStore()
const showAddDialog = ref(false)

onMounted(() => {
  if (store.status === 'idle') store.fetchRockets()
})
</script>

<style scoped>
.rocket-list-page {
  min-height: 100vh;
  background: var(--hig-bg-primary);
  font-family: var(--hig-font-stack);
}

.hig-container {
  padding-left: var(--hig-space-md) !important;
  padding-right: var(--hig-space-md) !important;
  max-width: 1280px;
}

@media (min-width: 600px) {
  .hig-container {
    padding-left: var(--hig-space-lg) !important;
    padding-right: var(--hig-space-lg) !important;
  }
}

@media (min-width: 960px) {
  .hig-container {
    padding-left: var(--hig-space-xl) !important;
    padding-right: var(--hig-space-xl) !important;
  }
}

.hig-grid {
  margin: calc(var(--hig-space-md) * -0.5) !important;
}

.hig-grid :deep(.v-col) {
  padding: calc(var(--hig-space-md) * 0.5) !important;
  display: flex !important;
}
</style>
