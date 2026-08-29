<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRocketStore } from "@/stores/rocket";
import RocketCard from "@/components/RocketCard.vue";
import BaseLoading from "@/components/BaseLoading.vue";
import BaseError from "@/components/BaseError.vue";
import EmptyState from "@/components/EmptyState.vue";

const rocketStore = useRocketStore();

/* ========= FETCH ========= */
onMounted(() => {
  rocketStore.fetchRockets();
});

/* ========= FILTER ========= */
const keyword = ref("");
const filteredRockets = computed(() => {
  if (!keyword.value) return rocketStore.rockets;

  return rocketStore.rockets.filter((r) =>
    r.name.toLowerCase().includes(keyword.value.toLowerCase()),
  );
});

/* ========= ADD ROCKET ========= */
const showForm = ref(false);

const form = ref({
  name: "",
  description: "",
  image: "",
  cost_per_launch: 0,
  country: "",
  first_flight: "",
});

const submit = () => {
  if (!form.value.name || !form.value.description) {
    alert("Name and description are required");
    return;
  }

  rocketStore.addRocket({
    name: form.value.name,
    description: form.value.description,
    flickr_images: form.value.image ? [form.value.image] : [],
    cost_per_launch: form.value.cost_per_launch,
    country: form.value.country,
    first_flight: form.value.first_flight,
  });

  form.value = {
    name: "",
    description: "",
    image: "",
    cost_per_launch: 0,
    country: "",
    first_flight: "",
  };
  showForm.value = false;
};
</script>

<template>
  <div>
    <h1>Rocket List</h1>

    <!-- ADD -->
    <button @click="showForm = !showForm">
      {{ showForm ? "Cancel" : "Add Rocket" }}
    </button>

    <div v-if="showForm" class="form">
      <input v-model="form.name" placeholder="Rocket name" />
      <input v-model="form.image" placeholder="Image URL" />
      <textarea v-model="form.description" placeholder="Description" />
      <input
        type="number"
        v-model.number="form.cost_per_launch"
        placeholder="Cost per launch"
      />
      <input v-model="form.country" placeholder="Country" />
      <input type="date" v-model="form.first_flight" />
      <button @click="submit">Submit</button>
    </div>

    <!-- FILTER -->
    <input v-model="keyword" placeholder="Search rocket..." class="search" />

    <!-- STATES -->
    <BaseLoading v-if="rocketStore.loading" />

    <BaseError
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="rocketStore.fetchRockets"
    />

    <EmptyState v-else-if="!filteredRockets.length" />

    <!-- LIST -->
    <div v-else class="grid">
      <RouterLink
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :to="`/rockets/${rocket.id}`"
        class="link"
      >
        <RocketCard :rocket="rocket" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.form {
  border: 1px solid #ddd;
  padding: 16px;
  margin: 12px 0;
  display: grid;
  gap: 8px;
}

.search {
  margin: 16px 0;
  padding: 8px;
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.link {
  text-decoration: none;
  color: inherit;
}
</style>
