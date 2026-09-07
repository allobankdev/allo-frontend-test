<template>
  <v-app>
    <v-app-bar elevation="0" color="surface" height="72">
      <v-container class="d-flex align-center px-4">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">mdi-rocket-launch</v-icon>
          <span class="text-h5 font-weight-medium d-none d-sm-inline">SpaceX Fleet</span>
          <span class="text-h6 font-weight-medium d-inline d-sm-none">SpaceX</span>
        </div>
        <v-spacer />
        <v-btn
          variant="text"
          prepend-icon="mdi-github"
          href="https://github.com"
          target="_blank"
          class="d-none d-sm-inline-flex"
        >
          Source
        </v-btn>
        <v-btn
          icon="mdi-github"
          variant="text"
          href="https://github.com"
          target="_blank"
          class="d-inline-flex d-sm-none"
        />
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <v-footer class="mt-16 py-8" color="surface-variant">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="text-center text-md-left">
            <div class="d-flex align-center justify-center justify-md-start mb-3">
              <v-icon size="28" color="primary" class="mr-2">mdi-rocket-launch</v-icon>
              <span class="text-h6">SpaceX Fleet</span>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Data provided by Launch Library 2 API
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <p class="text-body-2 text-medium-emphasis mb-2">
              Built with Vue 3, TypeScript, and Vuetify
            </p>
            <p class="text-caption text-medium-emphasis mb-0">
              © {{ new Date().getFullYear() }} · Allo Bank Technical Assessment
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
