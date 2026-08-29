<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, computed, ref, watch } from "vue";
import { useRocketStore } from "@/stores/rocket.store";
import RocketCard from "@/modules/Rocket/RocketCard.vue";
import RocketFilter from "@/modules/Rocket/RocketFilter.vue";
import Header from "@/components/Header.vue";
import ModalCreateRocket from "@/modules/Rocket/ModalCreateRocket.vue";
import SkeletonLoading from "@/modules/Rocket/SkeletonLoading.vue";

const store = useRocketStore();
const router = useRouter();

const filter = ref("");
const debouncedFilter = ref("");
const isOpenModal = defineModel<boolean>({ default: false });
let debounceTimer: number | undefined;

watch(filter, (value) => {
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    debouncedFilter.value = value;
  }, 400);
});

onMounted(() => store.fetchRockets());

const filteredRockets = computed(() =>
  store.rockets.filter((r) =>
    r.name.toLowerCase().includes(debouncedFilter.value.toLowerCase()),
  ),
);

const openCreateModal = () => {
  isOpenModal.value = true;
};
</script>

<template>
  <v-container>
    <Header v-model="filter" />

    <RocketFilter v-model="filter" @openCreateModal="openCreateModal" />
    <ModalCreateRocket v-model="isOpenModal" />

    <v-row v-if="store.loading">
      <v-col cols="12" md="4" v-for="n in 6" :key="n">
        <skeleton-loading />
      </v-col>
    </v-row>

    <v-alert v-else-if="store.error" type="error">
      Failed to load rockets
      <v-btn @click="store.fetchRockets" class="ml-2">Retry</v-btn>
    </v-alert>

    <v-row align="stretch" v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        md="4"
        class="d-flex"
      >
        <RocketCard
          :rocket="rocket"
          @click="router.push(`/rocket/${rocket.id}`)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
