<template>
  <v-container class="py-8">
    <v-row class="mb-6" align="center" justify="space-between">
      <v-col cols="12" md="4">
        <h1 class="text-h4 font-weight-bold mb-2">SpaceX Rockets</h1>
        <p class="text-body-2">
          Browse rockets from the SpaceX API, filter them, and add your own
          custom rockets.
        </p>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search rockets"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          clearable
        />
      </v-col>

      <v-col cols="6" md="2">
        <v-select
          v-model="country"
          :items="countryItems"
          label="Country"
          density="compact"
          variant="outlined"
        />
      </v-col>

      <v-col cols="6" md="2" class="d-flex justify-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="isCreateDialogOpen = true"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-alert
      v-if="rocketStore.status === 'error'"
      type="error"
      class="mb-4"
      variant="tonal"
    >
      <div class="d-flex align-center justify-space-between w-100">
        <span>{{ rocketStore.errorMessage || "Failed to load rockets." }}</span>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          @click="rocketStore.fetchRockets()"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Loading state -->
    <div
      v-if="rocketStore.status === 'loading'"
      class="d-flex justify-center my-10"
    >
      <v-progress-circular indeterminate size="64" />
    </div>

    <!-- Success / empty states -->
    <template v-else>
      <v-row v-if="rocketStore.filteredRockets.length">
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="h-100 d-flex flex-column rocket-card"
            hover
            @click="goToDetail(rocket.id)"
          >
            <v-img
              :src="rocket.flickr_images?.[0] || fallbackImage"
              height="180"
              cover
            >
              <template #error>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon size="32"> mdi-rocket-launch-outline </v-icon>
                </div>
              </template>
            </v-img>

            <v-card-title class="text-subtitle-1 font-weight-bold">
              {{ rocket.name }}
            </v-card-title>

            <v-card-subtitle class="text-caption text-medium-emphasis">
              {{ rocket.country }}
            </v-card-subtitle>

            <v-card-text class="text-body-2 text-truncate-3-lines">
              {{ rocket.description }}
            </v-card-text>

            <v-spacer />

            <v-card-actions class="pt-0">
              <v-btn
                color="primary"
                variant="text"
                size="small"
                @click.stop="goToDetail(rocket.id)"
              >
                View details
                <v-icon end> mdi-chevron-right </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal" class="mt-6">
        No rockets found. Try adjusting your filters or add a new rocket.
      </v-alert>
    </template>

    <!-- Create rocket dialog -->
    <RocketCreateDialog
      v-model="isCreateDialogOpen"
      @submit="handleCreateRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rockets";
import RocketCreateDialog from "@/components/RocketCreateDialog.vue";
import type { NewRocketPayload } from "@/stores/rockets";

const rocketStore = useRocketStore();
const router = useRouter();

// Two-way bindings connected to the store
const search = computed({
  get: () => rocketStore.filterText,
  set: (val: string) => rocketStore.setFilterText(val),
});

const country = computed({
  get: () =>
    rocketStore.countryFilter === "all" ? null : rocketStore.countryFilter,
  set: (val: string | null) => rocketStore.setCountryFilter(val || "all"),
});

const isCreateDialogOpen = ref(false);
const fallbackImage = "https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png"; // Generic rocket placeholder

const countryItems = computed(() => [
  { title: "All countries", value: "all" },
  ...rocketStore.countries.map((c) => ({ title: c, value: c })),
]);

onMounted(() => {
  if (rocketStore.status === "idle") {
    rocketStore.fetchRockets();
  }
});

function goToDetail(id: string) {
  // Route name mengikuti konvensi unplugin-vue-router untuk pages/rockets/[id].vue
  router.push({ name: "rockets-id", params: { id } });
}

function handleCreateRocket(payload: NewRocketPayload) {
  rocketStore.addRocket(payload);
  isCreateDialogOpen.value = false;
}
</script>

<style scoped>
.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rocket-card {
  cursor: pointer;
}
</style>
