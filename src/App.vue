<template>
  <v-app>
    <!-- Top Navigation App Bar -->
    <v-app-bar
      flat
      border
      class="px-md-6"
      color="surface"
    >
      <v-container class="d-flex align-center py-0 px-0 max-width-xl">
        <router-link
          to="/"
          class="d-flex align-center text-decoration-none ga-3"
        >
          <v-avatar
            color="primary"
            size="38"
            class="elevation-2"
          >
            <v-icon
              icon="mdi-rocket-launch"
              color="black"
              size="20"
            />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-high-emphasis lh-1">
              SpaceX Explorer
            </div>
            <div class="text-caption text-primary font-weight-medium lh-1">
              Allo Bank Frontend Technical Assignment
            </div>
          </div>
        </router-link>

        <v-spacer />

        <!-- Candidate Badge & GitHub Link -->
        <div class="d-none d-sm-flex align-center ga-2">
          <v-chip
            size="small"
            variant="tonal"
            color="primary"
            class="font-weight-medium"
          >
            <v-icon
              start
              icon="mdi-account-check"
              size="14"
            />
            Abu Dujanah Siregar
          </v-chip>
          <v-btn
            icon="mdi-github"
            variant="text"
            density="comfortable"
            href="https://github.com/DujanahSr/allo-frontend-test"
            target="_blank"
            title="GitHub Repository"
          />
        </div>
      </v-container>
    </v-app-bar>

    <!-- Main View Content -->
    <v-main class="bg-background">
      <router-view />
    </v-main>

    <!-- Professional Multi-Column Footer (Clean & Enterprise Grade) -->
    <v-footer
      border
      class="bg-surface py-8"
    >
      <v-container class="max-width-xl px-0">
        <v-row class="mb-6">
          <!-- Col 1: Brand & Assignment Info -->
          <v-col
            cols="12"
            md="5"
          >
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon
                icon="mdi-rocket-launch"
                color="primary"
                size="22"
              />
              <span class="text-h6 font-weight-bold">SpaceX Explorer</span>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-3 pr-md-4">
              Aplikasi penjelajah armada roket SpaceX yang dikembangkan untuk Technical Assignment posisi Java Developer (Spring Boot & Vue.js) di Allo Bank.
            </p>
            <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
              <v-icon
                icon="mdi-api"
                size="16"
                color="primary"
              />
              <span>Launch Library 2 API (v2.2.0 Detailed Mode)</span>
            </div>
          </v-col>

          <!-- Col 2: Tech Stack Specifications -->
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-3">
              Spesifikasi Arsitektur
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                size="small"
                variant="outlined"
                color="primary"
              >
                Vue 3 Composition API
              </v-chip>
              <v-chip
                size="small"
                variant="outlined"
              >
                TypeScript
              </v-chip>
              <v-chip
                size="small"
                variant="outlined"
              >
                Pinia Store
              </v-chip>
              <v-chip
                size="small"
                variant="outlined"
              >
                Vuetify 3
              </v-chip>
              <v-chip
                size="small"
                variant="outlined"
              >
                Vue Router
              </v-chip>
              <v-chip
                size="small"
                variant="outlined"
              >
                LocalStorage Sync
              </v-chip>
            </div>
          </v-col>

          <!-- Col 3: Candidate & Links -->
          <v-col
            cols="12"
            sm="6"
            md="3"
          >
            <div class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis mb-3">
              Informasi Kandidat
            </div>
            <div class="text-body-2 mb-1 font-weight-medium">
              Abu Dujanah Siregar
            </div>
            <div class="text-caption text-medium-emphasis mb-3">
              Kandidat Java Developer (Spring Boot & Vue.js)
            </div>
            <v-btn
              variant="tonal"
              color="primary"
              size="small"
              prepend-icon="mdi-github"
              href="https://github.com/DujanahSr/allo-frontend-test"
              target="_blank"
              class="font-weight-medium"
            >
              Repositori GitHub
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="mb-4" />

        <!-- Bottom Copyright & Status -->
        <div class="d-flex flex-column flex-sm-row justify-space-between align-center ga-2 text-caption text-medium-emphasis">
          <div>
            &copy; 2026 <strong>Allo Bank Frontend Technical Assignment</strong>. All rights reserved.
          </div>
          <div class="d-flex align-center ga-1">
            <v-icon
              icon="mdi-shield-check"
              color="success"
              size="16"
            />
            <span>Kepatuhan Standar Clean Code & Type Safety</span>
          </div>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
// Main Layout
</script>

<style scoped>
.max-width-xl {
  max-width: 1240px;
}

.lh-1 {
  line-height: 1.2;
}
</style>
