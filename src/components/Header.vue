<script setup lang="ts"></script>

<template>
  <v-app-bar density="compact" class="sticky-header py-2">
    <v-container>
      <v-row align="center" justify="space-between" class="flex-wrap">
        <v-col cols="12" md="auto">
          <div class="d-flex align-center ga-3 group">
            <v-avatar size="40" class="logo-avatar">
              <v-icon
                icon="mdi-rocket-launch"
                size="24"
                class="logo-icon text-white"
              />
            </v-avatar>
            <h1 class="logo-text">
              Space<span class="text-blue">X</span> Explorer
            </h1>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(16px);
  background: rgba(11, 13, 23, 0.8);
  border-bottom: 1px solid #1f2937;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.logo-avatar {
  background-color: #2563eb;
  box-shadow: 0 10px 20px rgba(30, 58, 138, 0.4);
  transition: transform 0.3s ease;
}

.group:hover .logo-avatar {
  transform: rotate(12deg);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: white;
  text-transform: uppercase;
  font-style: italic;
}

.text-blue {
  color: #3b82f6;
}

/* Search */
.search-field :deep(.v-field) {
  background: rgba(17, 24, 39, 0.5);
}

/* Filters */
.filter-btn {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  background-color: #1f2937;
  color: #9ca3af;
}

.filter-btn:hover {
  background-color: #374151;
}

.filter-btn.active {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 10px 20px rgba(30, 58, 138, 0.4);
}
</style>
