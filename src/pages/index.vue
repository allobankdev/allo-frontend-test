<template>
  <div class="catalogue-page">
    <v-container class="py-10 py-md-14">
      <!-- Header -->
      <header class="catalogue-header mb-10">
        <div class="d-flex align-center ga-2 mb-4">
          <v-icon
            icon="mdi-rocket-launch"
            color="primary"
            size="small"
          />
          <span class="text-overline font-weight-bold text-primary">
            SPACE EXPLORATION
          </span>
        </div>

        <div
          class="d-flex flex-column flex-md-row justify-space-between align-md-end ga-6"
        >
          <div class="catalogue-intro">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-3">
              Rocket Catalogue
            </h1>

            <p class="text-body-1 text-medium-emphasis">
              Explore SpaceX launch vehicles and discover the technology behind
              every mission.
            </p>
          </div>

          <RocketFormDialog @add="addRocket" />
        </div>
      </header>

      <!-- Search and result count -->
      <section class="mb-8">
        <div
          class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-5"
        >
          <RocketFilter v-model="searchQuery" />

          <span
            v-if="rockets.length > 0"
            class="text-body-2 text-medium-emphasis"
          >
            {{ filteredRockets.length }} rocket(s) found
          </span>
        </div>

        <!-- Loading -->
        <div
          v-if="loading && rockets.length === 0"
          class="state-container"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
            width="4"
          />
          <p class="text-body-1 text-medium-emphasis mt-4">
            Loading rocket catalogue...
          </p>
        </div>

        <!-- Error -->
        <v-alert
          v-else-if="error && rockets.length === 0"
          type="error"
          variant="tonal"
          rounded="lg"
          class="mb-6"
        >
          <div class="font-weight-bold mb-1">
            Unable to load rockets
          </div>

          <div class="text-body-2 mb-3">
            {{ error }}
          </div>

          <v-btn
            color="error"
            variant="flat"
            size="small"
            prepend-icon="mdi-refresh"
            @click="fetchRockets(true)"
          >
            Try Again
          </v-btn>
        </v-alert>

        <!-- Rocket cards -->
        <template v-else>
          <div v-if="filteredRockets.length > 0">
            <v-row>
              <v-col
                v-for="rocket in filteredRockets"
                :key="rocket.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <RocketCard :rocket="rocket" />
              </v-col>
            </v-row>
          </div>

          <!-- Empty search result -->
          <div
            v-else
            class="state-container"
          >
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="56"
              color="medium-emphasis"
            />

            <h2 class="text-h6 font-weight-bold mt-4">
              No rockets found
            </h2>

            <p class="text-body-2 text-medium-emphasis mt-2">
              Try another search term or add a custom rocket.
            </p>

            <v-btn
              variant="text"
              color="primary"
              class="mt-3"
              @click="searchQuery = ''"
            >
              Clear Search
            </v-btn>
          </div>
        </template>

        <!-- Background refresh indicator -->
        <v-progress-linear
          v-if="loading && rockets.length > 0"
          indeterminate
          color="primary"
          class="mt-5"
        />

        <v-alert
          v-if="error && rockets.length > 0"
          type="warning"
          variant="tonal"
          rounded="lg"
          class="mt-5"
        >
          <div class="text-body-2 mb-3">
            Unable to refresh rocket data: {{ error }}
          </div>

          <v-btn
            color="warning"
            variant="flat"
            size="small"
            prepend-icon="mdi-refresh"
            @click="fetchRockets(true)"
          >
            Try Again
          </v-btn>
        </v-alert>
      </section>

      <footer class="catalogue-footer text-center pt-8">
        <v-divider class="mb-6" />

        <p class="text-caption text-medium-emphasis">
          Rocket data provided by Launch Library 2
        </p>
      </footer>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";
import RocketFormDialog from "@/components/RocketFormDialog.vue";
import { useRockets } from "@/composables/useRockets";

const {
  rockets,
  filteredRockets,
  loading,
  error,
  searchQuery,
  fetchRockets,
  addRocket,
} = useRockets();

onMounted(() => {
  fetchRockets();
});
</script>

<style scoped>
.catalogue-page {
  min-height: 100vh;
  background: #fafbfc;
}

.catalogue-intro {
  max-width: 720px;
}

.catalogue-intro h1 {
  letter-spacing: -1.5px;
}

.state-container {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
</style>
