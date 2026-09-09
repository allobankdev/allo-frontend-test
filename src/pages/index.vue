<template>
  <v-container class="py-6 py-md-8">
    <header class="mb-6">
      <h1 class="text-h5 text-md-h4 font-weight-bold">
        SpaceX Rockets
      </h1>
      <p class="text-body-2 text-medium-emphasis mt-1">
        Browse the SpaceX launcher fleet, powered by the Launch Library 2 API.
      </p>
    </header>

    <RocketFilter
      class="mb-6"
      :result-count="visibleRockets.length"
      :source="data"
    >
      <template #actions>
        <AddRocketDialog @added="onRocketAdded" />
      </template>
    </RocketFilter>

    <StateLoading v-if="isLoading" />

    <StateError
      v-else-if="isError"
      :message="errorMessage"
      title="Couldn't load rockets"
      @retry="refetch"
    />

    <StateEmpty
      v-else-if="isFilteredEmpty"
      icon="mdi-magnify"
      message="No rocket matches the filters you selected."
      title="No rockets found"
    >
      <v-btn
        class="mt-4"
        variant="text"
        @click="store.clearFilter"
      >
        Reset filters
      </v-btn>
    </StateEmpty>

    <StateEmpty
      v-else-if="visibleRockets.length === 0"
      message="Add a rocket to get started."
      title="No rockets yet"
    />

    <v-row v-else>
      <v-col
        v-for="rocket in visibleRockets"
        :key="rocket.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showAddedToast"
      color="success"
      :timeout="3000"
    >
      {{ addedMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { toErrorMessage, useRocketsQuery } from '@/queries/rockets'
  import { useRocketsStore } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'

  const store = useRocketsStore()
  const { data, isPending, isError, error, refetch } = useRocketsQuery()

  const visibleRockets = computed(() => store.filterRockets(data.value))
  const errorMessage = computed(() => toErrorMessage(error.value))

  /** Local rockets are shown immediately, so only a bare list waits on the API. */
  const isLoading = computed(() => isPending.value && store.localRockets.length === 0)

  const isFilteredEmpty = computed(() =>
    store.hasFilter && visibleRockets.value.length === 0,
  )

  const showAddedToast = ref(false)
  const addedMessage = ref('')

  function onRocketAdded (rocket: Rocket) {
    addedMessage.value = `${rocket.name} added to the list.`
    showAddedToast.value = true
    // Stale filters would hide the rocket the user just added.
    store.clearFilter()
  }
</script>
