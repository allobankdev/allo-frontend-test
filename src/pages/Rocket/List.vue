<template>
  <v-app-bar
    app
    dark
  >
    <router-link
      to="/"
      class="text-decoration-none text-white px-4"
    >
      <v-toolbar-title>SpaceX</v-toolbar-title>
    </router-link>
  </v-app-bar>
  <v-main>
    <v-container>
      <v-row class="mb-4">
        <v-col cols="12">
          <v-typography class="text-h4 font-weight-bold">
            SpaceX Rocket List
          </v-typography>
        </v-col>
      </v-row>

      <!-- Search and Add -->
      <rocket-filter v-model="search" />
      <v-btn
        color="secondary"
        outlined
        class="mb-4"
        :disabled="store.loading"
        @click="showForm = true"
      >
        Add Rocket
      </v-btn>

      <!-- UIState -->
      <ui-state
        v-if="store.loading"
        type="loading"
      />
      <ui-state
        v-else-if="store.error"
        type="error"
        :message="store.error"
        retryable
        @retry="store.loadRockets"
      />
      <ui-state
        v-else-if="filteredRockets.length === 0"
        type="empty"
        message="No rockets found."
      />

      <!-- List Rocket -->
      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <router-link :to="`/rocket/${rocket.id}`">
            <rocket-card :rocket="rocket" />
          </router-link>
        </v-col>
      </v-row>

      <!-- Modal Tambah Rocket -->
      <rocket-form
        v-model="showForm"
        @submitted="onRocketSubmitted"
        @cancel="cancelForm"
      />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import RocketCard from '@/components/Rocket/Card.vue';
import RocketForm from '@/components/Rocket/Form.vue';
import RocketFilter from '@/components/Rocket/Filter.vue';
import UiState from '@/components/UIState.vue';
import { useRocketStore } from '@/store/rocket';
import type { IDataRocket } from '@/types/rocket';

const store = useRocketStore();
const showForm = ref(false);
const search = ref('');

const filteredRockets = computed(() => {
  return store.rockets.filter((rocket) =>
    rocket.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(() => {
  store.loadRockets();
});

const onRocketSubmitted = (rocket: IDataRocket) => {
  const rocketWithId: IDataRocket = {
    ...rocket,
    id: crypto.randomUUID(),
  };

  store.addRocket(rocketWithId);
  showForm.value = false;
};

const cancelForm = () => {
  console.log('Form cancelled');
  showForm.value = false;
};
</script>
