<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-title
        style="cursor: pointer"
        @click="router.push('/')"
      >
        🚀 SpaceX Rockets
      </v-app-bar-title>
      <v-spacer />
      <v-btn 
        icon 
        :active="route.name === 'RocketList'"
        @click="router.push('/')"
      >
        <v-icon>mdi-rocket</v-icon>
        <v-tooltip 
          activator="parent" 
          location="bottom"
        >
          Rocket List
        </v-tooltip>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        class="pa-4 pa-md-6"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="slide-fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <v-footer
      app
      color="primary"
      class="text-center pa-3"
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-col cols="12">
          <span class="text-white">🚀 SpaceX Rockets Explorer</span>
        </v-col>
        <v-col cols="12">
          <small class="text-white">Using SpaceX API</small>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>