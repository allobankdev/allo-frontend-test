<template>
  <div class="container mt-5" v-if="isLoading">
    <div class="container mt-5 text-center">
      <span class="fs-5 fw-bold">Lagi loading....</span>
    </div>
  </div>
  <div class="container mt-5" v-else>
    <div class="row mb-5">
      <div class="col-md-2" style="width: 135px">
        <button class="btn btn-success" @click="goToNewRocket">
          Add Rocket
        </button>
      </div>
      <div class="col-md-6" style="width: 500px">
        <input
          type="text"
          class="form-control"
          id="searchName"
          placeholder="Serch Rocket By Name"
          v-model="search"
        />
      </div>
      <div class="col-md-2" style="width: 154px">
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{
              selectRocket === null
                ? "Select Status"
                : selectRocket === true
                ? "Active"
                : "Non-Active"
            }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="item in activeRocket" :key="item">
              <a
                class="dropdown-item"
                href="#"
                @click="storeRocket.selectRocketActive(item)"
                >{{ item === true ? "Active" : "Non-Active" }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-2" style="width: 166px">
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle dropdown-elipsis"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectCountry }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="item in country">
              <a
                class="dropdown-item"
                href="#"
                @click="storeRocket.selectCountryValue(item)"
                >{{ item }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-2" style="width: 150px">
        <VueDatePicker
          year-picker
          v-model="defaultYear"
          placeholder="2026"
          :year-range="[2000, 2100]"
        />
      </div>
      <div class="col-md-2" style="width: 135px">
        <button class="btn btn-success" @click="storeRocket.resetFilter">
          Reset Filter
        </button>
      </div>
    </div>
    <div class="row" v-if="filteredItemsRockets.length">
      <div class="col-md-3" v-for="i in filteredItemsRockets" :key="i">
        <div
          class="card h-100 d-flex flex-column hver-class"
          style="width: 18rem; border: none; box-shadow: 0 0 0.5rem #3e4d5f26"
        >
          <img
            v-if="getRocketImage(i)"
            :src="i.flickr_images[0]"
            class="card-img-top"
            alt="rocket image"
          />
          <div class="text-center pt-3" v-else>
            <span>Gambar Tidak Tersedia</span>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ i.name }}</h5>
            <p class="card-text text-clamp">{{ i.description }}</p>
            <button
              class="btn btn-primary mt-auto"
              @click="goToDetailRocket(i.id)"
            >
              Detail Rocket
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <span class="fs-5 fw-bold">Data not found</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rocketStore } from "@/stores/rocket.js";
import { storeToRefs } from "pinia";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
//
const storeRocket = rocketStore();

const {
  listRockets,
  isLoading,
  filteredItemsRockets,
  search,
  activeRocket,
  country,
  defaultYear,
  selectRocket,
  selectCountry,
} = storeToRefs(storeRocket);
onMounted(() => {
  storeRocket.getDataRockets();
  storeRocket.defaultYearValue();
});

const router = useRouter();

const goToNewRocket = () => {
  router.push("/add-rocket");
};
const goToDetailRocket = (id) => {
  router.push(`/detail-rocket/${id}`);
};
const getRocketImage = (rocket) => {
  const img = rocket.flickr_images?.[0];

  // valid jika string dan tidak kosong
  if (typeof img === "string" && img.trim() !== "") {
    return img;
  }

  return null;
};
</script>

<style setup>
.text-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hver-class:hover {
  transform: translateY(-5px);
  transition: 0.3s;
  box-shadow: 0 0.5rem 1rem #00000026 !important;
}
.dropdown-elipsis {
  max-width: 146px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
