<script lang="ts" setup>
import { useRocketStore } from "@/stores/rocket.store";
import Loading from "@/components/Loading.vue";
import ErrorState from "@/components/ErrorState.vue";
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";


const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();

onMounted(() => {
  rocketStore.fetchRocketById(route.params.id as string);
});

const retry = () => {
  rocketStore.fetchRocketById(route.params.id as string);
};

const rocket = computed(() => rocketStore.rocket);
const formatDate = computed(() => {
  return rocket.value?.date_utc ? new Date(rocket.value.date_utc).toLocaleDateString() : '';
})
const goBack = () => {
 router.back();
};
</script>
<template>
  <Loading v-if="rocketStore.loading" />
  <ErrorState v-else-if="rocketStore.error" @retry="retry" />

  <v-container v-else-if="rocket">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="goBack">
      Back
    </v-btn>
    <v-card elevation="6" class="detail-card">
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-img height="300" :src="rocket.links?.patch?.small" class="detaul-image"/>

      </v-col>
      <v-col cols="12" md="6">
        <v-card-title>{{ rocket.name }}</v-card-title>
        <v-card-text>
          <p>{{ rocket.details }}</p>
          <p>Cost per Launch: ${{ rocket.cost_per_launch }}</p>
          <p>Country: {{ rocket.country }}</p>
          <p>First Flight: {{ formatDate }}</p>
        </v-card-text>
      </v-col>
    </v-row>
    </v-card>
  </v-container>

</template>
<style scoped>
  .detail-card {
    border-radius: 12px;
    overflow: hidden;
  }
  .detail-image {
    min-height: 320px;
  }
</style>
