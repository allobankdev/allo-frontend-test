<template>
  <v-container>
    <v-text-field
      v-model="search"
      label="Search Rockets"
      outlined
      clearable
      class="my-4"
    />

    <v-btn
      text=" Add New Rocket"
      color="primary"
      class="mb-4"
      @click="openAddRocketDialog"
    />

    <div v-if="isLoading">
      Loading...
    </div>

    <div v-else-if="error">
      <button @click="fetchRockets">
        Retry
      </button>
      Error: {{ error.message }}
    </div>

    <div v-else>
      <v-row>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <Card
            :rocket="rocket"
            class="cursor-pointer"
            @click="goToRocketDetails(rocket.id)"
          />
        </v-col>
      </v-row>
    </div>

    <v-dialog
      v-model="addRocketDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addRocket">
            <v-text-field
              v-model="newRocket.name"
              label="Name"
              required
            />
            <v-text-field
              v-model="newRocket.description"
              label="Description"
              required
            />
            <v-text-field
              v-model="newRocket.cost_per_launch"
              label="Cost per Launch"
              type="number"
              required
            />
            <v-text-field
              v-model="newRocket.country"
              label="Country"
              required
            />
            <v-text-field
              v-model="newRocket.first_flight"
              label="First Flight"
              required
            />
            <v-text-field
              v-model="newRocket.flickr_images[0]"
              label="Image URL"
              required
            />
            <v-card-actions>
              <v-btn
                type="submit"
                color="primary"
                text="Add Rocket"
              />
              <v-btn
                color="primary"
                text="Close"
                @click="addRocketDialog = false"
              />
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/store/rocketStore";

export default defineComponent({
  setup() {
    const router = useRouter();
    const rocketStore = useRocketStore();
    rocketStore.fetchRockets();
    const addRocketDialog = ref(false);

    const newRocket = ref({
      name: "",
      description: "",
      cost_per_launch: 0,
      country: "",
      first_flight: "",
      flickr_images: [""],
    });

    const openAddRocketDialog = () => {
      addRocketDialog.value = true;
    };

    const addRocket = () => {
      rocketStore.addRocket(newRocket.value);
      addRocketDialog.value = false;
      newRocket.value = {
        name: "",
        description: "",
        cost_per_launch: 0,
        country: "",
        first_flight: "",
        flickr_images: [""],
      };
    };

    const goToRocketDetails = (id: string) => {
      router.push({ name: "rocket-details", params: { id } });
    };

    return {
      search: computed({
        get: () => rocketStore.search,
        set: (value) => rocketStore.setSearch(value),
      }),
      filteredRockets: computed(() => rocketStore.filteredRockets),
      isLoading: computed(() => rocketStore.isLoading),
      error: computed(() => rocketStore.error),
      addRocketDialog,
      newRocket,
      fetchRockets: rocketStore.fetchRockets,
      openAddRocketDialog,
      addRocket,
      goToRocketDetails,
    };
  },
});
</script>
