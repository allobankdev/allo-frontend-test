<template>
  <div class="page">
    <div class="controls mt-10">
      <input
        class="txt-search"
        v-model="q"
        placeholder="Filter by name or country"
      />
      <button style="color: blueviolet" @click="reload">Retry</button>
    </div>

    <div class="form-add">
      <AddRocketForm @add="onAdd" />
      <img class="img-rocket" src="@/assets/blue-rocket-.png" />
    </div>

    <div v-if="store.loading">Loading...</div>
    <div v-else-if="store.error">
      <p>Error: {{ store.error }}</p>
      <button @click="reload">Retry</button>
    </div>

    <div v-else>
      <RocketItem
        v-for="rocket in filtered"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>
  </div>
</template>

<script setup>
import { useRocketStore } from "../../store/rocket";
import { ref, computed, onMounted } from "vue";
import RocketItem from "./components/rocket-item/index.vue";
import AddRocketForm from "./components/add/index.vue";

const q = ref("");
const store = useRocketStore();

onMounted(() => {
  if (!store.rockets.length) store.fetchRockets();
});

function reload() {
  store.fetchRockets();
}

function onAdd(payload) {
  store.addRocket(payload);
}

const filtered = computed(() => {
  if (!q.value) return store.rockets;
  const term = q.value.toLowerCase();
  return store.rockets.filter(
    (r) =>
      r.name.toLowerCase().includes(term) ||
      (r.country || "").toLowerCase().includes(term)
  );
});
</script>

<style scoped lang="scss">
.page {
  color: #000;
}
.controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  .txt-search {
    color: blueviolet;
    border: 1px solid blueviolet;
    border-radius: 20px;
    padding: 16px;
  }
}

.form-add {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}

.img-rocket {
  position: absolute;
  right: 86px;
  top: 188px;
  width: 300px;
  height: 299px;
}
</style>
