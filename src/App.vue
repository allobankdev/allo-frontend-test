<template>
  <v-app>
    <v-app-bar
      flat
      color="surface"
      density="comfortable"
    >
      <v-btn
        variant="text"
        prepend-icon="mdi-rocket-launch-outline"
        to="/rockets"
      >
        Allo Rockets
      </v-btn>
      <v-spacer />
      <v-btn
        icon="mdi-github"
        href="https://github.com/r-spacex/SpaceX-API"
        target="_blank"
        rel="noreferrer"
        variant="text"
      />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
