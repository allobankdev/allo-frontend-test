<template>
  <v-container class="py-5">
    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
      border="start"
      variant="tonal"
    >
      Failed to load rockets.
      <v-btn @click="fetchRockets" text>Retry</v-btn>
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="my-4"
    />

    <v-text-field v-model="filterText" label="Filter Rockets" class="mb-4" />

    <!-- Tombol Show/Hide Form -->
    <v-btn @click="showForm = !showForm" color="primary" class="mb-4">
      {{ showForm ? "Cancel Add Rocket" : "Add Rocket" }}
    </v-btn>

    <!-- Add Rocket Form -->
    <v-expand-transition>
      <div v-if="showForm">
        <v-form @submit.prevent="handleAddRocket" class="mb-6">
          <v-text-field v-model="newRocket.name" label="Name" required />
          <v-text-field
            v-model="newRocket.description"
            label="Description"
            required
          />
          <v-text-field
            v-model="newRocket.flickr_images[0]"
            label="Image URL"
          />
          <v-text-field v-model="newRocket.country" label="Country" />
          <v-text-field v-model="newRocket.first_flight" label="First Flight" />
          <v-text-field
            v-model.number="newRocket.cost_per_launch"
            label="Cost Per Launch"
            type="number"
          />
          <v-btn type="submit" color="success" class="mt-2">Save Rocket</v-btn>
        </v-form>
      </div>
    </v-expand-transition>

    <!-- Rocket List -->
    <v-row dense>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="hoverable">
          <v-img
            v-if="rocket.flickr_images?.length"
            :src="rocket.flickr_images[0]"
            height="200px"
            @click="$router.push(`/${rocket.id}`)"
          />
          <v-card-title>{{ rocket.name }}</v-card-title>
          <v-card-text>{{ rocket.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="$router.push(`/${rocket.id}`)"
              >Detail</v-btn
            >
            <v-spacer />
            <template v-if="isCustomRocket(rocket.id)">
              <v-btn icon="mdi-pencil" @click="openEditDialog(rocket)" />
              <v-btn icon="mdi-delete" @click="deleteRocket(rocket.id)" />
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Rocket Dialog -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit Rocket</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editRocket.name" label="Name" required />
            <v-text-field
              v-model="editRocket.description"
              label="Description"
              required
            />
            <v-text-field
              v-model="editRocket.flickr_images[0]"
              label="Image URL"
            />
            <v-text-field v-model="editRocket.country" label="Country" />
            <v-text-field
              v-model="editRocket.first_flight"
              label="First Flight"
            />
            <v-text-field
              v-model.number="editRocket.cost_per_launch"
              label="Cost Per Launch"
              type="number"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveEdit">Save</v-btn>
          <v-btn text @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";

interface Rocket {
  id: string;
  name: string;
  description: string;
  cost_per_launch: number;
  country: string;
  first_flight: string;
  flickr_images: string[];
}

const rockets = ref<Rocket[]>([]);
const customRockets = ref<Rocket[]>([]);
const loading = ref(true);
const error = ref(false);
const filterText = ref("");
const showForm = ref(false); // ⬅️ kontrol tampil/tidaknya form

const newRocket = ref<Rocket>({
  id: "",
  name: "",
  description: "",
  cost_per_launch: 0,
  country: "",
  first_flight: "",
  flickr_images: [""],
});

const fetchRockets = async () => {
  loading.value = true;
  error.value = false;
  try {
    const res = await fetch("https://api.spacexdata.com/v4/rockets");
    rockets.value = await res.json();
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleAddRocket = () => {
  const rocket = {
    ...newRocket.value,
    id: crypto.randomUUID(),
  };
  customRockets.value.push(rocket);
  newRocket.value = {
    id: "",
    name: "",
    description: "",
    cost_per_launch: 0,
    country: "",
    first_flight: "",
    flickr_images: [""],
  };
  showForm.value = false; // ⬅️ sembunyikan form setelah submit
};

const deleteRocket = (id: string) => {
  customRockets.value = customRockets.value.filter((r) => r.id !== id);
};

const isCustomRocket = (id: string) => {
  return customRockets.value.some((r) => r.id === id);
};

const editDialog = ref(false);
const editRocket = ref<Rocket>({
  id: "",
  name: "",
  description: "",
  cost_per_launch: 0,
  country: "",
  first_flight: "",
  flickr_images: [""],
});

const openEditDialog = (rocket: Rocket) => {
  editRocket.value = JSON.parse(JSON.stringify(rocket));
  editDialog.value = true;
};

const saveEdit = () => {
  const index = customRockets.value.findIndex(
    (r) => r.id === editRocket.value.id
  );
  if (index !== -1) {
    customRockets.value[index] = JSON.parse(JSON.stringify(editRocket.value));
  }
  editDialog.value = false;
};

const allRockets = computed(() => [...customRockets.value, ...rockets.value]);

const filteredRockets = computed(() =>
  allRockets.value.filter((rocket) =>
    rocket.name.toLowerCase().includes(filterText.value.toLowerCase())
  )
);

onMounted(() => {
  fetchRockets();
  const saved = localStorage.getItem("custom-rockets");
  if (saved) {
    customRockets.value = JSON.parse(saved);
  }
});

watch(
  customRockets,
  (val) => {
    localStorage.setItem("custom-rockets", JSON.stringify(val));
  },
  { deep: true }
);
</script>

<style scoped>
.hoverable {
  cursor: pointer;
  transition: 0.3s;
}
.hoverable:hover {
  transform: scale(1.02);
}
</style>
