<template>
  <v-app>
    <v-app-bar>
      <v-container class="container">
        <v-app-bar-title>
          <div class="app-name">
            <v-icon class="text-primary">mdi-rocket</v-icon>
            <div>Roketto</div>
          </div>
        </v-app-bar-title>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container class="container">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
.app-name {
  text-decoration: none;
  display: flex;
  align-items: end;
  gap: 0.5rem;
}

.app-name .mdi-rocket {
  transform: rotate(45deg);
}

.container {
  max-width: 1200px !important;
}
</style>
