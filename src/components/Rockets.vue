<template>
  <div>
    <div class="d-flex justify-center mb-4">
      <DialogRocket />
    </div>
    <v-text-field
      v-model="keyword"
      type="text"
      placeholder="Search rocket by name..."
    />
    <v-row>
      <v-col md="6" v-for="rocket in filtered" :key="rocket.id">
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import RocketCard from "./RocketCard.vue";
import DialogRocket from "./DialogRocket.vue";
import { onMounted, ref, computed } from "vue";
import { type Rocket } from "@/types/rockets";

import { useRocketsStore } from "@/stores/rocketStore";
const rocketsStore = useRocketsStore();

const keyword = ref("");
const filtered = computed(() =>
  rocketsStore.rockets.filter((r: Rocket) =>
    r.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
);
onMounted(() => {
  rocketsStore.fetchRockets();
});
</script>
