<template>
  <v-app class="app-root">
    <!-- Clean Minimalist Header Bar -->
    <v-app-bar
      flat
      color="surface"
      density="comfortable"
      class="nav-bar px-2"
    >
      <v-container class="d-flex align-center py-0 px-4 max-w-1200">
        <router-link to="/" class="d-flex align-center text-decoration-none brand-link">
          <div class="brand-badge mr-3">
            <v-icon icon="mdi-rocket-launch" color="white" size="18" />
          </div>
          <div>
            <span class="text-subtitle-1 font-weight-bold text-slate-900 line-height-1">Allo Space</span>
            <span class="text-caption text-slate-500 d-block">SpaceX Fleet Catalog</span>
          </div>
        </router-link>

        <v-spacer />

        <div class="d-flex align-center ga-2">
          <v-btn
            to="/"
            variant="text"
            rounded="lg"
            size="small"
            class="text-none font-weight-medium text-slate-700"
          >
            Rockets
          </v-btn>

          <v-btn
            icon="mdi-github"
            variant="text"
            size="small"
            href="https://github.com/cikinodapz/allo-frontend-test"
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-500"
          />
        </div>
      </v-container>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="bg-slate-50 main-wrapper">
      <router-view />
    </v-main>

    <!-- Minimalist Footer -->
    <footer class="app-footer py-6 text-center text-caption text-slate-500">
      <v-container class="max-w-1200">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-center ga-2">
          <div>
            &copy; 2026 Allo Bank Frontend Assignment &bull; Built with Vue 3 & Vuetify
          </div>
          <div>
            Data sourced via <a href="https://thespacedevs.com/llapi" target="_blank" rel="noopener noreferrer" class="footer-link">Launch Library 2 API</a>
          </div>
        </div>
      </v-container>
    </footer>
  </v-app>
</template>

<script lang="ts" setup>
// Minimalist clean light layout
</script>

<style>
/* Global minimalist typography & reset */
.app-root {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #0f172a;
}

.max-w-1200 {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.bg-slate-50 {
  background-color: #f8fafc !important;
}

.text-slate-900 {
  color: #0f172a !important;
}

.text-slate-700 {
  color: #334155 !important;
}

.text-slate-500 {
  color: #64748b !important;
}

.text-slate-400 {
  color: #94a3b8 !important;
}
</style>

<style scoped>
.nav-bar {
  border-bottom: 1px solid #e2e8f0 !important;
  background-color: #ffffff !important;
}

.brand-badge {
  width: 32px;
  height: 32px;
  background: #0f172a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-link {
  color: inherit;
}

.main-wrapper {
  min-height: calc(100vh - 120px);
}

.app-footer {
  border-top: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.footer-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

.line-height-1 {
  line-height: 1.2;
}
</style>
