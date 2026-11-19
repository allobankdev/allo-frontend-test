<template>
  <v-app>
    <v-app-bar
      border
      color="surface"
      elevation="0"
      flat
    >
      <v-container class="app-bar__inner d-flex align-center py-0">
        <RouterLink
          class="app-bar__brand text-decoration-none"
          to="/"
        >
          <v-icon
            class="mr-2"
            color="primary"
            size="22"
          >
            mdi-rocket-launch-outline
          </v-icon>
          <span class="text-subtitle-1 font-weight-bold">SpaceX Rockets</span>
        </RouterLink>
      </v-container>
    </v-app-bar>

    <v-main class="app-main">
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<style scoped>
  .app-bar__inner {
    max-width: 1120px;
  }

  .app-bar__brand {
    display: inline-flex;
    align-items: center;
    color: rgb(var(--v-theme-on-surface));
  }

  .app-main {
    background: rgb(var(--v-theme-background));
  }
</style>
