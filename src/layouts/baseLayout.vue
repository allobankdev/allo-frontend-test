<template>
  <v-app>
    <v-app-bar
      color="primary"
    >
      <v-container>
        <v-toolbar-title class="text-center">
          <router-link
            to="/"
            class="text-white text-decoration-none"
          >
            Rocket App
          </router-link>
        </v-toolbar-title>
      </v-container>
    </v-app-bar>

    <v-main
      min-height="80vh"
      class="flex-1"
    >
      <router-view />
    </v-main>

    <v-footer
      color="primary"
      class="text-center text-white"
      style="flex: 0; height: 60px;"
    >
      <v-container>
        © {{ new Date().getFullYear() }} Rocket App - All Rights Reserved
      </v-container>
    </v-footer>
  </v-app>
</template>