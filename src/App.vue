<template>
  <v-card>
    <v-layout>
      <NavigationDrawer />
      <v-main class="main-container">
        <v-container>
          <RouterView />
          <GoBackButton class="mb-10" />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
  <Footer />
</template>
<script lang="ts" setup></script>

<style lang="scss" scoped>
.main-container {
  width: 100vw;
  min-height: 100vh;
  padding-inline-start: 4.5rem;
  padding-block-start: 1rem;
}
</style>
