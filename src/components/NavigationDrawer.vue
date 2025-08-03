<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMRrjxgNg8qaHqoQ5JBf_7o23NgV3pa-tunQ&s"
        title="SpaceX"
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <template
        v-for="({ url, title, icon }, index) in navigationItems"
        :key="index"
      >
        <router-link :to="url" class="text-decoration-none text-white">
          <v-list-item
            :prepend-icon="icon"
            :title="title"
            :value="title"
          ></v-list-item>
        </router-link>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const navigationItems = [
  {
    url: "/rockets",
    title: "Rockets",
    icon: "mdi-rocket",
  },
  {
    url: "/crews",
    title: "Crew",
    icon: "mdi-account-group",
  },
];

const drawer = ref(true);
const rail = ref(true);
</script>
