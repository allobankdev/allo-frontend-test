<template>
  <v-app>
    <v-app-bar
      class="app-bar"
      flat
    >
      <v-container class="d-flex align-center py-0">
        <router-link
          class="brand d-flex align-center ga-3"
          to="/"
        >
          <span class="brand__icon">
            <v-icon size="24">mdi-rocket-launch</v-icon>
          </span>
          <span class="font-weight-bold">SpaceX Explorer</span>
        </router-link>
      </v-container>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>

<style>
html {
  background: #07101f;
}

body {
  min-width: 320px;
}

.v-application {
  background:
    radial-gradient(circle at 15% 15%, rgba(54, 103, 201, 0.18), transparent 30rem),
    radial-gradient(circle at 85% 25%, rgba(56, 198, 184, 0.1), transparent 24rem),
    #07101f !important;
}

.app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  background: rgba(7, 16, 31, 0.82) !important;
  backdrop-filter: blur(16px);
}

.brand {
  color: inherit;
  text-decoration: none;
}

.brand__icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #5c91ff, #3766c9);
  box-shadow: 0 8px 22px rgba(92, 145, 255, 0.3);
}
</style>
