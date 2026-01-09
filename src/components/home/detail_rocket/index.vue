<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col">
        <button class="btn btn-success" @click="goBack">Kembali</button>
      </div>
    </div>
    <div v-if="isLoading" class="text-center">Lagi Loading...</div>
    <div class="row mt-5" v-else>
      <div class="col">
        <div class="mb-3">
          <img v-if="rocketImage" :src="rocketImage" class="img-fluid" />
          <div
            v-else
            class="bg-light text-muted d-flex align-items-center justify-content-center"
            style="height: 300px"
          >
            Gambar tidak tersedia
          </div>
        </div>
        <h2 class="fw-bold">{{ rocket.name }}</h2>
        <div class="row">
          <span>Cost : {{ formatMoneyUSD(rocket.cost_per_launch) }}</span>
          <span>Country : {{ rocket.country }}</span>
          <span>Flight : {{ rocket.first_flight }}</span>
          <span> {{ rocket.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { rocketStore } from "@/stores/rocket.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
const router = useRouter();
const route = useRoute();
const store = rocketStore();

const { listRockets, isLoading } = storeToRefs(store);

const rocketId = route.params.id;

// ambil data berdasarkan id
const rocket = computed(() =>
  listRockets.value.filter(Boolean).find((item) => item.id === rocketId)
);

// handle image
const rocketImage = computed(() => {
  const img = rocket.value?.flickr_images?.[0];
  return typeof img === "string" && img.trim() !== "" ? img : null;
});

onMounted(async () => {
  if (!listRockets.value.length) {
    await store.getDataRockets();
  }
});

const goBack = () => {
  router.push("/");
};

// format uang
const formatMoneyUSD = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
</script>
