<template>
  <div class="pa-4 fill-screen">
    <v-sheet
      class="pa-4 mb-6 d-flex flex-wrap align-center justify-space-between gap-3"
      rounded="lg"
      elevation="1"
    >
      <div class="text-orange text-h6 font-weight-bold">Rocket List</div>

      <div class="d-flex align-center gap-3">
        <v-btn class="text-white bg-indigo" prepend-icon="mdi-plus"> Add Rocket </v-btn>

        <v-menu :close-on-content-click="false" location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn variant="outlined" prepend-icon="mdi-filter" v-bind="props">
              Filter
            </v-btn>
          </template>

          <v-card min-width="300" class="pa-4 mt-2" rounded="lg">
            <v-text-field
              v-model="rocketStore.filters.search"
              label="Search Rocket Name"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              hide-details
              class="mb-4"
            />

            <v-select
              v-model="rocketStore.filters.active"
              :items="[
                { title: 'All Status', value: null },
                { title: 'Active', value: true },
                { title: 'Inactive', value: false },
              ]"
              label="Status"
              variant="outlined"
              density="compact"
              hide-details
            />

            <v-card-actions class="px-0 mt-2">
              <v-spacer />
              <v-btn
                variant="text"
                size="small"
                @click="rocketStore.resetFilters()"
                >Reset</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-sheet>

    <!-- Loading state -->
    <v-progress-linear
      v-if="rocketStore.loading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <!-- Rocket List -->
    <v-container>
      <v-row>
        <v-col
          v-for="rocket in rocketStore.filteredList"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="12"
        >
          <v-card
            class="pa-4 d-flex flex-column flex-md-row align-center mb-4"
            rounded="xl"
          >
            <div class="flex-grow-1 text-center text-md-left mb-4 mb-md-0">
              <div class="text-h5 font-weight-bold">{{ rocket.name }}</div>
              <div class="text-body-2 mt-2 text-grey-lighten-1">
                {{ rocket.description }}
              </div>
              <div class="text-caption mt-2">
                First Flight: {{ rocket.first_flight }}
              </div>
            </div>

            <div class="image-wrapper ml-md-6">
              <v-img
                :src="rocket.flickr_images?.[0]"
                width="100%"
                min-width="180"
                max-width="280"
                height="160"
                cover
                class="rounded-lg"
              />
              <div class="image-overlay" @click="goToDetail(rocket.id)">
                View Detail
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Empty state -->
    <v-alert
      v-if="!rocketStore.loading && rocketStore.filteredList.length === 0"
      type="warning"
      variant="tonal"
    >
      No rocket data found. <u class="text-primary" @click="rocketStore.resetFilters()">Reset Filter</u>
    </v-alert>

    <CommonPagination
      v-model="rocketStore.pagination.page"
      :length="rocketStore.totalPages"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/utils/store/rocket.store";
import CommonPagination from "@/components/Pagination.vue";

const rocketStore = useRocketStore();
const router = useRouter();

onMounted(() => {
  rocketStore.fetchList();
});

const goToDetail = (id: string) => {
  router.push(`/rockets/${id}`);
};
</script>

<style scoped>
.fill-screen {
  min-height: 100vh;
}

.gap-3 {
  gap: 12px;
}

.image-wrapper {
  position: relative;
  width: 180px;
  height: 120px;
  flex-shrink: 0;
}

.image-overlay {
  cursor: pointer;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #ffffff;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  border-radius: 12px;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
  cursor: pointer;
}

.image-wrapper {
  position: relative;
  width: 100%;
}

@media (min-width: 960px) {
  .image-wrapper {
    width: 280px;
  }
}

.text-md-left {
  padding-right: 16px;
}
</style>
