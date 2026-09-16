<template>
  <v-container>
    <h1 class="mb-4">
      SpaceX Rocket List
    </h1>

    <!-- Loading state -->
    <div
      v-if="store.status === 'loading'"
      class="d-flex justify-center my-8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <!-- Error state -->
    <v-alert
      v-else-if="store.status === 'error'"
      type="error"
      class="mb-4"
    >
      <template #prepend>
        <v-icon class="pt-2">
          mdi-alert-octagon
        </v-icon>
      </template>
      {{ store.errorMessage }}
      <template #append>
        <v-btn
          variant="text"
          @click="store.loadRockets()"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Success state -->
    <template v-else-if="store.status === 'success'">
      <div class="d-flex ga-4 mb-4">
        <RocketFilter
          :model-value="store.filterQuery"
          @update:model-value="store.setFilterQuery"
        />
        <v-btn
          class="mt-3"
          color="primary"
          @click="openAddDialog"
        >
          Add Rocket
        </v-btn>
      </div>

      <v-row>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard
            :rocket="rocket"
            @click="goToDetail(rocket.id)"
          />
        </v-col>
      </v-row>

      <v-alert
        v-if="store.filteredRockets.length === 0"
        type="info"
        class="mt-4"
      >
        No rockets match your filter.
      </v-alert>
    </template>

    <!-- Add Rocket modal -->
    <v-dialog
      v-model="showAddDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>Add a Rocket</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleAddRocket">
            <v-text-field
              v-model="newRocket.name"
              label="Name"
              :rules="[nameRules.required]"
              required
            />
            <v-textarea
              v-model="newRocket.description"
              label="Description"
            />
            <v-text-field
              v-model="newRocket.imageUrl"
              label="Image URL"
            />
            <v-text-field
              v-model="newRocket.costPerLaunch"
              label="Cost per launch"
            />
            <v-text-field
              v-model="newRocket.country"
              label="Country"
            />
            <v-text-field
              v-model="newRocket.firstFlight"
              label="First flight"
              type="date"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-calendar-blank"
              hint="Format: DD/MM/YYYY"
              persistent-hint
            />
            <v-card-actions>
              <v-spacer />
              <v-btn @click="showAddDialog = false">
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
              >
                Add
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useRocketsStore } from "@/stores/rockets";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";

const store = useRocketsStore();
const router = useRouter();

const showAddDialog = ref(false);
const nameError = ref();

const initialRocketState = {
  name: "",
  description: null as string | null,
  imageUrl: null as string | null,
  costPerLaunch: null as string | null,
  country: null as string | null,
  firstFlight: null as string | null,
};

const newRocket = reactive({ ...initialRocketState });


const nameRules = {
  required: (value: string) =>
    !!value?.trim() || "Name is required.",
};

function goToDetail(id: number) {
  router.push({ name: "rocket-detail", params: { id } });
}

function openAddDialog() {
  nameError.value = "";
  showAddDialog.value = true;
}

function handleAddRocket() {
  if (!newRocket.name.trim()) {
    nameError.value = "Name is required.";
    return;
  }

  store.addRocket({ ...newRocket });
  nameError.value = "";
  showAddDialog.value = false;

  Object.assign(newRocket, initialRocketState);
}

onMounted(() => {
  store.loadRockets();
});
</script>
