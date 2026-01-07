<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRocketStore } from "@/stores/rocket";
import { useRouter } from "vue-router";

import RocketCard from "@/components/rocket-card.vue";
import RocketImageDialog from "@/components/rocket-image-dialog.vue";
import RocketAddDialog from "@/components/rocket-add-dialog.vue";
import type { Rocket } from "@/services/rocket.service";

const store = useRocketStore();
const router = useRouter();

const search = ref("");
const dialog = ref(false);
const selectedImages = ref<string[]>([]);
const addDialog = ref(false);

const filteredRockets = computed(() => store.filteredRockets(search.value));

const openDialog = (images: string[]) => {
  selectedImages.value = images;
  dialog.value = true;
};

const goToDetail = (id: string) => {
  router.push(`/rocket/${id}`);
};

const onSaveRocket = (payload: Rocket) => {
  store.addRocket(payload);
};

onMounted(() => {
  store.fetchRockets();
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">
    Rockets
  </h1>

  <v-text-field
    v-model="search"
    label="Search rockets"
    prepend-inner-icon="mdi-magnify"
    clearable
    class="mb-4"
  />

  <v-btn
    color="primary"
    class="mb-4"
    @click="addDialog = true"
  >
    Add Rocket
  </v-btn>

  <v-container fluid>
    <v-row
      v-if="store.loading"
      dense
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-col>
    </v-row>

    <v-row
      v-else-if="store.error"
      dense
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-alert
          type="error"
          class="mb-4"
        >
          {{ store.error }}
        </v-alert>

        <v-btn
          color="primary"
          variant="outlined"
          @click="store.fetchRockets()"
        >
          Retry
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      v-else
      dense
    >
      <v-col
        v-if="!filteredRockets.length"
        cols="12"
        class="text-center text-gray-500"
      >
        No rockets found.
      </v-col>

      <v-col
        v-for="rocket in filteredRockets"
        v-else
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard
          :rocket="rocket"
          @view-images="openDialog"
          @go-detail="goToDetail"
        />
      </v-col>
    </v-row>
  </v-container>

  <RocketImageDialog
    v-model="dialog"
    :images="selectedImages"
  />

  <RocketAddDialog
    v-model="addDialog"
    @save="onSaveRocket"
  />
</template>
