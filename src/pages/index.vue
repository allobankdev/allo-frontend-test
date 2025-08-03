<template>
  <v-container class="my-8">
    <v-row justify="center">
      <template
        v-for="item in navigationItems"
        :key="item.name"
      >
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="mx-auto"
            max-width="344"
            hover
            @click="navigateTo(item.url)"
          >
            <v-img
              :src="item.image"
              height="400px"
              cover
            />

            <v-card-title>{{ item.title }} </v-card-title>
            <v-card-actions>
              <v-btn
                color="primary"
                variant="text"
                @click.stop="navigateTo(item.url)"
              >
                View {{ item.name }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const navigationItems = [
  {
    url: "/rockets",
    name: "Rockets",
    title: "List Rockets",
    image:
      "https://t4.ftcdn.net/jpg/05/63/05/73/360_F_563057318_9crahiF3np329QmmZsgRZDsb18lvmBDT.jpg",
  },
  {
    url: "/crews",
    name: "Crews",
    title: "List Crew",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/STS-87_crew_1.jpg/1200px-STS-87_crew_1.jpg",
  },
];

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.v-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style>
