<template>
  <v-app-bar
    color="surface"
    elevation="1"
  >
    <v-container class="d-flex align-center">
      <v-btn
        icon="mdi-rocket-launch"
        variant="text"
        to="/"
      />

      <v-app-bar-title class="font-weight-bold">
        SpaceX Rockets
      </v-app-bar-title>

      <v-spacer />

      <v-btn
        to="/"
        variant="text"
      >
        Rockets
      </v-btn>
    </v-container>
  </v-app-bar>
</template>