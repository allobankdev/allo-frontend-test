<template>
  <v-app>
    <!-- App Navigation Bar -->
    <v-app-bar
      elevation="1"
      border
      color="surface"
    >
      <v-container
        fluid
        class="d-flex align-center py-0 px-4 px-md-6"
      >
        <router-link
          to="/"
          class="d-flex align-center text-decoration-none text-high-emphasis"
        >
          <v-avatar
            color="primary"
            size="36"
            class="mr-3"
          >
            <v-icon
              icon="mdi-rocket"
              color="white"
              size="20"
            />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold lh-tight">
              Allo SpaceX
            </div>
            <div class="text-caption text-medium-emphasis lh-tight">
              Rocket Explorer
            </div>
          </div>
        </router-link>

        <v-spacer />

        <v-btn
          to="/"
          variant="text"
          class="text-none font-weight-medium mr-2"
          prepend-icon="mdi-home-outline"
        >
          Fleet
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="bg-background">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style scoped>
.lh-tight {
  line-height: 1.2;
}
</style>
