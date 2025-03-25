<template>
  <BaseLoading v-if="rocketStore.isLoadingDetail" />
  <v-container v-else-if="rocketStore.errorRocket" class="d-flex flex-column justify-center align-center">
    <p>{{ rocketStore.errorRocket }}</p>
    <v-btn @click="retry">Retry</v-btn>
  </v-container>
  <v-col v-else class="px-12">
    <v-window
      v-model="rocketStore.window"
      show-arrows
    >
      <v-window-item
        v-for="n in rocketStore.rocketItem?.flickr_images"
        :key="n"
      >
        <v-card class="d-flex justify-center align-center" height="50vh">
          <v-img :src="n" alt="rocket image"/>
        </v-card>
      </v-window-item>
    </v-window>
    <v-col class="text-center">
      <h3>Rocket Name</h3>
      <p>{{ rocketStore.rocketItem?.name }}</p>
      <v-divider class="my-2"/>
      <h3>Decription</h3>
      <p>{{ rocketStore.rocketItem?.description }}</p>
      <v-divider class="my-2"/>
      <h3>Cost Per Launch</h3>
      <p>{{ rocketStore.rocketItem?.cost_per_launch }}</p>
      <v-divider class="my-2"/>
      <h3>Country</h3>
      <p>{{ rocketStore.rocketItem?.country }}</p>
      <v-divider class="my-2"/>
      <h3>First Flight</h3>
      <p>{{ rocketStore.rocketItem?.first_flight }}</p>
    </v-col>
  </v-col>
</template>

<script setup>
  import { useRocketStore } from "@/stores/RocketStore";
  import { useRoute } from "vue-router";
  import { onBeforeMount, onMounted } from "vue";

  const rocketStore = useRocketStore();
  const route = useRoute();

  onBeforeMount(async () => {
    rocketStore.getRocketById(route.params.id);
  });

  function retry() {
    rocketStore.getRocketById(route.params.id);
  }
</script>
