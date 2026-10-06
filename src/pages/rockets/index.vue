<!--
  pages/rockets/index.vue  →  /rockets
  Rocket list page: shows all SpaceX rockets fetched from Launch Library 2 API.
  Features: text filter, add new rocket (local only), loading / error / success states.
-->
<template>
  <v-container class="py-8" fluid>
    <!-- Page header -->
    <v-row align="center" class="mb-6">
      <v-col cols="12" sm="auto">
        <div class="d-flex align-center ga-3">
          <v-icon size="36" color="primary">mdi-rocket-launch</v-icon>
          <h1 class="text-h4 font-weight-bold">SpaceX Rockets</h1>
        </div>
      </v-col>

      <v-spacer />

      <v-col cols="12" sm="auto">
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus"
          :disabled="!store.isSuccess"
          @click="showAddDialog = true"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filter bar — only shown when there is data to filter -->
    <v-row v-if="store.isSuccess" class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="store.filterQuery"
          label="Filter rockets"
          placeholder="Search by name..."
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          @update:model-value="store.setFilter($event ?? '')"
          @click:clear="store.setFilter('')"
        />
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center">
        <span class="text-body-2 text-grey">
          {{ store.filteredRockets.length }}
          {{ store.filteredRockets.length === 1 ? 'rocket' : 'rockets' }} found
        </span>
      </v-col>
    </v-row>

    <!-- ── Loading state ──────────────────────────────────────────────── -->
    <LoadingState v-if="store.isLoading" message="Loading rockets..." />

    <!-- ── Error state ────────────────────────────────────────────────── -->
    <ErrorState
      v-else-if="store.isError"
      title="Failed to load rockets."
      :message="store.errorMessage ?? undefined"
      @retry="store.retryLoadRockets()"
    />

    <!-- ── Success state ──────────────────────────────────────────────── -->
    <template v-else-if="store.isSuccess">
      <!-- Empty filter result -->
      <v-row v-if="store.filteredRockets.length === 0">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="48" color="grey-darken-1">mdi-magnify-remove-outline</v-icon>
          <p class="text-body-1 text-grey mt-4">No rockets match your search.</p>
          <v-btn variant="text" class="mt-2" @click="store.setFilter('')">Clear filter</v-btn>
        </v-col>
      </v-row>

      <!-- Rocket grid -->
      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
        >
          <RocketCard :rocket="rocket" @select="goToDetail" />
        </v-col>
      </v-row>
    </template>
  </v-container>

  <!-- Add Rocket dialog -->
  <AddRocketDialog v-model="showAddDialog" @add="onAddRocket" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/rockets/RocketCard.vue'
import LoadingState from '@/components/rockets/LoadingState.vue'
import ErrorState from '@/components/rockets/ErrorState.vue'
import AddRocketDialog from '@/components/rockets/AddRocketDialog.vue'
import type { Rocket } from '@/types/rocket'

const store = useRocketStore()
const router = useRouter()

const showAddDialog = ref(false)

// Fetch rockets when the page is first mounted.
// If data is already in the store (e.g. user navigated back), loadRockets
// is a no-op (it guards against re-fetching on status === 'success').
onMounted(() => {
  store.loadRockets()
})

function goToDetail(id: number) {
  router.push(`/rockets/${id}`)
}

function onAddRocket(
  payload: Pick<Rocket, 'full_name' | 'description' | 'image_url'>
) {
  store.addLocalRocket(payload)
}
</script>
