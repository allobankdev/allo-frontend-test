<template>
  <div class="container">
    <div class="container-header">
      <h1>SpaceX Rockets</h1>
      <span>Information about rockets</span>
      <div class="container-button">
        <v-btn color="blue" prepend-icon="mdi-plus" @click="handleAddRocket">
          <template v-slot:prepend>
            <v-icon color="white"></v-icon>
          </template>
          Add Rocket
        </v-btn>
        <v-btn color="blue" icon="mdi-cached" :disabled="!selectedRocketName" @click="handleResetFilter" />
        <FilterDropDown @display-rocket="handleRocketSelection" />
      </div>
    </div>

    <div v-if="!rocketStore.isLoading" class="container-card">
      <RocketCard
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
        @openModal="triggerModal"
        :loading="rocketStore.isLoading"
      />
    </div>
    <div v-else class="container-loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading Rocket Data...</p>
    </div>
  </div>
  <div>
    <RocketModal
      v-if="isOpenModal"
      :rocket="modalData"
      @close="isOpenModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import RocketModal from "./RocketModal.vue";
import RocketCard from "./RocketCard.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRocketStore } from "../stores/rocketStore";
import FilterDropDown from "./FilterDropDown.vue";
import type { Rocket } from "../types/Rocket";
import router from "../router";
import { useToast } from "vue-toastification";

const toast = useToast();
const rocketStore = useRocketStore();

const isOpenModal = ref(false);
const selectedRocketName = ref<string | null>(null);
const modalData = ref<Rocket>();

const handleRocketSelection = (name: string | null) => {
  selectedRocketName.value = name;
};

const handleResetFilter = () => {
  selectedRocketName.value = "";
};

const handleAddRocket = () => {
  router.push("/add-rocket");
};

const triggerModal = (rocket: Rocket) => {
  modalData.value = rocket;
  isOpenModal.value = true;
};

const filteredRockets = computed(() => {
  return selectedRocketName.value
    ? rocketStore.rockets.filter((r) => r.name === selectedRocketName.value)
    : rocketStore.rockets;
});

onMounted(() => {
  if (!rocketStore.rockets.length) {
    rocketStore.getRockets();
  }
  if (rocketStore.isSuccess) {
    toast.success("Rocket successfully added", {
      closeOnClick: true,
      timeout: 2000,
    });
    rocketStore.isSuccess = false;
  }
});

watch(
  () => rocketStore.isError,
  (isError) => {
    if (isError) {
      toast.error("Failed to fetch rocket", {
        closeOnClick: true,
        timeout: 2000,
      });
      rocketStore.isError = false;
    }
  }
);
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10%;
  justify-items: center;

  &-loading {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 100px;
    justify-items: center;
    align-items: center;
  }

  &-button {
    display: flex;
    gap: 20px;
    padding-top: 30px;
    align-items: center;
  }

  &-header {
    justify-items: center;
    padding-bottom: 50px;
  }

  &-card {
    display: flex;
    flex-wrap: wrap;
    max-width: calc(65% - 16px);
    gap: 20px;
    justify-content: space-between;
  }
}
</style>
