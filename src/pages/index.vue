<template>
  <v-container>
    <Loading v-if="loading" />
    <ErrorState v-if="rocketStore.error" @retry="rocketStore.fetchRockets" />

    <div v-else>
      <v-container fluid class="mb-4">
        <v-row justify="space-between" align="center">
          <v-col cols="12" md="6">
            <h2 class="text-h6 font-weight-bold">Rocket list</h2>

            <Filter v-model="filter" />


          </v-col>
          <v-col cols="12" md="6" class="text-sm-right">
            <v-btn
              color="primary"
              class="mt-2 mt-sm-0"
              prepend-icon="mdi-plus"
              @click="$router.push('/addRocket')"
            >
              Add Rocket
            </v-btn>

          </v-col>
        </v-row>

      </v-container>

      <v-row dense>
        <v-col cols="12" md="4" sm="6" lg="3" v-for="r in visibleRockets" :key="r.id">
          <Card :rocket="r" />
        </v-col>
      </v-row>
      <div ref="loadMore" class="my-4">
        <v-progress-circular indeterminate color="primary" v-if="hasMore"/>
        <p v-else>Load more</p>
      </div>

    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRocketStore } from "@/stores/rocket.store";
import Card from "@/components/Card.vue";
import ErrorState from "@/components/ErrorState.vue";
import Loading from "@/components/Loading.vue";
import Filter from "@/components/Filter.vue";

const rocketStore = useRocketStore();
const filter = ref("");
const itemsPerLoad = ref(10);
const loadMore = ref<HTMLElement | null>(null);

onMounted(async () => {
  await rocketStore.fetchRockets(),
  createObserver();
});

const filteredRockets = computed(() => {
  return rocketStore.rockets.filter((r) =>
    r.name.toLowerCase().includes(filter.value.toLowerCase())
  );
});

const visibleRockets = computed(() => {
  return filteredRockets.value.slice(0, itemsPerLoad.value);
});

const hasMore = computed(() => {
   return itemsPerLoad.value < rocketStore.rockets.length;
});

const loading = computed(() => {
  return rocketStore.loading && rocketStore.rockets.length === 0;
})

let observer: IntersectionObserver;

const createObserver = () => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value) {
      itemsPerLoad.value += 10;
    }

  });
  if (loadMore.value) {
    observer.observe(loadMore.value);
  }
};
</script>
