<template>
  <v-card>
    <v-layout>
      <navigation-drawer />
      <v-main class="main-container">
        <v-container>
          <filter-custom />
          <RouterView />
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
