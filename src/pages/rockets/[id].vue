<template>
  <v-container class="py-8">
    <AppLoading v-if="loading" color="primary" />

    <AppAlert
      v-if="detailError"
      type="error"
      title="Unable to load rocket"
      retry
      :message="detailError"
      @retry="fetchDetail"
    />

    <AppAlert v-if="!loading && !detailError && rocket === null" />

    <RocketDetail v-if="!loading && !detailError" :rocket="rocket" />
  </v-container>
</template>

<script setup lang="ts">
import AppAlert from "@/components/feedback/AppAlert.vue";
import AppLoading from "@/components/feedback/AppLoading.vue";
import RocketDetail from "@/components/rocket/RocketDetail.vue";
import { useRocketStore } from "@/store/rocketStore";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useRoute } from "vue-router";

const rocketStore = useRocketStore();
const route = useRoute();

const { rocket, loading, detailError } = storeToRefs(rocketStore);

const fetchDetail = async () => {
  const id = Number(route.params.id)

  rocketStore.rocket = null
  rocketStore.detailError = null

  if (!Number.isInteger(id)) {
    rocketStore.detailError = 'Invalid rocket ID'
    return
  }

  const localRocket = [
    ...rocketStore.localRockets,
    ...rocketStore.rockets,
  ].find((rocket) => rocket.id === id)

  if (localRocket) {
    rocketStore.rocket = localRocket
    rocketStore.detailError = null
    return
  }

  await rocketStore.getRocket(id)
}

watch(
  () => route.params.id,
  () => {
    fetchDetail()
  },
  { immediate: true },
)
</script>
