<template>
  <v-app>
    <v-app-bar
      border="b"
      color="surface"
      flat
    >
      <v-container class="d-flex align-center py-0">
        <router-link
          class="brand d-inline-flex align-center ga-3 text-decoration-none"
          :to="{ name: '/' }"
        >
          <v-avatar
            color="primary"
            rounded="lg"
            size="36"
          >
            <v-icon
              icon="mdi-rocket-launch"
              size="20"
            />
          </v-avatar>
          <span class="text-subtitle-1 font-weight-bold">Rocket Explorer</span>
        </router-link>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.brand {
  color: rgb(var(--v-theme-on-surface));
}
</style>
