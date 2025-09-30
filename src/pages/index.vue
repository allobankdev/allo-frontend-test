<template>
  <v-container class="py-4">
    <!-- Toolbar with FilterBar -->
    <v-card
      class="mb-6"
    >
      <v-card-text>
        <v-row
          align="center"
        >
          <v-col>
            <FilterBar
              v-model="filters"
              :countries="rocketStore.allCountries"
              @change="handleFilterChange"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showDialog = true"
            >
              Add Rocket
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <LoadingState v-if="rocketStore.status === 'loading'" />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketStore.status === 'error'"
      :message="rocketStore.error"
      @retry="rocketStore.retryFetchRockets"
    />

    <!-- Empty State -->
    <v-card
      v-else-if="rocketStore.count === 0"
      class="text-center py-12"
      flat
    >
      <v-icon
        size="64"
        color="grey-lighten-1"
        class="mb-4"
      >
        mdi-rocket-launch
      </v-icon>
      <h3 class="text-h6 mb-2">
        No rockets found
      </h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Try adjusting your search or add a new rocket
      </p>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showDialog = true"
      >
        Add Rocket
      </v-btn>
    </v-card>

    <!-- Rocket Grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in rocketStore.rockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard
          :rocket="rocket"
          @click="navigateToDetail(rocket.id)"
        />
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <v-dialog
      v-model="showDialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-toolbar
          color="primary"
          density="compact"
        >
          <v-toolbar-title>Add New Rocket</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-4">
          <RocketForm
            v-model="newRocket"
            @submit="handleSubmit"
          >
            <template #actions>
              <v-spacer />
              <v-btn
                variant="text"
                @click="closeDialog"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="isSubmitting"
              >
                Save
              </v-btn>
            </template>
          </RocketForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRocketsStore } from '@/stores/rockets';
import { type Rocket } from '@/types/rocket';
import FilterBar from '@/components/FilterBar.vue';
import RocketCard from '@/components/RocketCard.vue';
import LoadingState from '@/components/LoadingState.vue';
import ErrorState from '@/components/ErrorState.vue';
import RocketForm from '@/components/RocketForm.vue';

const router = useRouter();
const rocketStore = useRocketsStore();

// State
const showDialog = ref(false);
const isSubmitting = ref(false);
const filters = ref({
  search: '',
  country: '',
});

// Form data
const newRocket = ref<Rocket>({
  id: '',
  name: '',
  description: '',
  flickr_images: [''],
  cost_per_launch: 0,
  country: '',
  first_flight: '',
  active: false,
  company: '',
  wikipedia: '',
  success_rate_pct: 0,
});

// Lifecycle
onMounted(() => {
  if (rocketStore.status === 'idle') {
    rocketStore.fetchRockets();
  }
});

// Methods
const handleFilterChange = () => {
  rocketStore.setFilters(filters.value);
};

const navigateToDetail = (id: string) => {
  router.push({ name: '/rockets/[id]', params: { id } });
};

const resetForm = () => {
  newRocket.value = { 
    id: '',
    name: '',
    description: '',
    flickr_images: [''],
    cost_per_launch: 0,
    country: '',
    first_flight: '',
    active: false,
    company: '',
    wikipedia: '',
    success_rate_pct: 0,
  };
};

const closeDialog = () => {
  showDialog.value = false;
  resetForm();
};

const handleSubmit = () => {
  try {
    isSubmitting.value = true;
    rocketStore.addRocket(newRocket.value);
    closeDialog();
  } catch (error) {
    console.error('Failed to add rocket:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>