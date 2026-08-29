<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4 font-weight-bold">
        SpaceX Rockets
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddDialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <!-- Filter -->
    <v-row class="mb-4">
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-text-field
          v-model="search"
          label="Search Rockets"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          density="compact"
        />
      </v-col>
    </v-row>

    <!-- Error State -->
    <div
      v-if="state.error"
      class="d-flex flex-column align-center justify-center py-10"
    >
      <v-icon
        icon="mdi-alert-circle"
        color="error"
        size="64"
        class="mb-4"
      />
      <div class="text-h6 text-error mb-2">
        Something went wrong
      </div>
      <div class="text-body-1 mb-4">
        {{ state.error }}
      </div>
      <v-btn
        color="primary"
        @click="retryFetch"
      >
        Retry
      </v-btn>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="state.loading"
      class="d-flex justify-center align-center py-10"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <!-- Success State -->
    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard
          :rocket="rocket"
          @click="goToDetail(rocket.id)"
        />
      </v-col>
      
      <v-col
        v-if="filteredRockets.length === 0"
        cols="12"
        class="text-center"
      >
        <div class="text-subtitle-1 text-medium-emphasis">
          No rockets found matching your criteria.
        </div>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <v-dialog
      v-model="showAddDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="submitRocket"
          >
            <v-text-field
              v-model="newRocket.name"
              label="Rocket Name"
              :rules="[required]"
              class="mb-2"
            />
            <v-textarea
              v-model="newRocket.description"
              label="Description"
              :rules="[required]"
              rows="3"
              class="mb-2"
            />
            <v-text-field
              v-model="newRocket.country"
              label="Country"
              :rules="[required]"
              class="mb-2"
            />
            <v-text-field
              v-model.number="newRocket.cost_per_launch"
              label="Cost per Launch ($)"
              type="number"
              :rules="[required]"
              class="mb-2"
            />
            <v-text-field
              v-model="newRocket.first_flight"
              label="First Flight (YYYY-MM-DD)"
              type="date"
              :rules="[required]"
              class="mb-2"
            />
            <v-text-field
              v-model="newRocket.imageUrl"
              label="Image URL"
              :rules="[required]"
              class="mb-2"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showAddDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            @click="submitRocket"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // use vue-router/auto or vue-router? Setup says standard vue-router is installed.
import { useRocketStore } from '@/composables/useRocketStore';
import RocketCard from '@/components/RocketCard.vue';
import type { Rocket } from '@/types/rocket';

const router = useRouter();
const { state, fetchRockets, addRocket, retryFetch } = useRocketStore();

const search = ref('');
const showAddDialog = ref(false);
const valid = ref(false);


const newRocket = ref({
  name: '',
  description: '',
  country: '',
  cost_per_launch: 0,
  first_flight: '',
  imageUrl: '' // Helper for flickr_images
});

const required = (v: string) => !!v || 'Field is required';

const filteredRockets = computed(() => {
  if (!state.rockets) return [];
  const q = search.value.toLowerCase();
  return state.rockets.filter(r => 
    r.name.toLowerCase().includes(q)
  );
});

onMounted(() => {
  fetchRockets();
});

const goToDetail = (id: string) => {
  router.push(`/rockets/${id}`);
};

const submitRocket = async () => {
    if (!valid.value) return;

    // Construct full object
    const rocket: Rocket = {
      id: Date.now().toString(), // local ID
      name: newRocket.value.name,
      description: newRocket.value.description,
      country: newRocket.value.country,
      cost_per_launch: newRocket.value.cost_per_launch,
      first_flight: newRocket.value.first_flight,
      flickr_images: [newRocket.value.imageUrl],
      height: { meters: 0, feet: 0 }, // Defaults
      mass: { kg: 0, lb: 0 }
    };

    addRocket(rocket);
    showAddDialog.value = false;
    
    // Reset form
    newRocket.value = {
      name: '',
      description: '',
      country: '',
      cost_per_launch: 0,
      first_flight: '',
      imageUrl: ''
    };
};
</script>
