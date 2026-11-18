<template>
  <v-app>
    <v-app-bar
      flat
      border
      color="surface"
    >
      <v-icon
        icon="mdi-rocket-launch"
        color="primary"
        class="ms-4 me-2"
      />
      <v-app-bar-title>
        <router-link
          to="/"
          class="text-decoration-none text-high-emphasis font-weight-bold"
        >
          SpaceX Explorer
        </router-link>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <AppToaster />
  </v-app>
</template>