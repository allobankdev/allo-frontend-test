<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <h1 class="text-h3 mb-4">
          SpaceX Rockets
        </h1>
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex align-center justify-end"
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showAddDialog = true"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Search Rockets"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          clearable
        />
      </v-col>
    </v-row>

    <div
      v-if="store.loading"
      class="d-flex justify-center my-8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <div
      v-else-if="store.error"
      class="my-8 text-center"
    >
      <v-alert
        type="error"
        class="mb-4"
        :text="store.error"
      />
      <v-btn
        color="primary"
        @click="store.fetchRockets()"
      >
        Retry
      </v-btn>
    </div>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        md="4"
        sm="6"
      >
        <v-card
          hover
          class="h-100"
          @click="goToDetail(rocket.id)"
        >
          <v-img
            :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'"
            height="200"
            cover
            class="align-end"
          >
            <v-card-title class="text-white bg-black-opacity">
              {{ rocket.name }}
            </v-card-title>
          </v-img>
          <v-card-text class="pt-4">
            <div class="text-truncate-2">
              {{ rocket.description }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        v-if="filteredRockets.length === 0"
        cols="12"
        class="text-center"
      >
        <p class="text-h6 text-medium-emphasis">
          No rockets found.
        </p>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <v-dialog
      v-model="showAddDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="addRocket"
          >
            <v-text-field
              v-model="newRocket.name"
              label="Rocket Name"
              required
              :rules="[v => !!v || 'Name is required']"
            />
            <v-textarea
              v-model="newRocket.description"
              label="Description"
              required
              :rules="[v => !!v || 'Description is required']"
            />
            <v-text-field
              v-model="newRocket.country"
              label="Country"
              required
              :rules="[v => !!v || 'Country is required']"
            />
            <v-text-field
              v-model.number="newRocket.cost_per_launch"
              label="Cost per Launch"
              type="number"
              required
              :rules="[v => !!v || 'Cost is required']"
            />
            <v-text-field
              v-model="newRocket.first_flight"
              label="First Flight (YYYY-MM-DD)"
              type="date"
              required
              :rules="[v => !!v || 'Date is required']"
            />
            <v-text-field
              v-model="newRocket.flickr_images[0]"
              label="Image URL"
              required
              :rules="[v => !!v || 'Image URL is required']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="showAddDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            :disabled="!valid"
            @click="addRocket"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';
import { useRouter } from 'vue-router';
import type { Rocket } from '@/stores/rocketStore';

const store = useRocketStore();
const router = useRouter();

const search = ref('');
const showAddDialog = ref(false);
const valid = ref(false);
const form = ref(null);

const newRocket = reactive<Rocket>({
  id: '',
  name: '',
  description: '',
  flickr_images: [''],
  cost_per_launch: 0,
  country: '',
  first_flight: '',
});

const filteredRockets = computed(() => {
  if (!search.value) return store.rockets;
  const lowerSearch = search.value.toLowerCase();
  return store.rockets.filter(r => 
    r.name.toLowerCase().includes(lowerSearch) || 
    r.description.toLowerCase().includes(lowerSearch)
  );
});

onMounted(() => {
    // Only fetch if empty to persist local additions if navigating back? 
    // Usually list should refresh, but for this persistent local addition requirement, 
    // let's fetch only if empty.
    if (store.rockets.length === 0) {
        store.fetchRockets();
    }
});

const goToDetail = (id: string) => {
  router.push(`/rockets/${id}`);
};

const addRocket = () => {
  if (valid.value) {
    // Generate a temporary ID
    newRocket.id = Date.now().toString();
    // Clone to avoid reference issues
    store.addRocket(JSON.parse(JSON.stringify(newRocket)));
    showAddDialog.value = false;
    // Reset form
    Object.assign(newRocket, {
      id: '',
      name: '',
      description: '',
      flickr_images: [''],
      cost_per_launch: 0,
      country: '',
      first_flight: '',
    });
  }
};
</script>

<style scoped>
.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.5);
}
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
