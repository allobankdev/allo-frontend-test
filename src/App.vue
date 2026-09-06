<template>
  <v-app>
    <v-app-bar
      color="surface-variant"
      density="comfortable"
      flat
    >
      <v-app-bar-title>
        <router-link
          to="/"
          class="text-decoration-none text-primary"
        >
          <v-icon
            icon="mdi-rocket-launch"
            class="mr-2"
          />
          Allo SpaceX Rockets
        </router-link>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
