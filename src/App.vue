<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-container class="d-flex align-center">
        <v-app-bar-title>
          <router-link
            to="/"
            class="text-white text-decoration-none font-weight-bold"
          >
            Allo Bank — SpaceX Fleet
          </router-link>
        </v-app-bar-title>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>
