<template>
  <v-app-bar
    flat
    color="transparent"
    class="px-2"
  >
    <v-app-bar-title
      class="font-weight-bold"
      style="cursor: pointer; user-select: none;"
      @click="scrollToTop"
    >
      <v-icon
        icon="mdi-rocket-launch"
        color="primary"
        class="mr-2"
      />
      Space<span class="text-primary text-h4 font-italic">X</span> &nbsp;  Rockets
    </v-app-bar-title>
  </v-app-bar>

  <v-container
    fluid
    class="pa-4 pa-md-8"
  >
    <StateOverlay
      v-if="loading || error"
      :loading="loading"
      :error="error"
      loading-text="Loading rockets..."
      @retry="fetchRockets"
    />

    <template v-else>
      <v-row
        class="mb-4"
        align="center"
        no-gutters
      >
        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
        >
          <v-text-field
            v-model="filterQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Filter rockets by name or description..."
            variant="solo-filled"
            rounded="lg"
            density="comfortable"
            hide-details
            clearable
            single-line
          />
        </v-col>
        <v-spacer />
        <v-col
          cols="auto"
          class="mt-4 mt-sm-0"
        >
          <AddRocketDialog @add="onAddRocket" />
        </v-col>
      </v-row>

      <v-row
        v-if="filteredRockets.length === 0"
        justify="center"
        class="py-12"
      >
        <v-col
          cols="12"
          class="text-center"
        >
          <v-icon
            icon="mdi-rocket-outline"
            size="64"
            color="grey-darken-1"
            class="mb-4"
          />
          <div class="text-h6 text-medium-emphasis">
            No rockets found
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Try adjusting your filter
          </div>
        </v-col>
      </v-row>

      <v-row
        v-else
        class="align-stretch"
      >
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex"
        >
          <RocketCard
            :rocket="rocket"
            class="flex-grow-1"
            @click="navigateToDetail(rocket.id)"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'

const router = useRouter()
const { loading, error, filterQuery, filteredRockets, fetchRockets, addRocket } = useRockets()

onMounted(() => {
  fetchRockets()
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function navigateToDetail(id: number) {
  router.push(`/rockets/${id}`)
}

function onAddRocket(rocket: Omit<Rocket, 'id'>) {
  addRocket(rocket)
}
</script>
