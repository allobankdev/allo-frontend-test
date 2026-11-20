<template>
  <v-container class="py-6">
    <!-- Header: page title and the button that opens the "Add rocket" dialog. -->
    <div class="d-flex flex-wrap align-center ga-4 mb-6">
      <h1 class="text-h4 flex-grow-1">
        SpaceX Rockets
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddDialog = true"
      >
        Add rocket
      </v-btn>
    </div>

    <!-- StateView picks loading / error+retry / content based on store.status. -->
    <StateView
      :error="store.error"
      loading-text="Loading rockets…"
      :status="store.status"
      @retry="store.loadRockets(controller.signal)"
    >
      <RocketFilter
        v-model="store.query"
        class="mb-6"
      />

      <!-- Responsive grid: 1 column on phones, 2 on tablets, 3 on desktop. -->
      <v-row v-if="store.filteredRockets.length">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <!-- The list loaded fine, but the filter matched nothing. -->
      <p
        v-else
        class="text-center text-medium-emphasis py-12"
      >
        No rockets match your filter.
      </p>
    </StateView>

    <AddRocketDialog
      v-model="showAddDialog"
      @submit="store.addRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRocketStore } from '../stores/rocketStore'

  const store = useRocketStore()
  const showAddDialog = ref(false)
  // One controller per page visit; aborting it cancels the in-flight request.
  const controller = new AbortController()

  // Lifecycle: fetch on mount (once: the store keeps the data when the user
  // comes back from the detail screen) and cancel any in-flight request on leave.
  onMounted(() => {
    if (store.status === 'idle' || store.status === 'error') {
      store.loadRockets(controller.signal)
    }
  })

  onBeforeUnmount(() => controller.abort())
</script>
