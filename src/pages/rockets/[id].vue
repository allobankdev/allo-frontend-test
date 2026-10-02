<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import Nav from "@/components/Nav.vue";
import { useRocketStore } from "@/stores/rockets";
import EmptyState from "@/components/EmptyState.vue";

const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();

const {
  selectedRocket,
  detailLoading: loading,
  detailError: error,
} = storeToRefs(rocketStore);

const placeholderImage = "https://placehold.net/default.svg";

const rocketId = Number(route.params.id);

const fetchRocket = () => {
  rocketStore.fetchRocket(rocketId);
};

const goBack = () => {
  router.push("/");
};

const handleImageError = (event: Event) => {
  const image = event.target as HTMLImageElement;

  if (image.src !== placeholderImage) {
    image.src = placeholderImage;
  }
};

onMounted(() => {
  fetchRocket();
});
</script>

<template>
  <div class="min-h-screen max-w-7xl mx-auto mt-4 sm:mt-6 lg:mt-8">

    <LoadingState v-if="loading" />

    <ErrorState v-else-if="error" :error="error" @retry="fetchRocket">
      <template #actions>
        <button type="button" @click="goBack"
          class="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 active:scale-[0.98]">
          <v-icon icon="mdi-arrow-left" size="18" />
          Back to Rockets
        </button>
      </template>
    </ErrorState>
    <div v-else-if="selectedRocket">
      <button type="button" @click="goBack"
        class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900">
        <v-icon icon="mdi-arrow-left" size="20" />
        Back to Rockets
      </button>
      <div class="flex flex-col gap-6 sm:flex-row">
        <div class="flex-shrink-0">
          <img :src="selectedRocket.image_url || placeholderImage" :alt="selectedRocket.full_name"
            class="h-64 w-full rounded-lg object-cover sm:h-96 sm:w-[600px]" @error="handleImageError" />
        </div>
        <div class="flex flex-col gap-4 w-full ">
          <div class="border-b  pb-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ selectedRocket.full_name }}
            </h1>
            <p class="text-gray-600">{{ selectedRocket.description }}</p>
          </div>
          <ul>
            <li>
              <span
                class="rounded-full flex items-center bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 w-10 h-10 justify-center">
                <v-icon icon="mdi-currency-usd" size="20" />
              </span>
              <p>
                Cost per Launch: <span class="font-semibold text-gray-900">${{
                  selectedRocket.launch_cost?.toLocaleString()
                  ||
                  'N/A' }}</span>
              </p>
            </li>
            <li>
              <span
                class="rounded-full flex items-center bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 w-10 h-10 justify-center">
                <v-icon icon="mdi-calendar" size="20" />
              </span>
              <p>
                First Flight: <span class="font-semibold text-gray-900">{{ selectedRocket.maiden_flight || 'N/A'
                }}</span>

              </p>
            </li>
            <li>
              <span
                class="rounded-full flex items-center bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 w-10 h-10 justify-center">
                <v-icon icon="mdi-flag" size="20" />
              </span>
              <p>
                Country: <span class="font-semibold text-gray-900">{{ selectedRocket.manufacturer.country_code || 'N/A'
                }}</span></p>
            </li>
          </ul>
          <div class="mt-5 flex flex-wrap gap-3 ">
            <a v-if="selectedRocket.info_url" :href="selectedRocket.info_url" target="_blank" rel="noopener noreferrer"
              class="text-sm font-medium text-blue-600 hover:text-blue-800">
              Official website
              <v-icon icon="mdi-open-in-new" size="14" />
            </a>

            <a v-if="selectedRocket.wiki_url" :href="selectedRocket.wiki_url" target="_blank" rel="noopener noreferrer"
              class="text-sm font-medium text-blue-600 hover:text-blue-800">
              Wikipedia
              <v-icon icon="mdi-open-in-new" size="14" />
            </a>
          </div>
        </div>
      </div>
      <div class="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 class="border-b border-gray-100 pb-4 text-base font-semibold text-gray-900">
          Additional Information
        </h2>

        <div class="space-y-4 pt-4 mb-4">
          <div v-for="item in [
            { label: 'Manufacturer', value: selectedRocket.manufacturer?.name },
            { label: 'Family', value: selectedRocket.family },
            { label: 'Variant', value: selectedRocket.variant },
            { label: 'Height', value: selectedRocket.length ? `${selectedRocket.length} m` : null },
            { label: 'Diameter', value: selectedRocket.diameter ? `${selectedRocket.diameter} m` : null },
            { label: 'Launch mass', value: selectedRocket.launch_mass ? `${selectedRocket.launch_mass.toLocaleString()} tonnes` : null },
            { label: 'Stages', value: selectedRocket.min_stage === selectedRocket.max_stage ? selectedRocket.max_stage : `${selectedRocket.min_stage}–${selectedRocket.max_stage}` },
            { label: 'Maiden flight', value: selectedRocket.maiden_flight },
            { label: 'Launch cost', value: selectedRocket.launch_cost ? `$${Number(selectedRocket.launch_cost).toLocaleString()}` : null },
            { label: 'LEO capacity', value: selectedRocket.leo_capacity ? `${selectedRocket.leo_capacity.toLocaleString()} kg` : null },
            { label: 'GTO capacity', value: selectedRocket.gto_capacity ? `${selectedRocket.gto_capacity.toLocaleString()} kg` : null },
            { label: 'Thrust', value: selectedRocket.to_thrust ? `${selectedRocket.to_thrust.toLocaleString()} kN` : null },
            { label: 'Apogee', value: selectedRocket.apogee != null ? `${selectedRocket.apogee} km` : null },
            { label: 'Reusable', value: selectedRocket.reusable ? 'Yes' : 'No' },
            { label: 'Status', value: selectedRocket.active ? 'Active' : 'Inactive' },
            { label: 'Total launches', value: selectedRocket.total_launch_count?.toLocaleString() },
            { label: 'Successful launches', value: selectedRocket.successful_launches?.toLocaleString() },
            { label: 'Failed launches', value: selectedRocket.failed_launches?.toLocaleString() },
            { label: 'Successful landings', value: selectedRocket.successful_landings?.toLocaleString() },
          ].filter(item => item.value != null && item.value !== '')" :key="item.label" class="grid grid-cols-2 gap-4">
            <div class="text-sm text-gray-500">
              {{ item.label }}
            </div>

            <div class="text-sm font-medium text-gray-900">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState v-else @goBack="goBack" :showGoBackButton="true">
      <template #message>
        <h2 class="mt-4 text-lg font-semibold text-gray-900">
          Rocket not found
        </h2>
      </template>
    </EmptyState>
  </div>
</template>

<style lang="scss" scoped>
ul {
  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  p {
    display: flex;
    flex-direction: column;
  }
}
</style>