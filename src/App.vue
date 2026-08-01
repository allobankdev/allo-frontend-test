<template>
  <nav>
    <router-link to="/">Home</router-link> | 
    <router-link to="/detail">Detail</router-link>
  </nav>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
