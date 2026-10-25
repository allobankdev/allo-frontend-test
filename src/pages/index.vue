<template>
  <v-container
    class="py-6 px-4 px-md-8"
    fluid
  >
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-4">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1 mb-0">
          Every SpaceX launch vehicle, live from the Launch Library 2 API.
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
        @click="isDialogOpen = true"
      >
        Add rocket
      </v-btn>
    </div>

    <RocketFilterBar
      v-if="store.status === 'success'"
      class="mb-4"
    />

    <!-- Loading state -->
    <v-row v-if="store.status === 'loading' || store.status === 'idle'">
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <!-- Fail / retry state -->
    <ErrorState
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.loadRockets()"
    />

    <!-- Success state -->
    <template v-else>
      <div class="text-body-2 text-medium-emphasis mb-2">
        {{ store.filteredRockets.length }} rocket{{ store.filteredRockets.length === 1 ? '' : 's' }}
      </div>

      <v-row v-if="store.filteredRockets.length">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <EmptyState
        v-else
        action-label="Clear filters"
        message="Try a different search term or clear your filters."
        @action="store.resetFilters()"
      />
    </template>

    <RocketFormDialog
      v-model="isDialogOpen"
      @added="handleRocketAdded"
    />

    <v-snackbar
      v-model="showSnackbar"
      color="success"
      :timeout="3000"
    >
      <v-icon
        class="mr-2"
        icon="mdi-check-circle-outline"
      />
      "{{ addedRocketName }}" was added to the list.
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import EmptyState from '@/components/common/EmptyState.vue'
  import ErrorState from '@/components/common/ErrorState.vue'
  import RocketCard from '@/components/rockets/RocketCard.vue'
  import RocketFilterBar from '@/components/rockets/RocketFilterBar.vue'
  import RocketFormDialog from '@/components/rockets/RocketFormDialog.vue'
  import { useDocumentTitle } from '@/composables/useDocumentTitle'
  import { useRocketStore } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'

  const store = useRocketStore()

  useDocumentTitle('SpaceX Rockets')

  onMounted(() => {
    if (store.status === 'idle') store.loadRockets()
  })

  const isDialogOpen = ref(false)
  const showSnackbar = ref(false)
  const addedRocketName = ref('')

  function handleRocketAdded (rocket: Rocket) {
    addedRocketName.value = rocket.fullName
    showSnackbar.value = true
  }
</script>
