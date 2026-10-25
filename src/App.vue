<template>
  <v-app>
    <v-app-bar
      class="app-bar"
      flat
    >
      <v-container class="d-flex align-center">
        <router-link
          class="brand d-flex align-center ga-3"
          to="/"
          aria-label="Rocket Explorer home"
        >
          <v-icon
            color="primary"
            icon="mdi-rocket-launch"
          />
          <strong>Rocket Explorer</strong>
        </router-link>
        <v-spacer />
        <span class="text-caption text-medium-emphasis d-none d-sm-inline">Launch Library 2</span>
      </v-container>
    </v-app-bar>
    <v-main><router-view /></v-main>
  </v-app>
</template>

<style>
html { background: #f4f6f5; } body { color: #19272c; } .v-application { background: #f4f6f5 !important; }
.app-bar { background: rgba(244, 246, 245, .9) !important; backdrop-filter: blur(14px); border-bottom: 1px solid #dce2e5 !important; }
.brand { color: #19272c; text-decoration: none; letter-spacing: -.01em; }
</style>
