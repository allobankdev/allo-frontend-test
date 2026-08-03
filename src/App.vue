<template>
  <!-- <nav class="navbar">
    <router-link class="nav-link" to="/">Home</router-link> | 
    <router-link class="nav-link" to="/detail">Detail</router-link>
  </nav> -->
  <v-app>
    <v-app-bar>
      <template v-slot:extension>
        <v-tabs>
          <v-tab>
            <router-link class="nav-link" to="/">Home</router-link>
          </v-tab>
          <!-- <v-tab>
            <router-link class="nav-link" to="/detail">Detail</router-link>
          </v-tab> -->
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
