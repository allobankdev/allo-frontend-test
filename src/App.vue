<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-background">
      <v-container
        fluid
        class="py-6 px-4 px-md-8 max-width-container"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<style scoped>
.max-width-container {
  max-width: 1400px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
