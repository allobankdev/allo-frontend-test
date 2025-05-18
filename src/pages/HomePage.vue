<template>
  <v-container grid-list-md>
    <NavUtils />
    <Filter />
    <v-row>
      <template v-if="storeRocket.loading">
        <v-col cols="12" sm="6" md="4" v-for="n in 6" :key="n">
          <SkeletonLoader />
        </v-col>
      </template>

      <template v-else>
        <v-col
          v-for="item in filteredRockets"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
        >
          <CatalogItem :rocket="item" />
        </v-col>
      </template>
    </v-row>

    <Snackbar
      v-if="storeRocket.success && storeRocket.api"
      :snackbarData="message"
      @retry="handleRetry"
    />
    <Snackbar
      v-if="storeRocket.error"
      :snackbarData="message"
      @retry="handleRetry"
    />
    <FabPop />
  </v-container>
</template>

<script lang="ts" setup>
import NavUtils from "@/components/NavUtils.vue";
import CatalogItem from "@/components/CatalogItem.vue";
import FabPop from "@/components/FabPop.vue";
import Filter from "@/components/Filter.vue";

import {onMounted, computed} from "vue";
import {useRocketStore} from "@/store/RocketStore";
import {useFilterStore} from "@/store/FiilterStore";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import Snackbar from "@/components/Snackbar.vue";

const message = {message: "Success fetch rockets data", showSnackbar: true, status: 200};

// State management rockets data
const storeRocket = useRocketStore();
const filterStore = useFilterStore();

if (storeRocket.error) {
  message.message = "Failed fetch rockets data";
  message.status = 500;
}

// when this component mounted
onMounted(() => {
  storeRocket.fetchAllRockets();
})

const handleRetry = () => {
  storeRocket.fetchAllRockets();
};

// a computed ref
const filteredRockets = computed(() => {
  const filters = filterStore.filter;

  // Check if any filter is active
  const anyActive = Object.values(filters).some(val => val);

  if (storeRocket.loading) return new Array(6).fill({id: 1})

  if (!anyActive) {
    // No filters checked → show all
    return storeRocket.rockets;
  }

  // Apply filter
  return storeRocket.rockets.filter(rocket => {
    return (
      (!filters.optionA || rocket.status) &&
      (!filters.optionB || !rocket.status) &&
      (!filters.optionC || rocket.cost_per_launch < 10000000) &&
      (!filters.optionD || rocket.country === 'United States') &&
      (!filters.optionE || rocket.success_rate_pct === 100) &&
      (!filters.optionF || rocket.success_rate_pct === 0)
    );
  });
});
</script>
