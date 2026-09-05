<template>
  <v-container class="py-8">
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold">
        SpaceX Rockets
      </h1>
      
      <p class="text-medium-emphasis mt-2">
        Explore SpaceX rocket configurations.
      </p>

      <AddRocketForm />

      <RocketSearch
        v-model="rocketStore.searchQuery"
        class="my-6"
      />
    </div>

    <LoadingState v-if="rocketStore.loading" />

    <ErrorState
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="rocketStore.fetchRockets"
    />

    <div v-else>
      <p class="mb-4 text-medium-emphasis">
        {{ rocketStore.filteredRockets.length }} rockets found
      </p>

      <div
        v-if="!rocketStore.filteredRockets.length"
        class="text-center py-12"
      >
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="48"
          class="mb-4"
        />

        <h2 class="text-h6 mb-2">
          No rockets found
        </h2>

        <p class="text-medium-emphasis">
          Try a different search keyword.
        </p>
      </div>

      <v-row v-else>
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'

  import ErrorState from '@/components/ErrorState.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'
  import AddRocketForm from '@/components/AddRocketForm.vue'
  import RocketSearch from '@/components/RocketSearch.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import { useRocketStore } from '@/stores/rocket'

  const rocketStore = useRocketStore()

  onMounted(() => {
    if (!rocketStore.rockets.length) {
      rocketStore.fetchRockets()
    }
  })
</script>