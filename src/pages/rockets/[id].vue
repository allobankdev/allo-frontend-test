<template>
  <div v-if="rocket" class="page">
    <button class="btn-back" @click="$router.back()">&#128281; Back</button>
    <img :src="rocket.flickr_images" alt="rocket" />
    <div class="grid-col">
      <div class="txt-name">{{ rocket.name }}</div>
      <div class="txt-desc">{{ rocket.description }}</div>
      <div>
        <div>
          <strong>Cost per launch:</strong> {{ rocket.cost_per_launch }}
        </div>
        <div><strong>Country:</strong> {{ rocket.country }}</div>
        <div><strong>First flight:</strong> {{ rocket.first_flight }}</div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRocketStore } from "@/store/rocket";
import { ref, onMounted } from "vue";

const route = useRoute();
const store = useRocketStore();
const rocket = ref(null);

onMounted(async () => {
  if (!store.rockets.length) {
    await store.fetchRockets();
  }
  rocket.value = store.rockets.find((r) => r.id === route.params.id);
});
</script>

<style lang="scss">
.page {
  background: azure;
  padding: 10px;
}
.btn-back {
  margin: 20px 0;
  color: rgb(64, 16, 108);
}
.grid-col {
  color: rgb(64, 16, 108);
  display: flex;
  flex-direction: column;
  gap: 8px;
  .txt-name {
    font-weight: 800;
    font-size: 28px;
  }
  .txt-desc{
    font-weight: 500;
  }
}
</style>
