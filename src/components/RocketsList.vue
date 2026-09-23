<script setup lang="ts">
import RocketCard from "@/components/RocketCard.vue";
import { useRocketStore } from "@/stores/rocketStore";
import { onMounted, ref } from "vue";
import AddRocketDialog from "./AddRocketDialog.vue";

const store = useRocketStore();

const showModal = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets().then(() => {
      store.searchQuery = "";
      successMessage.value = "Rockets data fetched successfully!";
    });
  }
});

</script>
<template>
  <v-container class="py-8">
    <v-snackbar
      :model-value="!!successMessage"
      color="success"
      location="bottom right"
      title="Successfully"
      :timeout="3000"
    >
      <p class="mb-4">
        {{ successMessage }}
      </p>
    </v-snackbar>

    <v-snackbar
      :model-value="!!errorMessage"
      color="error"
      location="bottom right"
      title="Failed"
      :timeout="3000"
    >
      <p class="mb-4">
        {{ errorMessage }}
      </p>
    </v-snackbar>
    <v-row
      class="mb-6"
      align="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="9"
      >
        <v-text-field
          v-model="store.searchQuery"
          label="Find Name Rocket..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          clearable
          bg-color="white"
        />
      </v-col>
      <v-col
        cols="12"
        sm="4"
        md="3"
      >
        <v-btn
          color="primary"
          size="large"
          block
          prepend-icon="mdi-plus"
          @click="showModal = true"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <div
      v-if="store.loading"
      class="text-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="mt-4 text-body-1 text-medium-emphasis">
        Loading SpaceX rocket data...
      </p>
    </div>

    <v-alert
      v-else-if="store.error"
      type="error"
      variant="tonal"
      class="my-6"
      title="Failed to load rockets"
    >
      <p class="mb-4">
        {{ store.error }}
      </p>
      <v-btn
        color="error"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="store.fetchRockets()"
      >
        Try Again
      </v-btn>
    </v-alert>

    <v-row v-else-if="store.filteredRockets.length > 0">
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <v-alert
      v-else
      type="info"
      variant="tonal"
      class="my-6 text-center"
    >
      "{{ store.searchQuery }}" is not found
    </v-alert>
    <AddRocketDialog
      v-model="showModal"
      @submit="store.addRocket"
    />
  </v-container>
</template>
